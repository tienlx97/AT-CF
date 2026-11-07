#!/usr/bin/env node
// `pnpm media` — compress the owner's photos and videos in media-src/ into
// public/media/ and write src/data/media.json (ANH-TU-PROMP.md section 6).
//
// Re-runnable: a content-hash cache (media-src/.cache.json) skips files that
// did not change. Owner edits to alt/caption/featured/group in media.json are
// kept. Images need sharp; videos need ffmpeg/ffprobe on PATH (if missing,
// images are still processed and the report says how to install it).
//
//   pnpm media            process new/changed files
//   pnpm media --force    reprocess everything
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import sharp from 'sharp';

import {
  classify,
  formatBytes,
  mergeManifest,
  orientationOf,
  plannedWidths,
  suggestAlt,
} from '../src/shared/api/media-core.js';
import {
  BUDGETS,
  IMAGE_WIDTHS,
  VIDEO_HEIGHTS,
} from '../src/shared/config/media-groups.js';

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.MEDIA_SRC ?? join(ROOT, 'media-src');
const OUT = process.env.MEDIA_OUT ?? join(ROOT, 'public', 'media');
const MANIFEST =
  process.env.MEDIA_MANIFEST ?? join(ROOT, 'src', 'data', 'media.json');
const CACHE = join(SRC, '.cache.json');
const FORCE = process.argv.includes('--force');
const PIPELINE_VERSION = 1;

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

/** @param {string} file */
function hashFile(file) {
  return createHash('sha1')
    .update(readFileSync(file))
    .update(String(PIPELINE_VERSION))
    .digest('hex')
    .slice(0, 16);
}

/** @param {string} file */
const bytesOf = (file) => (existsSync(file) ? statSync(file).size : 0);
const urlOf = (/** @type {string} */ file) =>
  `/${relative(join(ROOT, 'public'), file).split(sep).join('/')}`;

async function hasFfmpeg() {
  try {
    await run('ffmpeg', ['-version']);
    await run('ffprobe', ['-version']);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} input
 * @param {ReturnType<typeof classify> & {}} info
 */
async function processImage(input, info) {
  const dir = join(OUT, dirname(info.id));
  mkdirSync(dir, { recursive: true });
  // rotate() applies the EXIF orientation; sharp drops EXIF/GPS on output by default.
  const meta = await sharp(input, { failOn: 'none' })
    .rotate()
    .toBuffer({ resolveWithObject: true });
  const width = meta.info.width;
  const height = meta.info.height;
  const widths = plannedWidths(width, IMAGE_WIDTHS);
  const outputs = [];
  for (const w of widths) {
    const resized = sharp(meta.data).resize({
      width: w,
      withoutEnlargement: true,
    });
    const avif = join(dir, `${info.slug}-${w}.avif`);
    const webp = join(dir, `${info.slug}-${w}.webp`);
    await resized.clone().avif({ quality: 50, effort: 4 }).toFile(avif);
    await resized.clone().webp({ quality: 72 }).toFile(webp);
    outputs.push(avif, webp);
  }
  const blurBuffer = await sharp(meta.data)
    .resize({ width: 16 })
    .webp({ quality: 40 })
    .toBuffer();
  return {
    item: {
      src: urlOf(join(dir, info.slug)),
      widths,
      formats: ['avif', 'webp'],
      width,
      height,
      orientation: orientationOf(width, height),
      blur: `data:image/webp;base64,${blurBuffer.toString('base64')}`,
    },
    outputs,
  };
}

/** @param {string} input */
async function probeVideo(input) {
  const { stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height:stream_side_data=rotation:stream_tags=rotate:format=duration',
    '-of',
    'json',
    input,
  ]);
  const data = JSON.parse(stdout);
  const stream = data.streams?.[0] ?? {};
  const rotation = Math.abs(
    Number(
      stream.side_data_list?.find((d) => 'rotation' in d)?.rotation ??
        stream.tags?.rotate ??
        0,
    ),
  );
  const swap = rotation === 90 || rotation === 270;
  return {
    width: swap ? stream.height : stream.width,
    height: swap ? stream.width : stream.height,
    duration: Number(data.format?.duration ?? 0),
  };
}

