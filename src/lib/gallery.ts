import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const galleryDir = path.join(process.cwd(), "public", "Gallery");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov"]);
const fallbackDimensions = { width: 16, height: 9 };

const monthNames = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export interface GalleryMediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  /** Month folder the file lives in, e.g. "JUNE 26"; null for files in the Gallery root. */
  month: string | null;
}

export function mediaUrl(fileName: string) {
  return `/Gallery/${fileName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

/** Folder names like "JUNE 26" or "MAY 2026" become a sortable month index; anything else is ignored. */
function monthFolderSortKey(folderName: string): number | null {
  const match = folderName.trim().toUpperCase().match(/^([A-Z]+)\s+'?(\d{2}|\d{4})$/);

  if (!match) {
    return null;
  }

  const monthIndex = monthNames.indexOf(match[1]);

  if (monthIndex === -1) {
    return null;
  }

  const year = match[2].length === 2 ? 2000 + Number(match[2]) : Number(match[2]);
  return year * 12 + monthIndex;
}

function isMediaFile(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  return imageExtensions.has(extension) || videoExtensions.has(extension);
}

function sortByGalleryNumber(a: string, b: string) {
  const aNumber = Number(a.match(/\((\d+)\)/)?.[1] ?? Number.MAX_SAFE_INTEGER);
  const bNumber = Number(b.match(/\((\d+)\)/)?.[1] ?? Number.MAX_SAFE_INTEGER);

  if (aNumber !== bNumber) {
    return aNumber - bNumber;
  }

  return a.localeCompare(b);
}

async function getJpegDimensions(filePath: string) {
  const buffer = await fs.readFile(filePath);
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const markerLength = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + markerLength;
  }

  return fallbackDimensions;
}

async function getMediaDimensions(fileName: string, posterFileName?: string) {
  const fileToInspect = posterFileName ?? fileName;
  const extension = path.extname(fileToInspect).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") {
    return getJpegDimensions(path.join(galleryDir, fileToInspect));
  }

  return fallbackDimensions;
}

/** File size plus a hash of the first 64KB — enough to identify re-uploaded copies of the same file. */
async function contentSignature(fileName: string): Promise<string> {
  const filePath = path.join(galleryDir, fileName);
  const { size } = await fs.stat(filePath);
  const handle = await fs.open(filePath, "r");

  try {
    const length = Math.min(size, 64 * 1024);
    const buffer = Buffer.alloc(length);
    await handle.read(buffer, 0, length, 0);
    return `${size}:${createHash("md5").update(buffer).digest("hex")}`;
  } finally {
    await handle.close();
  }
}

async function dedupeFiles(files: string[], seenSignatures: Set<string>): Promise<string[]> {
  const signatures = await Promise.all(files.map(contentSignature));

  return files.filter((_, index) => {
    if (seenSignatures.has(signatures[index])) {
      return false;
    }

    seenSignatures.add(signatures[index]);
    return true;
  });
}

interface MediaGroup {
  month: string | null;
  files: string[];
}

/** Month folders newest-first, then any loose files left in the Gallery root. */
async function listMediaGroups(): Promise<MediaGroup[]> {
  const entries = await fs.readdir(galleryDir, { withFileTypes: true });

  const monthFolders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ name: entry.name, sortKey: monthFolderSortKey(entry.name) }))
    .filter((folder): folder is { name: string; sortKey: number } => folder.sortKey !== null)
    .sort((a, b) => b.sortKey - a.sortKey);

  const groups: MediaGroup[] = [];

  for (const folder of monthFolders) {
    const files = (await fs.readdir(path.join(galleryDir, folder.name)))
      .filter(isMediaFile)
      .sort(sortByGalleryNumber)
      .map((fileName) => `${folder.name}/${fileName}`);

    if (files.length > 0) {
      groups.push({ month: folder.name, files });
    }
  }

  const rootFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isMediaFile)
    .sort(sortByGalleryNumber);

  if (rootFiles.length > 0) {
    groups.push({ month: null, files: rootFiles });
  }

  return groups;
}

export async function getGalleryMedia(): Promise<GalleryMediaItem[]> {
  const groups = await listMediaGroups();
  const seenSignatures = new Set<string>();
  const items: Array<Promise<GalleryMediaItem>> = [];
  let index = 0;

  for (const group of groups) {
    const files = await dedupeFiles(group.files, seenSignatures);

    const imageByBaseName = new Map(
      files
        .filter((fileName) => imageExtensions.has(path.extname(fileName).toLowerCase()))
        .map((fileName) => [path.basename(fileName, path.extname(fileName)), fileName]),
    );

    // Live-photo stills double as their video's poster; skip them as standalone items.
    const posterFiles = new Set(
      files
        .filter((fileName) => videoExtensions.has(path.extname(fileName).toLowerCase()))
        .map((fileName) => imageByBaseName.get(path.basename(fileName, path.extname(fileName))))
        .filter((fileName): fileName is string => Boolean(fileName)),
    );

    for (const fileName of files) {
      const extension = path.extname(fileName).toLowerCase();
      const type = videoExtensions.has(extension) ? "video" : "image";

      if (type === "image" && posterFiles.has(fileName)) {
        continue;
      }

      const itemIndex = index;
      index += 1;

      const baseName = path.basename(fileName, extension);
      const poster = type === "video" ? imageByBaseName.get(baseName) : undefined;

      items.push(
        getMediaDimensions(fileName, poster).then((dimensions) => ({
          id: `${baseName}-${type}-${itemIndex}`,
          type,
          src: mediaUrl(fileName),
          poster: poster ? mediaUrl(poster) : undefined,
          alt:
            type === "video"
              ? `Hey Charlie Charters video ${itemIndex + 1}`
              : `Hey Charlie Charters gallery photo ${itemIndex + 1}`,
          title:
            type === "video"
              ? `On-water video ${itemIndex + 1}`
              : `Cape charter moment ${itemIndex + 1}`,
          width: dimensions.width,
          height: dimensions.height,
          month: group.month,
        })),
      );
    }
  }

  return Promise.all(items);
}

/** Sample images evenly across the collection so the preview shows varied moments, not one burst of shots. */
export async function getGalleryPreviewImages(limit = 8): Promise<GalleryMediaItem[]> {
  const media = await getGalleryMedia();
  const images = media.filter((item) => item.type === "image");

  if (images.length <= limit) {
    return images;
  }

  const step = images.length / limit;
  return Array.from({ length: limit }, (_, index) => images[Math.floor(index * step)]);
}
