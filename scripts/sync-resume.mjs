import { execFile } from "node:child_process";
import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";

const runFile = promisify(execFile);

const defaultResumeSource = String.raw`D:\Job Related\Resume\Mar_Kevin_Alcantara_Resume.pdf`;
const source = process.env.PORTFOLIO_RESUME_SOURCE?.trim() || defaultResumeSource;
const target = path.join(process.cwd(), "public", "assets", "resume.pdf");
const previewDirectory = path.join(process.cwd(), "public", "assets", "images");
const previewPrefix = path.join(previewDirectory, "resume-preview");
const previewTarget = `${previewPrefix}.png`;

async function fileExists(filePath) {
  try {
    const details = await stat(filePath);
    return details.isFile();
  } catch {
    return false;
  }
}

if (!(await fileExists(source))) {
  if (await fileExists(target)) {
    console.log(`Resume source is unavailable; keeping deployment copy at ${target}`);
    process.exit(0);
  }

  throw new Error(`Resume source was not found at ${source}`);
}

if (path.extname(source).toLowerCase() !== ".pdf") {
  throw new Error(`Resume source must be a PDF: ${source}`);
}

await mkdir(path.dirname(target), { recursive: true });
await mkdir(previewDirectory, { recursive: true });
await copyFile(source, target);

try {
  await runFile("pdftoppm", [
    "-f", "1",
    "-singlefile",
    "-png",
    "-r", "180",
    target,
    previewPrefix,
  ]);
  console.log(`Resume and one-page preview synchronized from ${source}`);
} catch (error) {
  if (!(await fileExists(previewTarget))) {
    throw new Error(`Resume was copied, but its preview could not be rendered: ${error}`);
  }

  console.warn("Resume synchronized; keeping the existing preview because pdftoppm is unavailable.");
}
