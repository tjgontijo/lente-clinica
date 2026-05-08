import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { inArray } from "drizzle-orm";
import { db } from "./db";
import * as schema from "./schema";

type TsvRow = {
  SUBSTANCIA: string;
  PRODUTO: string;
  CLASSE_TERAPEUTICA: string;
  TIPO_PRODUTO: string;
  TARJA: string;
};

const LLM_ENRICHMENT_CLASS_CODES = new Set([
  "N3A",
  "N5A1",
  "N5A9",
  "N5B1",
  "N5C",
  "N6A2",
  "N6A3",
  "N6A4",
  "N6A5",
  "N6A9",
  "N6B",
  "N6C",
  "N6D",
  "N6E",
  "N2D",
  "N7D1",
  "N7D9",
  "N7E",
  "N7F",
  "N7X",
  "N2A",
]);
const INSERT_CHUNK_SIZE = 500;
const LOWERCASE_CONNECTORS = new Set([
  "a",
  "as",
  "o",
  "os",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "em",
  "na",
  "no",
  "nas",
  "nos",
  "para",
  "por",
  "com",
]);
const UPPERCASE_TERMS = new Set([
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii",
  "viii",
  "ix",
  "x",
  "xi",
  "xii",
  "eca",
  "snc",
  "ssri",
  "snri",
  "cgrp",
  "tea",
  "tdah",
  "toc",
  "tept",
  "DPP-IV",
]);

function normalizeHeader(header: string) {
  return header
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\u00A0/g, " ")
    .trim()
    .toUpperCase();
}

function splitClass(raw: string) {
  const trimmed = raw.trim();
  const match = trimmed.match(/^([A-Z0-9]+)\s*-\s*(.+)$/);
  if (!match) return { name: trimmed, description: null as string | null };
  const code = match[1];
  const description = match[2];
  if (!code || !description) {
    return { name: trimmed, description: null as string | null };
  }
  return { name: code, description: formatDisplayName(description.trim()) };
}

function capitalizePtWord(word: string) {
  if (!word) return word;
  const [first, ...rest] = [...word];
  return `${first.toLocaleUpperCase("pt-BR")}${rest.join("")}`;
}

function formatDisplayName(raw: string) {
  const normalized = raw.toLocaleLowerCase("pt-BR").replace(/\s+/g, " ").trim();
  if (!normalized) return normalized;

  let wordIndex = 0;
  return normalized.replace(/\p{L}[\p{L}\p{N}]*/gu, (word) => {
    if (UPPERCASE_TERMS.has(word)) {
      wordIndex += 1;
      return word.toLocaleUpperCase("pt-BR");
    }

    if (word === "á") {
      wordIndex += 1;
      return wordIndex > 1 ? "à" : "Á";
    }

    const keepLower = wordIndex > 0 && LOWERCASE_CONNECTORS.has(word);
    wordIndex += 1;
    if (keepLower) return word;
    return capitalizePtWord(word);
  });
}

function normalizeRegulatoryLabel(raw: string) {
  const value = raw.replace(/\s+/g, " ").trim();
  if (!value) return null;
  if (value === "- (*)" || value === "-(*)") return null;
  return formatDisplayName(value);
}

