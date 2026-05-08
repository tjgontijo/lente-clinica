import "dotenv/config";
import { db } from "./db";
import * as schema from "./schema";

async function main() {
  console.log("🌱 Seeding database (UUID Mode)...");

  // 1. Medication Classes
  console.log("Inserting Medication Classes...");
  const [classIsrs] = await db
    .insert(schema.medicationClass)
    .values({
      name: "ISRS",
      description: "Inibidores Seletivos da Recaptação de Serotonina",
    })
    .onConflictDoNothing()
    .returning();

  const [_classBenzo] = await db
    .insert(schema.medicationClass)
    .values({
      name: "Benzodiazepínico",
      description: "Ansiolíticos e Sedativos",
    })
    .onConflictDoNothing()
    .returning();

  // 2. Medications
  console.log("Inserting Medications...");
  if (classIsrs) {
    const [escitalopram] = await db
      .insert(schema.medication)
      .values({
        classId: classIsrs.id,
        name: "Escitalopram",
        commercialNames: ["Lexapro", "Exodus"],
        clinicalPhrase:
          "Equilibra o humor com menor perfil de efeitos colaterais.",
      })
      .onConflictDoNothing()
      .returning();

    // 3. Symptom Categories
    console.log("Inserting Symptom Categories...");
    const [catPsic] = await db
      .insert(schema.symptomCategory)
      .values({ name: "Psiquiátricos" })
      .onConflictDoNothing()
      .returning();

    if (catPsic && escitalopram) {
      // 4. Symptoms
      console.log("Inserting Symptoms...");
      const [symptomIdeacao] = await db
        .insert(schema.symptom)
        .values({
          categoryId: catPsic.id,
          name: "Ideação Suicida",
          whatItLooksLike:
            "Pensamentos recorrentes sobre morte ou autoextermínio.",
          keyQuestion:
            "Você tem tido pensamentos de que a vida não vale a pena?",
        })
        .onConflictDoNothing()
        .returning();

      if (symptomIdeacao) {
        // 5. Alerts
        console.log("Inserting Alerts...");
        await db
          .insert(schema.medicationSymptomAlert)
          .values({
            medicationId: escitalopram.id,
            symptomId: symptomIdeacao.id,
            severity: "RED",
            context:
              "Risco aumentado em jovens nas primeiras 2 semanas de uso.",
          })
          .onConflictDoNothing();
      }
    }
  }

  // 6. Communication Templates
  console.log("Inserting Communication Templates...");
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
