// Resize & convert photos dropped into raw-images/ to web-ready WebP files.
//
// Usage:
//   node scripts/optimize-images.mjs                  -> raw-images/ -> public/images/, max width 2400px
//   node scripts/optimize-images.mjs --width=1600     -> custom max width
//   node scripts/optimize-images.mjs in out --width=2000 --quality=85

import sharp from "sharp";
import { readdir, mkdir, stat } from "fs/promises";
import path from "path";

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flags = Object.fromEntries(
  args
    .filter((a) => a.startsWith("--"))
    .map((a) => a.slice(2).split("="))
    .map(([k, v]) => [k, v ?? true])
);

const inputDir = positional[0] ?? "raw-images";
const outputDir = positional[1] ?? "public/images";
const maxWidth = Number(flags.width ?? 2400);
const quality = Number(flags.quality ?? 82);

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"]);

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const entries = await readdir(inputDir, { withFileTypes: true });
  const files = entries.filter(
    (e) => e.isFile() && VALID_EXT.has(path.extname(e.name).toLowerCase())
  );

  if (files.length === 0) {
    console.log(`Brak zdjęć do przetworzenia w "${inputDir}".`);
    return;
  }

  console.log(`Przetwarzam ${files.length} plik(ów) -> max ${maxWidth}px, jakość ${quality}\n`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file.name);
    const baseName = slugify(path.parse(file.name).name);
    const outputPath = path.join(outputDir, `${baseName}.webp`);

    const before = (await stat(inputPath)).size;

    const image = sharp(inputPath).rotate(); // auto-orient based on EXIF
    const metadata = await image.metadata();

    const pipeline =
      metadata.width && metadata.width > maxWidth
        ? image.resize({ width: maxWidth, withoutEnlargement: true })
        : image;

    await pipeline.webp({ quality }).toFile(outputPath);

    const after = (await stat(outputPath)).size;
    const savedPct = (((before - after) / before) * 100).toFixed(0);

    console.log(
      `${file.name} -> ${path.basename(outputPath)} ` +
        `(${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB, -${savedPct}%)`
    );
  }

  console.log(`\nGotowe. Pliki zapisane w "${outputDir}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
