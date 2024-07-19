import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NSFile, NSTransfer } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleCopy(textToCopy: string) {
  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (err) {
    console.error("Error copying to clipboard:", err);
  }
}

type BinaryItem = {
  fileUuid: string;
  path: string;
  link: string;
  name: string;
  contentType: string;
  createTime: string;
  dataToEncryptHash?: string;
  CID?: string;
};

export async function mergeFileData(
  metadataFiles: NSFile[],
  binaryFiles: BinaryItem[]
): Promise<NSFile[]> {
  const mergedFiles: NSFile[] = [];

  for (const metadataItem of metadataFiles) {
    const matchingBinaryItem = binaryFiles.find(
      (binaryItem) => binaryItem.fileUuid === metadataItem.id
    );

    if (matchingBinaryItem) {
      try {
        mergedFiles.push({
          id: metadataItem.id,
          // dataToEncryptHash: matchingBinaryItem.dataToEncryptHash,
          path: matchingBinaryItem.path,
          src: matchingBinaryItem.link,
          name: matchingBinaryItem.name,
          format: metadataItem.format,
          cid: matchingBinaryItem.CID,
          // @ts-ignore
          uploadTimestamp: matchingBinaryItem.createTime,
          size: String(metadataItem.size),
          // blobData: blobData,
        });
      } catch (error) {
        console.error(
          `Error fetching blob data for file ${metadataItem.id}:`,
          error
        );
      }
    }
  }

  return mergedFiles;
}
