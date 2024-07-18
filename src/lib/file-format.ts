type FileType = "image" | "pdf" | "doc" | "xls" | "other";

export function getFilePreview(file: File): string {
  const imageFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const fileType: FileType = getFileType(file.type);

  switch (fileType) {
    case "image":
      return URL.createObjectURL(file);
    case "pdf":
      return "/icons/pdf-icon.svg";
    case "doc":
      return "/icons/doc-icon.svg";
    case "xls":
      return "/icons/xls-icon.svg";
    default:
      return "/icons/raw-icon.svg";
  }
}

function getFileType(mimeType: string): FileType {
  const imageFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const docFormats = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const xlsFormats = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (imageFormats.includes(mimeType)) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (docFormats.includes(mimeType)) return "doc";
  if (xlsFormats.includes(mimeType)) return "xls";
  return "other";
}
