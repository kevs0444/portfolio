import { copyFile, mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extractText, getDocumentProxy, getMeta } from "unpdf";

const defaultCertificatesSource = String.raw`D:\Job Related\Certificate`;
const sourceRoot = process.env.PORTFOLIO_CERTIFICATES_SOURCE?.trim() || defaultCertificatesSource;

const repoRoot = process.cwd();
const overridesPath = path.join(repoRoot, "app", "data", "certificates.overrides.json");
const generatedTsPath = path.join(repoRoot, "app", "data", "generated-certificates.ts");
const targetImagesDir = path.join(repoRoot, "public", "assets", "images", "certifications");
const vaultCertsDir = path.join(repoRoot, "Portfolio", "05-Certifications");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const ISSUER_MAP = {
  CISCO: "Cisco Networking Academy",
  DATACAMP: "DataCamp",
};

const MONTHS = {
  JAN: { num: "01", label: "Jan" },
  JANUARY: { num: "01", label: "Jan" },
  FEB: { num: "02", label: "Feb" },
  FEBRUARY: { num: "02", label: "Feb" },
  MAR: { num: "03", label: "Mar" },
  MARCH: { num: "03", label: "Mar" },
  APR: { num: "04", label: "Apr" },
  APRIL: { num: "04", label: "Apr" },
  MAY: { num: "05", label: "May" },
  JUN: { num: "06", label: "Jun" },
  JUNE: { num: "06", label: "Jun" },
  JUL: { num: "07", label: "Jul" },
  JULY: { num: "07", label: "Jul" },
  AUG: { num: "08", label: "Aug" },
  AUGUST: { num: "08", label: "Aug" },
  SEP: { num: "09", label: "Sep" },
  SEPT: { num: "09", label: "Sep" },
  SEPTEMBER: { num: "09", label: "Sep" },
  OCT: { num: "10", label: "Oct" },
  OCTOBER: { num: "10", label: "Oct" },
  NOV: { num: "11", label: "Nov" },
  NOVEMBER: { num: "11", label: "Nov" },
  DEC: { num: "12", label: "Dec" },
  DECEMBER: { num: "12", label: "Dec" },
};

async function pathType(targetPath) {
  try {
    const info = await stat(targetPath);
    if (info.isDirectory()) return "dir";
    if (info.isFile()) return "file";
    return null;
  } catch {
    return null;
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripCiscoSuffix(stem) {
  return stem.replace(/Update\d{8}(?:-[a-z0-9]+)*$/i, "");
}

function splitCamelOrTitle(raw) {
  return raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatIssuer(folderName) {
  const upper = folderName.toUpperCase();
  if (ISSUER_MAP[upper]) return ISSUER_MAP[upper];
  return splitCamelOrTitle(folderName).replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function normalizeDateParts(monthRaw, dayRaw, yearRaw) {
  const monthInfo = MONTHS[monthRaw.toUpperCase()];
  if (!monthInfo) return null;
  const dayNum = Number.parseInt(dayRaw, 10);
  if (!Number.isFinite(dayNum)) return null;
  return {
    iso: `${yearRaw}-${monthInfo.num}-${String(dayNum).padStart(2, "0")}`,
    display: `${monthInfo.label} ${dayNum}, ${yearRaw}`,
  };
}

function parseIsoDate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIdx = Number.parseInt(match[2], 10) - 1;
  const dayNum = Number.parseInt(match[3], 10);
  if (monthIdx < 0 || monthIdx > 11) return null;
  return `${monthNames[monthIdx]} ${dayNum}, ${match[1]}`;
}

function extractPdfDetails(text, metaInfo, filenameStem) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let title = "";
  let hours = null;
  let completedDate = "";
  let displayDate = "";
  let credentialId = "";
  let credentialUrl = "";
  let format = "";

  // Check PDF metadata title for DataCamp verification URL
  const metaTitle = typeof metaInfo?.Title === "string" ? metaInfo.Title : "";
  const dcUrlMatch = metaTitle.match(/datacamp\.com\/(?:completed\/)?statement-of-accomplishment\/course\/([a-f0-9]{20,})/i);
  if (dcUrlMatch) {
    credentialId = dcUrlMatch[1];
    credentialUrl = `https://www.datacamp.com/completed/statement-of-accomplishment/course/${credentialId}`;
    format = "Statement of accomplishment";
  }

  // Parse DataCamp course title ("FOR SUCCESSFULLY COMPLETING" -> next line)
  for (let i = 0; i < lines.length; i += 1) {
    const normalized = lines[i].replace(/\s+/g, "").toUpperCase();
    if (normalized === "FORSUCCESSFULLYCOMPLETING" && lines[i + 1]) {
      title = lines[i + 1].trim();
      break;
    }
  }

  // Parse hours ("3 HRS" / "4 HRS")
  const hoursMatch = text.match(/\b(\d+)\s*HRS?\b/i);
  if (hoursMatch) {
    const count = Number.parseInt(hoursMatch[1], 10);
    hours = count === 1 ? "1 hour" : `${count} hours`;
  }

  // Parse completion or issued date
  const dateMatch = text.match(/\b(JAN(?:UARY)?|FEB(?:RUARY)?|MAR(?:CH)?|APR(?:IL)?|MAY|JUN(?:E)?|JUL(?:Y)?|AUG(?:UST)?|SEP(?:T(?:EMBER)?)?|OCT(?:OBER)?|NOV(?:EMBER)?|DEC(?:EMBER)?)\s+(\d{1,2}),\s+(\d{4})\b/i);
  if (dateMatch) {
    const parsed = normalizeDateParts(dateMatch[1], dateMatch[2], dateMatch[3]);
    if (parsed) {
      completedDate = parsed.iso;
      displayDate = parsed.display;
    }
  }

  // Fallback date from Cisco filename ("UpdateYYYYMMDD")
  if (!completedDate) {
    const fnDate = filenameStem.match(/Update(\d{4})(\d{2})(\d{2})/i);
    if (fnDate) {
      completedDate = `${fnDate[1]}-${fnDate[2]}-${fnDate[3]}`;
      displayDate = parseIsoDate(completedDate) || "";
    }
  }

  return {
    title,
    hours,
    completedDate,
    displayDate,
    credentialId,
    credentialUrl,
    format,
  };
}

async function listFilesRecursive(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(full)));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function findMatchingImage(pdfBaseSlug, issuerFiles, aliases) {
  const canonicalPdfSlug = aliases[pdfBaseSlug] || pdfBaseSlug;
  const images = issuerFiles.filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()));

  // Prefer exact normalized slug match (with alias), prioritizing Badges/ directory
  const sortedImages = [...images].sort((a, b) => {
    const aBadge = a.toLowerCase().includes(`${path.sep}badges${path.sep}`) ? 0 : 1;
    const bBadge = b.toLowerCase().includes(`${path.sep}badges${path.sep}`) ? 0 : 1;
    return aBadge - bBadge;
  });

  for (const imgPath of sortedImages) {
    const imgStem = path.basename(imgPath, path.extname(imgPath));
    // Normalize version suffixes like python-essentials-1.1 -> python-essentials-1
    const imgSlug = slugify(imgStem.replace(/\.\d+$/, ""));
    const rawImgSlug = slugify(imgStem);
    if (imgSlug === canonicalPdfSlug || imgSlug === pdfBaseSlug || rawImgSlug === canonicalPdfSlug || rawImgSlug === pdfBaseSlug) {
      return imgPath;
    }
  }

  // Fallback: prefix match when badge image includes minor version suffix
  for (const imgPath of sortedImages) {
    const imgStem = path.basename(imgPath, path.extname(imgPath));
    const imgSlug = slugify(imgStem);
    if (imgSlug.startsWith(canonicalPdfSlug) || canonicalPdfSlug.startsWith(imgSlug)) {
      return imgPath;
    }
  }

  return null;
}

