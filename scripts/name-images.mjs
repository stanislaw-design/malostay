// Rename photos in public/images based on what's actually in them, using
// OpenAI vision (e.g. IMG_1234.webp -> domek-front-dzien.webp).
//
// Usage:
//   node scripts/name-images.mjs                 -> renames files in public/images
//   node scripts/name-images.mjs public/images   -> custom directory
//   node scripts/name-images.mjs --all           -> also rename files that already look descriptive
//   node scripts/name-images.mjs --dry-run       -> preview new names without renaming

import OpenAI from "openai";
import sharp from "sharp";
import { readdir, rename, copyFile, unlink, readFile } from "fs/promises";
import path from "path";

// --- load OPENAI_API_KEY from .env.local without adding a dotenv dependency ---
async function loadEnvLocal() {
  try {
    const content = await readFile(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // brak .env.local - nic nie szkodzi, klucz może być ustawiony w środowisku
  }
}

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flags = new Set(args.filter((a) => a.startsWith("--")));

const targetDir = positional[0] ?? "public/images";
const renameAll = flags.has("--all");
const dryRun = flags.has("--dry-run");

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"]);

// pliki o "surowych" nazwach z aparatu / telefonu - te nazywamy domyślnie
const RAW_NAME_PATTERN = /^(img|dsc|photo|image|pxl|screenshot)[-_]?\d|^\d+$/i;

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const PROMPT = `Patrzysz na zdjęcie z oferty wynajmu domków letniskowych "Domek nad Doliną".
Opisz krótko i zwięźle, co przedstawia zdjęcie, jako nazwę pliku w formacie kebab-case po polsku
(małe litery, bez polskich znaków, słowa oddzielone myślnikami, max 4 słowa).

Uwzględnij to, co najważniejsze: pomieszczenie lub miejsce (np. domek, sypialnia, kuchnia, lazienka,
salon, taras, ogrod, widok-gory, basen) oraz ewentualnie porę dnia (dzien/wieczor/noc) lub charakterystyczny
element, jeśli jest istotny.

Przykłady dobrych odpowiedzi: "domek-front-dzien", "sypialnia-lozko-podwojne", "kuchnia-aneks",
"taras-widok-gory-zachod", "lazienka-prysznic", "ogrod-altana-wieczor".

Odpowiedz WYŁĄCZNIE samą nazwą w kebab-case, bez żadnego dodatkowego tekstu, kropek ani rozszerzenia.`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Na Windows `rename` czasem rzuca EBUSY, gdy plik jest chwilowo zablokowany
// (np. przez dev server / antywirusa). Próbujemy kilka razy, a na końcu
// kopiujemy plik i usuwamy oryginał.
async function renameWithRetry(from, to, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      await rename(from, to);
      return;
    } catch (err) {
      if (err.code !== "EBUSY" || i === attempts - 1) {
        if (err.code === "EBUSY") {
          await copyFile(from, to);
          await unlink(from);
          return;
        }
        throw err;
      }
      await sleep(200 * (i + 1));
    }
  }
}

async function describeImage(client, filePath) {
  // mniejsza wersja zdjęcia do analizy - oszczędza tokeny, jakość oryginału bez zmian
  const thumbnail = await sharp(filePath)
    .rotate()
    .resize({ width: 768, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: PROMPT },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${thumbnail.toString("base64")}`,
            },
          },
        ],
      },
    ],
  });

  return slugify(response.choices[0]?.message?.content ?? "");
}

async function main() {
  await loadEnvLocal();

  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "Brak OPENAI_API_KEY. Dodaj go do .env.local, np.:\nOPENAI_API_KEY=sk-..."
    );
    process.exit(1);
  }

  const client = new OpenAI();

  const entries = await readdir(targetDir, { withFileTypes: true });
  const files = entries.filter(
    (e) => e.isFile() && VALID_EXT.has(path.extname(e.name).toLowerCase())
  );

  const candidates = renameAll
    ? files
    : files.filter((f) => RAW_NAME_PATTERN.test(path.parse(f.name).name));

  if (candidates.length === 0) {
    console.log(
      `Brak plików do nazwania w "${targetDir}". ` +
        `Użyj --all, jeśli chcesz nazwać wszystkie zdjęcia w folderze.`
    );
    return;
  }

  console.log(`Analizuję ${candidates.length} plik(ów) w "${targetDir}"...\n`);

  const usedNames = new Set(files.map((f) => f.name.toLowerCase()));

  for (const file of candidates) {
    const ext = path.extname(file.name);
    const filePath = path.join(targetDir, file.name);

    let slug;
    try {
      slug = await describeImage(client, filePath);
    } catch (err) {
      console.error(`${file.name} -> błąd analizy: ${err.message}`);
      continue;
    }

    if (!slug) {
      console.warn(`${file.name} -> nie udało się ustalić nazwy, pomijam`);
      continue;
    }

    let newName = `${slug}${ext}`;
    let suffix = 2;
    while (
      usedNames.has(newName.toLowerCase()) &&
      newName.toLowerCase() !== file.name.toLowerCase()
    ) {
      newName = `${slug}-${suffix}${ext}`;
      suffix += 1;
    }

    usedNames.delete(file.name.toLowerCase());
    usedNames.add(newName.toLowerCase());

    if (newName === file.name) {
      console.log(`${file.name} -> bez zmian`);
      continue;
    }

    console.log(`${file.name} -> ${newName}`);

    if (!dryRun) {
      await renameWithRetry(filePath, path.join(targetDir, newName));
    }
  }

  console.log(dryRun ? "\n(podgląd - nic nie zostało zmienione, --dry-run)" : "\nGotowe.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
