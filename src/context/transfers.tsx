"use client";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
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

type TransfersContextProps = {
  file: NSFile | undefined;
  setFile: (file: NSFile) => void;
  files: NSFile[] | undefined;
  transfer: NSTransfer | undefined;
  getTransfer: (slug: string) => void;
};

const defaultData: TransfersContextProps = {
  file: undefined,
  setFile: () => {},
  files: undefined,
  transfer: undefined,
  getTransfer: () => {},
};

export const TransferContext = createContext(defaultData);
// TODO: Refactor this to be Transfers provider
export function FilesProvider({ children }: { children: React.ReactNode }) {
  const [file, setFile] = useState<any>(undefined);
  const [transfer, setTransfer] = useState<NSTransfer>();
  const [selected, setSelected] = useState<any>(undefined);

  const { toast } = useToast();

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

  const getTransfer = async (slug: string) => {
    try {
      const response = await axios.get(`/api/transfers/download/${slug}`);
      console.log(response.data);
      setTransfer(response.data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message
          ? error.message
          : "Please wait a moment and try again.",
      });
    }
  };

  useEffect(() => {
    setFile(files[0]);
    setSelected(files[0].id);
  }, []);

  return (
    <TransferContext.Provider
      value={{
        file,
        setFile,
        files,
        transfer,
        getTransfer,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
}