function yamlValue(value) {
  return JSON.stringify(value ?? "");
}

function renderVaultNote(cert, bopOrder) {
  const lines = [
    "---",
    "type: certification",
    `title: ${yamlValue(cert.title)}`,
    `issuer: ${yamlValue(cert.issuer)}`,
    `completed: ${yamlValue(cert.completedDate || "")}`,
    `format: ${yamlValue(cert.format)}`,
    `detail: ${yamlValue(cert.detail)}`,
    `credential_id: ${yamlValue(cert.credentialId || "")}`,
    `credential_url: ${yamlValue(cert.credentialUrl || "")}`,
    `image: ${yamlValue(cert.image)}`,
    "bop_ai: true",
    `bop_order: ${bopOrder}`,
    "auto_synced: true",
    "---",
    "",
    `# ${cert.title}`,
    "",
    `- Certificate: ${cert.title}`,
    `- Issuer: ${cert.issuer}`,
    `- Format: ${cert.format}`,
    `- Details: ${cert.detail}`,
    cert.credentialId ? `- Credential ID: ${cert.credentialId}` : null,
    cert.credentialUrl ? `- Verification URL: ${cert.credentialUrl}` : null,
    "",
    "Related: [[Certifications-MOC]] | [[00-Home]]",
    "",
  ].filter((line) => line !== null);

  return lines.join("\n");
}

