import { promises as fs } from "fs";
import path from "path";

const galleryDir = path.join(process.cwd(), "public", "Gallery");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov"]);
const fallbackDimensions = { width: 16, height: 9 };

export interface GalleryMediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

export function mediaUrl(fileName: string) {
  return `/Gallery/${fileName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
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

export async function getGalleryMedia(): Promise<GalleryMediaItem[]> {
  const files = await fs.readdir(galleryDir);
  const mediaFiles = files
    .filter((fileName) => {
      const extension = path.extname(fileName).toLowerCase();
      return imageExtensions.has(extension) || videoExtensions.has(extension);
    })
    .sort(sortByGalleryNumber);

  const imageByBaseName = new Map(
    mediaFiles
      .filter((fileName) => imageExtensions.has(path.extname(fileName).toLowerCase()))
      .map((fileName) => [path.basename(fileName, path.extname(fileName)), fileName]),
  );

  return Promise.all(
    mediaFiles.map(async (fileName, index) => {
      const extension = path.extname(fileName).toLowerCase();
      const type = videoExtensions.has(extension) ? "video" : "image";
      const baseName = path.basename(fileName, extension);
      const poster = type === "video" ? imageByBaseName.get(baseName) : undefined;
      const dimensions = await getMediaDimensions(fileName, poster);

      return {
        id: `${baseName}-${type}-${index}`,
        type,
        src: mediaUrl(fileName),
        poster: poster ? mediaUrl(poster) : undefined,
        alt:
          type === "video"
            ? `Hey Charlie Charters video ${index + 1}`
            : `Hey Charlie Charters gallery photo ${index + 1}`,
        title:
          type === "video"
            ? `On-water video ${index + 1}`
            : `Cape charter moment ${index + 1}`,
        width: dimensions.width,
        height: dimensions.height,
      };
    }),
  );
}

export async function getGalleryPreviewImages(limit = 8): Promise<GalleryMediaItem[]> {
  const media = await getGalleryMedia();
  return media.filter((item) => item.type === "image").slice(0, limit);
}
