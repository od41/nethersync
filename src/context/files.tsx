"use client";
import { createContext, useEffect, useState } from "react";

export type NSFile = {
  id: string;
  selected?: NSFile["id"];
  name: string;
  format: string;
  size: string;
  uploadTimestamp: number;
};

type FilesContextProps = {
  file: NSFile | undefined;
  setFile: (file: NSFile) => void;
  files: NSFile[] | undefined;
};

const defaultData: FilesContextProps = {
  file: undefined,
  setFile: () => {},
  files: undefined,
};

export const FilesContext = createContext(defaultData);

export function FilesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [file, setFile] = useState<any>(undefined);
  const [selected, setSelected] = useState<any>(undefined);

  const files: NSFile[] = [
    {
      id: "djsjd324",
      name: "my photo",
      format: "jpeg",
      size: "42mb",
      uploadTimestamp: 1709818460,
    },
    {
      id: "fgg4422",
      name: "my photo",
      format: "jpeg",
      size: "42mb",
      uploadTimestamp: 1717720460,
    },
    {
      id: "dg4556",
      name: "my photo",
      format: "jpeg",
      size: "42mb",
      uploadTimestamp: 1709818460,
    },
    {
      id: "g788654",
      name: "my photo",
      format: "jpeg",
      size: "42mb",
      uploadTimestamp: 1709818460,
    },
    {
      id: "ghg2535",
      name: "my photo",
      format: "jpeg",
      size: "42mb",
      uploadTimestamp: 1709818460,
    },
  ];

  useEffect(() => {
    setFile(files[0]);
    setSelected(files[0].id);
  }, []);

  return (
    <FilesContext.Provider
      value={{
        file,
        setFile,
        files,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}