async function readMedicationRowsFromTsv(): Promise<TsvRow[]> {
  const filePath = path.resolve(
    process.cwd(),
    "docs/contexto/medicamentos.tsv",
  );
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const firstLine = lines[0];
  if (!firstLine) {
    throw new Error("TSV vazio.");
  }
  const headers = firstLine.split("\t").map(normalizeHeader);
  const substanceIdx = headers.indexOf("SUBSTANCIA");
  const productIdx = headers.indexOf("PRODUTO");
  const classIdx = headers.indexOf("CLASSE TERAPEUTICA");
  const productTypeIdx = headers.indexOf("TIPO DE PRODUTO (STATUS DO PRODUTO)");
  const regulatoryLabelIdx = headers.indexOf("TARJA");

  if (
    substanceIdx < 0 ||
    productIdx < 0 ||
    classIdx < 0 ||
    productTypeIdx < 0 ||
    regulatoryLabelIdx < 0
  ) {
    throw new Error("TSV inválido: colunas obrigatórias não encontradas.");
  }

  return lines.slice(1).map((line) => {
    const cols = line.split("\t");
    return {
      SUBSTANCIA: (cols[substanceIdx] ?? "").trim(),
      PRODUTO: (cols[productIdx] ?? "").trim(),
      CLASSE_TERAPEUTICA: (cols[classIdx] ?? "").trim(),
      TIPO_PRODUTO: (cols[productTypeIdx] ?? "").trim(),
      TARJA: (cols[regulatoryLabelIdx] ?? "").trim(),
    };
  });
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function main() {
  console.log("🌱 Seeding database from TSV...");
  const rows = await readMedicationRowsFromTsv();
  console.log(`Loaded ${rows.length} rows from TSV`);

  const classCatalog = new Map<string, { description: string | null }>();
  const medBySubstance = new Map<
    string,
    {
      classCode: string;
      substance: string;
      products: Map<
        string,
        {
          productName: string;
          productType: string | null;
          regulatoryLabel: string | null;
        }
      >;
    }
  >();

  for (const row of rows) {
    if (!row.SUBSTANCIA || !row.CLASSE_TERAPEUTICA) continue;
    const classInfo = splitClass(row.CLASSE_TERAPEUTICA);
    if (!classInfo.name) continue;
    if (!classCatalog.has(classInfo.name)) {
      classCatalog.set(classInfo.name, { description: classInfo.description });
    }

    const formattedSubstance = formatDisplayName(row.SUBSTANCIA);
    const key = formattedSubstance.toLowerCase();
    const formattedProduct = row.PRODUTO ? formatDisplayName(row.PRODUTO) : "";
    const existing = medBySubstance.get(key);
    if (!existing) {
      const products = new Map<
        string,
        {
          productName: string;
          productType: string | null;
          regulatoryLabel: string | null;
        }
      >();
      if (row.PRODUTO) {
        const regulatoryLabel = normalizeRegulatoryLabel(row.TARJA);
        products.set(
          [
            formattedProduct.toLowerCase(),
            row.TIPO_PRODUTO.toLowerCase(),
            (regulatoryLabel ?? "__null__").toLowerCase(),
          ].join("|"),
          {
            productName: formattedProduct,
            productType: row.TIPO_PRODUTO || null,
            regulatoryLabel,
          },
        );
      }
      medBySubstance.set(key, {
        classCode: classInfo.name,
        substance: formattedSubstance,
        products,
      });
      continue;
    }
    if (row.PRODUTO) {
      const regulatoryLabel = normalizeRegulatoryLabel(row.TARJA);
      existing.products.set(
        [
          formattedProduct.toLowerCase(),
          row.TIPO_PRODUTO.toLowerCase(),
          (regulatoryLabel ?? "__null__").toLowerCase(),
        ].join("|"),
        {
          productName: formattedProduct,
          productType: row.TIPO_PRODUTO || null,
          regulatoryLabel,
        },
      );
    }
  }

  const classPayload = [...classCatalog.entries()].map(([name, info]) => ({
    name,
    description: info.description,
    shouldEnrichWithLlm: LLM_ENRICHMENT_CLASS_CODES.has(name),
  }));
  console.log(`Upserting ${classPayload.length} therapeutic classes...`);
  await db
    .insert(schema.medicationClass)
    .values(classPayload)
    .onConflictDoUpdate({
      target: schema.medicationClass.name,
      set: {
        description: schema.medicationClass.description,
        shouldEnrichWithLlm: schema.medicationClass.shouldEnrichWithLlm,
      },
    });

  const classNames = classPayload.map((item) => item.name);
  const classes = await db.query.medicationClass.findMany({
    where: inArray(schema.medicationClass.name, classNames),
    columns: { id: true, name: true },
  });
  const classByCode = new Map(classes.map((klass) => [klass.name, klass.id]));

  console.log(`Upserting ${medBySubstance.size} medications...`);
  const medicationPayload = [...medBySubstance.values()]
    .map((med) => {
      const classId = classByCode.get(med.classCode);
      if (!classId) return null;
      return {
        classId,
        name: med.substance,
        shouldEnrichWithLlm: LLM_ENRICHMENT_CLASS_CODES.has(med.classCode),
      };
    })
    .filter((item) => item !== null);

  for (const batch of chunkArray(medicationPayload, INSERT_CHUNK_SIZE)) {
    await db.insert(schema.medication).values(batch).onConflictDoNothing();
  }

  const medicationNames = medicationPayload.map((item) => item.name);
  const medicationRows = await db.query.medication.findMany({
    where: inArray(schema.medication.name, medicationNames),
    columns: { id: true, name: true },
  });
  const medicationIdByName = new Map(
    medicationRows.map((medication) => [
      medication.name.toLowerCase(),
      medication.id,
    ]),
  );

  const productPayload = [...medBySubstance.values()].flatMap((med) => {
    const medicationId = medicationIdByName.get(med.substance.toLowerCase());
    if (!medicationId) return [];
    return [...med.products.values()].map((product) => ({
      medicationId,
      productName: product.productName,
      productType: product.productType,
      regulatoryLabel: product.regulatoryLabel,
    }));
  });

  console.log(`Upserting ${productPayload.length} medication products...`);
  for (const batch of chunkArray(productPayload, INSERT_CHUNK_SIZE)) {
    await db
      .insert(schema.medicationProduct)
      .values(batch)
      .onConflictDoNothing();
  }

  await db
    .insert(schema.communicationTemplate)
    .values({
      scenarioId: "alerta_urgencia_geral",
      urgencyLevel: "RED",
      contentShort:
        "Olá, Dr(a). Sou a psicóloga do(a) [iniciais]. Notei piora importante em [sintomas] nas últimas 2 semanas. [iniciais] está em uso de [medicação]. Gostaria de alinhar a conduta.",
      contentMedium:
        "Prezado(a) Dr(a). Sou a psicóloga clínica do(a) paciente [iniciais], [idade] anos. Durante a última sessão, observei um agravamento significativo em [sintomas]. Como o paciente está em uso de [medicação], achei prudente comunicá-lo(a) para avaliarmos se há necessidade de ajuste ou revisão. Atenciosamente.",
    })
    .onConflictDoNothing();

  console.log("✅ Seeding completed.");
}

main().catch((err) => {
  console.error("❌ Seeding failed:");
  console.error(err);
  process.exit(1);
});
