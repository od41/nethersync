"use client";
import { createContext, useEffect, useState } from "react";

export type NSFile = {
  id: string;
  selected?: NSFile["id"];
  name: string;
  format: string;
  size: string;
  uploadTimestamp: number;
  receiver?: string;
  isPaid?: boolean;
  paymentAmount?: number;
};

export type NSTransfer = {
  id: string;
  selected?: NSTransfer["id"];
  title: string;
  message?: string;
  files: NSFile[] | undefined;
  size: string;
  downloadCount?: number;
  sentTimestamp: number;
  receiver?: string;
  isPaid?: boolean;
  paymentStatus?: boolean;
  paymentAmount?: number;
};

type FilesContextProps = {
  file: NSFile | undefined;
  setFile: (file: NSFile) => void;
  files: NSFile[] | undefined;
  transfer: NSTransfer | undefined;
  setTransfer: (file: NSTransfer) => void;
};

const defaultData: FilesContextProps = {
  file: undefined,
  setFile: () => {},
  files: undefined,
  transfer: undefined,
  setTransfer: () => {},
};

export const FilesContext = createContext(defaultData);

export function FilesProvider({ children }: { children: React.ReactNode }) {
  const [file, setFile] = useState<any>(undefined);
  const [transfer, setTransfer] = useState<NSTransfer>();
  const [selected, setSelected] = useState<any>(undefined);

  const files: NSFile[] = [
    {
      id: "djsjd324",
      name: "google-deepmind-UHiedDRzjgM-unsplash",
      format: "jpg",
      size: "3mb",
      receiver: "files@nethersync.xyz",
      isPaid: true,
      paymentAmount: 320,
      uploadTimestamp: 1717629066,
    },
    {
      id: "fgg4422",
      name: "google-deepmind-NJzatVoy-U8-unsplash",
      format: "jpg",
      size: "4mb",
      receiver: "files@nethersync.xyz",
      isPaid: true,
      paymentAmount: 320,
      uploadTimestamp: 1717629066,
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
        transfer,
        setTransfer,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}
