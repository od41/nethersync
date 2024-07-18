import React from "react";
import Image from "next/image";
import { FileIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react";
import { FileWithPreview } from "@/app/transfers/send/_components/send-card";

interface FilePreviewProps {
  file: FileWithPreview;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileType, setFileType] = React.useState<string>("other");

  React.useEffect(() => {
    if (!file) return;

    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setPreview(reader.result as string);
    // };

    console.log("ft", file);

    if (file.type.startsWith("image/")) {
      //   reader.readAsDataURL(file);
      setPreview(file.preview);
      setFileType("image");
    } else {
      setFileType(getFileType(file.type));
    }
  }, [file]);

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("wordprocessingml") || mimeType.includes("msword"))
      return "doc";
    if (mimeType.includes("spreadsheetml") || mimeType.includes("ms-excel"))
      return "xls";
    return "other";
  };

  const renderIcon = () => {
    switch (fileType) {
      case "pdf":
        return <FileTextIcon size={20} />;
      case "doc":
        return <FileTextIcon size={20} />;
      case "xls":
        return <FileSpreadsheetIcon size={20} />;
      default:
        return <FileIcon size={20} />;
    }
  };

  if (!file) return null;

  return (
    <div className="relative aspect-square w-full max-w-[100px]">
      {fileType === "image" && preview ? (
        <Image
          src={preview}
          alt={`preview of ${file.name}`}
          className="aspect-square w-full border border-muted rounded-md hover:border-primary object-cover"
          height="40"
          width="40"
          layout="responsive"
        />
      ) : (
        <div className="aspect-square w-full border border-muted rounded-md hover:border-primary flex items-center justify-center">
          {renderIcon()}
        </div>
      )}
    </div>
  );
};