async function main() {
  if ((await pathType(sourceRoot)) !== "dir") {
    if ((await pathType(generatedTsPath)) === "file") {
      console.log(`Certificate source is unavailable; keeping committed certificates at ${generatedTsPath}`);
      process.exit(0);
    }
    throw new Error(`Certificate source directory was not found at ${sourceRoot}`);
  }

  let overridesConfig = { aliases: {}, certificates: {} };
  if ((await pathType(overridesPath)) === "file") {
    overridesConfig = JSON.parse(await readFile(overridesPath, "utf8"));
  }
  const aliases = overridesConfig.aliases || {};
  const overrides = overridesConfig.certificates || {};

  const topEntries = await readdir(sourceRoot, { withFileTypes: true });
  const issuerDirs = topEntries.filter((entry) => entry.isDirectory());

  const records = [];

  for (const issuerEntry of issuerDirs) {
    const issuerFolder = issuerEntry.name;
    const issuerDirPath = path.join(sourceRoot, issuerFolder);
    const defaultIssuer = formatIssuer(issuerFolder);
    const issuerFiles = await listFilesRecursive(issuerDirPath);
    const pdfFiles = issuerFiles.filter((file) => path.extname(file).toLowerCase() === ".pdf");

    for (const pdfPath of pdfFiles) {
      const stem = path.basename(pdfPath, ".pdf");
      const cleanedStem = stripCiscoSuffix(stem);
      const rawSlug = slugify(splitCamelOrTitle(cleanedStem));
      const slug = aliases[rawSlug] || rawSlug;
      const override = overrides[slug] || {};

      const bytes = new Uint8Array(await readFile(pdfPath));
      const pdf = await getDocumentProxy(bytes);
      const meta = await getMeta(pdf);
      const textResult = await extractText(pdf, { mergePages: true });
      const extracted = extractPdfDetails(textResult.text || "", meta?.info || {}, stem);

      const title = override.title || extracted.title || splitCamelOrTitle(cleanedStem);
      const issuer = override.issuer || defaultIssuer;
      const format =
        override.format ||
        extracted.format ||
        (issuer.toLowerCase().includes("cisco") ? "Course badge" : "Statement of accomplishment");
      const completedDate = override.completedDate || extracted.completedDate || undefined;
      const displayDate =
        (completedDate ? parseIsoDate(completedDate) : "") || extracted.displayDate;

      let detail = override.detail || "";
      if (!detail) {
        const parts = [];
        if (extracted.hours) parts.push(extracted.hours);
        if (displayDate) parts.push(`Completed ${displayDate}`);
        detail = parts.join(" — ") || `${issuer} credential`;
      }

      const credentialId = override.credentialId || extracted.credentialId || undefined;
      const credentialUrl = override.credentialUrl || extracted.credentialUrl || undefined;

      // Locate and copy preview image
      const matchedImage = findMatchingImage(rawSlug, issuerFiles, aliases);
      let publicImagePath = override.image || "";
      if (matchedImage) {
        const ext = path.extname(matchedImage).toLowerCase();
        const destFilename = `${slug}${ext}`;
        await mkdir(targetImagesDir, { recursive: true });
        await copyFile(matchedImage, path.join(targetImagesDir, destFilename));
        publicImagePath = `/assets/images/certifications/${destFilename}`;
      }

      if (!publicImagePath) {
        console.warn(`Warning: No preview image found for ${pdfPath}; skipping.`);
        continue;
      }

      records.push({
        slug,
        title,
        issuer,
        image: publicImagePath,
        detail,
        format,
        ...(completedDate ? { completedDate } : {}),
        ...(credentialId ? { credentialId } : {}),
        ...(credentialUrl ? { credentialUrl } : {}),
        _order: typeof override.order === "number" ? override.order : null,
      });
    }
  }

  // Sort by explicit order if provided, otherwise newest completedDate first, then title
  records.sort((a, b) => {
    if (a._order !== null && b._order !== null && a._order !== b._order) return a._order - b._order;
    if (a._order !== null && b._order === null) return -1;
    if (a._order === null && b._order !== null) return 1;
    const dateA = a.completedDate || "0000-00-00";
    const dateB = b.completedDate || "0000-00-00";
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return a.title.localeCompare(b.title);
  });

  const cleanRecords = records.map(({ _order, ...rest }) => rest);

  // Write TypeScript module consumed by app/page.tsx
  await mkdir(path.dirname(generatedTsPath), { recursive: true });
  const tsOutput = `// AUTO-GENERATED BY scripts/sync-certificates.mjs — DO NOT EDIT MANUALLY.
export type CertificationItem = {
  slug: string;
  title: string;
  issuer: string;
  image: string;
  detail: string;
  format: string;
  completedDate?: string;
  credentialId?: string;
  credentialUrl?: string;
};

export const certifications: CertificationItem[] = ${JSON.stringify(cleanRecords, null, 2)};
`;
  await writeFile(generatedTsPath, tsOutput, "utf8");

  // Sync Obsidian certification notes
  await mkdir(vaultCertsDir, { recursive: true });
  const expectedFiles = new Set();
  for (let idx = 0; idx < cleanRecords.length; idx += 1) {
    const cert = cleanRecords[idx];
    const filename = `${cert.slug}.md`;
    expectedFiles.add(filename);
    await writeFile(path.join(vaultCertsDir, filename), renderVaultNote(cert, 71 + idx), "utf8");
  }

  // Prune stale auto_synced notes if a source certificate was removed
  const existingVaultFiles = await readdir(vaultCertsDir);
  for (const name of existingVaultFiles) {
    if (!name.endsWith(".md") || expectedFiles.has(name)) continue;
    const full = path.join(vaultCertsDir, name);
    const content = await readFile(full, "utf8");
    if (/^auto_synced:\s*true\b/m.test(content)) {
      await unlink(full);
    }
  }

  console.log(`Synchronized ${cleanRecords.length} certificates from ${sourceRoot}`);
}

main().catch((error) => {
  console.error("Failed to synchronize certificates:", error);
  process.exit(1);
});
