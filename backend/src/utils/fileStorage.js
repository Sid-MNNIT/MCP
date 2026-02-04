import fs from "fs";
import path from "path";

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function savePdfToDisk({ userId, buffer, filename = "resume.pdf" }) {
  const uploadsDir = path.join(process.cwd(), "uploads", "resumes");
  ensureDir(uploadsDir);

  // overwrite same resume always (1 resume per user)
  const safeName = `${userId}.pdf`;
  const filePath = path.join(uploadsDir, safeName);

  fs.writeFileSync(filePath, buffer);

  return filePath;
}
