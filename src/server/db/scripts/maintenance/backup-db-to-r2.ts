import { exec } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { promisify } from "node:util";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

const execPromise = promisify(exec);

// Load environment variables
const envPath = path.resolve(process.cwd(), ".env");
config({ path: envPath });

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable`);
  return value;
}

// R2 Configuration
const r2Client = new S3Client({
  region: "auto",
  endpoint: getRequiredEnv("BACKUP_R2_ENDPOINT"),
  credentials: {
    accessKeyId: getRequiredEnv("BACKUP_R2_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("BACKUP_R2_SECRET_ACCESS_KEY"),
  },
});

const bucketName = process.env.BACKUP_R2_BUCKET_NAME || "backups";
const folderName = process.env.BACKUP_R2_FOLDER || "backups";
const databaseUrl = getRequiredEnv("DATABASE_URL");

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `lente-clinica-backup-${timestamp}.sql.gz`;

  // Usar pasta tmp do sistema ou scratch
  const scratchDir = path.join(process.cwd(), "scratch");
  const filePath = path.join(scratchDir, fileName);

  // Ensure scratch directory exists
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir);
  }

  console.log(`📦 Iniciando backup compactado do banco de dados: ${fileName}`);

  try {
    // 1. Executar pg_dump e compactar com gzip
    console.log("⏳ Gerando dump SQL compactado...");

    // Adicionamos sslmode se necessário, mas o DATABASE_URL já deve ter
    const connectionUrl = databaseUrl;

    // Usamos o pipe para compactar "on the fly"
    // Adicionamos --clean --if-exists para que o restore consiga sobrescrever dados existentes
    await execPromise(
      `pg_dump --clean --if-exists "${connectionUrl}" | gzip > "${filePath}"`,
    );

    // 2. Upload para o R2
    console.log(`📤 Fazendo upload para o R2 (Bucket: ${bucketName})...`);
    const fileStream = fs.createReadStream(filePath);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `${folderName}/${fileName}`,
        Body: fileStream,
        ContentType: "application/gzip",
      }),
    );

    console.log(`✅ Backup concluído e salvo em: ${folderName}/${fileName}`);

    // 3. Limpar arquivo local
    fs.unlinkSync(filePath);
    console.log("🧹 Arquivo temporário local removido.");
  } catch (error) {
    console.error("❌ Falha no processo de backup:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    process.exit(1);
  }
}

backupDatabase().catch((error) => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});