/**
 * @param {string} input
 * @param {ReturnType<typeof classify> & {}} info
 */
async function processVideo(input, info) {
  const dir = join(OUT, dirname(info.id));
  mkdirSync(dir, { recursive: true });
  const probe = await probeVideo(input);
  const hero = info.role === 'hero';
  const limit = hero ? 20 : BUDGETS.maxClipSeconds;
  const portrait = probe.height > probe.width;
  const shortSide = Math.min(probe.width, probe.height);
  const outputs = [];
  const videos = [];
  for (const target of VIDEO_HEIGHTS) {
    // "720p" means the short side, so a portrait clip becomes 720x1280.
    const side = Math.min(target, shortSide);
    if (videos.some((v) => v.height === side)) continue;
    const scale = portrait ? `scale=${side}:-2` : `scale=-2:${side}`;
    const file = join(dir, `${info.slug}-${target}.mp4`);
    const budget = hero
      ? target <= 720
        ? BUDGETS.heroMobile
        : BUDGETS.heroDesktop
      : 0;
    const encode = async (/** @type {number} */ crf) => {
      await run(
        'ffmpeg',
        [
          '-y',
          '-v',
          'error',
          '-i',
          input,
          '-t',
          String(limit),
          '-vf',
          `${scale},fps=30`,
          '-c:v',
          'libx264',
          '-preset',
          'slow',
          '-crf',
          String(crf),
          '-profile:v',
          'high',
          '-pix_fmt',
          'yuv420p',
          '-movflags',
          '+faststart',
          ...(hero ? ['-an'] : ['-c:a', 'aac', '-b:a', '96k', '-ac', '2']),
          file,
        ],
        { maxBuffer: 1 << 26 },
      );
    };
    let crf = hero ? 28 : 26;
    await encode(crf);
    // Hero budget: raise CRF until the file fits (ANH-TU-PROMP.md 6.2).
    while (budget && bytesOf(file) > budget && crf < 38) {
      crf += 2;
      await encode(crf);
    }
    outputs.push(file);
    videos.push({ src: urlOf(file), height: side, bytes: bytesOf(file) });
  }
  const posterFile = join(dir, `${info.slug}-poster.webp`);
  const frame = join(dir, `${info.slug}-poster.png`);
  await run('ffmpeg', [
    '-y',
    '-v',
    'error',
    '-ss',
    probe.duration > 1.2 ? '1' : '0',
    '-i',
    input,
    '-frames:v',
    '1',
    frame,
  ]);
  const posterWidth = Math.min(portrait ? 720 : 1600, probe.width);
  await sharp(frame)
    .resize({ width: posterWidth, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(posterFile);
  const blurBuffer = await sharp(frame)
    .resize({ width: 16 })
    .webp({ quality: 40 })
    .toBuffer();
  rmSync(frame);
  outputs.push(posterFile);
  return {
    item: {
      src: videos[0]?.src ?? '',
      widths: [],
      formats: ['mp4'],
      width: probe.width,
      height: probe.height,
      orientation: orientationOf(probe.width, probe.height),
      blur: `data:image/webp;base64,${blurBuffer.toString('base64')}`,
      poster: urlOf(posterFile),
      videos,
      duration: Math.round(Math.min(probe.duration, limit) * 10) / 10,
    },
    outputs,
  };
}

async function main() {
  const started = Date.now();
  if (!existsSync(SRC)) {
    console.log(
      `Chưa có thư mục ${relative(ROOT, SRC)}/ — xem media-src/README.md.`,
    );
  }
  const ffmpeg = await hasFfmpeg();
  const cache =
    existsSync(CACHE) && !FORCE ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
  const previous = existsSync(MANIFEST)
    ? (JSON.parse(readFileSync(MANIFEST, 'utf8')).items ?? [])
    : [];
  const previousById = new Map(
    previous.map((/** @type {any} */ item) => [item.id, item]),
  );
  const files = walk(SRC).filter(
    (file) => !file.endsWith('.cache.json') && !file.endsWith('README.md'),
  );
  const fresh = [];
  const report = {
    processed: 0,
    skipped: 0,
    ignored: [],
    failed: [],
    videoSkipped: 0,
    before: 0,
    after: 0,
  };
  const seenIds = new Set();
  const newCache = {};

  for (const file of files) {
    const rel = relative(SRC, file).split(sep).join('/');
    const info = classify(rel);
    if (!info) {
      report.ignored.push(rel);
      continue;
    }
    if (seenIds.has(info.id)) {
      report.failed.push(
        `${rel}: trùng tên với file khác sau khi chuẩn hoá (${info.id})`,
      );
      continue;
    }
    seenIds.add(info.id);
    const hash = hashFile(file);
    const cached = cache[rel];
    const before = previousById.get(info.id);
    if (
      cached?.hash === hash &&
      before &&
      cached.outputs.every((/** @type {string} */ o) =>
        existsSync(join(ROOT, o)),
      )
    ) {
      fresh.push(before);
      newCache[rel] = cached;
      report.skipped += 1;
      continue;
    }
    if (info.type === 'video' && !ffmpeg) {
      report.videoSkipped += 1;
      if (before) fresh.push(before);
      continue;
    }
    try {
      const { item, outputs } =
        info.type === 'image'
          ? await processImage(file, info)
          : await processVideo(file, info);
      fresh.push({
        id: info.id,
        type: info.type,
        role: info.role,
        group: info.group,
        source: rel,
        hash,
        ...item,
        alt: suggestAlt(rel),
        caption: '',
        featured: false,
      });
      const sizeOut = outputs.reduce((sum, o) => sum + bytesOf(o), 0);
      report.before += bytesOf(file);
      report.after += sizeOut;
      report.processed += 1;
      newCache[rel] = {
        hash,
        outputs: outputs.map((o) => relative(ROOT, o).split(sep).join('/')),
      };
      console.log(
        `  ✔ ${rel} → ${formatBytes(bytesOf(file))} → ${formatBytes(sizeOut)}`,
      );
    } catch (error) {
      report.failed.push(
        `${rel}: ${/** @type {Error} */ (error).message.split('\n')[0]}`,
      );
    }
  }

  // Remove outputs of sources that disappeared.
  for (const [rel, entry] of Object.entries(cache)) {
    if (!newCache[rel])
      for (const output of entry.outputs)
        rmSync(join(ROOT, output), { force: true });
  }

  const items = mergeManifest(previous, fresh);
  mkdirSync(dirname(MANIFEST), { recursive: true });
  writeFileSync(
    MANIFEST,
    `${JSON.stringify({ version: 1, updatedAt: new Date().toISOString().slice(0, 10), items }, null, 2)}\n`,
  );
  if (existsSync(SRC)) writeFileSync(CACHE, JSON.stringify(newCache, null, 2));

  console.log('\nBáo cáo pnpm media');
  console.log(
    `  Đã xử lý: ${report.processed} · Giữ nguyên: ${report.skipped} · Tổng trong media.json: ${items.length}`,
  );
  if (report.processed)
    console.log(
      `  Dung lượng: ${formatBytes(report.before)} → ${formatBytes(report.after)}`,
    );
  for (const hero of items.filter(
    (/** @type {any} */ i) => i.role === 'hero',
  )) {
    for (const v of hero.videos ?? []) {
      const budget = v.height <= 720 ? BUDGETS.heroMobile : BUDGETS.heroDesktop;
      console.log(
        `  Hero ${v.src}: ${formatBytes(v.bytes)} ${v.bytes <= budget ? '✔' : `✘ vượt ${formatBytes(budget)}`}`,
      );
    }
  }
  if (report.ignored.length)
    console.log(
      `  Bỏ qua (sai thư mục/định dạng): ${report.ignored.join(', ')}`,
    );
  if (report.videoSkipped)
    console.log(
      `  ✘ ${report.videoSkipped} video chưa xử lý: chưa có ffmpeg. Cài: winget install ffmpeg`,
    );
  if (report.failed.length) {
    console.log(`  ✘ Lỗi ${report.failed.length} file:`);
    for (const line of report.failed) console.log(`    - ${line}`);
  }
  console.log(`  Thời gian: ${((Date.now() - started) / 1000).toFixed(1)} s`);
  if (report.failed.length) process.exitCode = 1;
}

await main();
