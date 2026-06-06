import "dotenv/config";
import { and, asc, eq, isNotNull } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { db } from "@/server/db/db";
import { medication, medicationClass } from "@/server/db/schema";

async function main() {
  console.log("🔍 Buscando medicamentos enriquecidos para o manual...");

  // 1. Buscar classes que possuem medicamentos enriquecidos
  const classes = await db.query.medicationClass.findMany({
    orderBy: [asc(medicationClass.name)],
    with: {
      medications: {
        where: and(
          isNotNull(medication.clinicalPhrase),
          eq(medication.shouldEnrichWithLlm, true),
        ),
        orderBy: [asc(medication.name)],
        with: {
          products: true,
        },
      },
    },
  });

  // 2. Filtrar apenas classes que tenham pelo menos um medicamento enriquecido
  const enrichedClasses = classes.filter((c) => c.medications.length > 0);

  console.log(
    `📂 Encontradas ${enrichedClasses.length} classes com conteúdo clínico.`,
  );

  // 3. Formatar os dados para o JSON do Manual
  const manualData = enrichedClasses.map((c) => {
    // Usar um Map para garantir que cada substância seja única nesta classe
    const uniqueMedsMap = new Map();

    c.medications.forEach((m) => {
      const substanceName = m.name.toLowerCase().trim();

      // Se já processamos esta substância, ignoramos a duplicata
      if (uniqueMedsMap.has(substanceName)) return;

      // Agrupar nomes comerciais únicos
      const commercialNames = Array.from(
        new Set(m.products.map((p) => p.productName)),
      ).join(", ");

      // Mapear Domínios Clínicos
      const domainsText =
        (m.clinicalDomains as any[])
          ?.map((d) => `<b>${d.name}:</b> ${d.content}`)
          .join("<br/><br/>") || "";

      // Mapear Perguntas Úteis
      const questionsText =
        (m.sessionDiscriminationQuestions as string[])?.join(" | ") || "";

      // Mapear Cenários de Comunicação
      const scenariosText =
        (m.communicationScenarios as string[])?.join(" | ") || "";

      // Mapear Sinais de Alerta Vermelhos (Urgência)
      const redSignals =
        (m.attentionSignals as any[])
          ?.filter((s) => s.level === "vermelho")
          .map((s) => `${s.signal}: ${s.action}`)
          .join(" | ") || "Nenhum sinal crítico imediato relatado.";

      uniqueMedsMap.set(substanceName, {
        id: m.id,
        substance: m.name,
        commercialNames: commercialNames || "N/A",
        description: m.description || "",
        domains: domainsText,
        discriminationQuestions: questionsText,
        communicationScenarios: scenariosText,
        urgencySignals: redSignals,
        clinicalPhrase: m.clinicalPhrase || "",
      });
    });

    return {
      className: c.name,
      classDescription: c.description || "",
      medications: Array.from(uniqueMedsMap.values()),
    };
  });

  // 4. Salvar o arquivo
  const outputPath = path.join(process.cwd(), "manual_data.json");
  fs.writeFileSync(outputPath, JSON.stringify(manualData, null, 2));

  const totalMeds = manualData.reduce(
    (acc, c) => acc + c.medications.length,
    0,
  );
  console.log(`✅ JSON gerado com sucesso: ${outputPath}`);
  console.log(
    `📊 Total: ${totalMeds} medicamentos organizados em ${manualData.length} classes.`,
  );
}

main().catch(console.error);
