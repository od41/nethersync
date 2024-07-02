"use client";
import { APILLION_AUTH_SECRET, APILLON_BUCKET_UUID } from "@/client/config";
import { useToast } from "@/components/ui/use-toast";
import { NSFile, NSTransfer } from "@/lib/types";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

type TransfersContextProps = {
  file: NSFile | undefined;
  setFile: (file: NSFile) => void;
  files: NSFile[] | undefined;
  transfer: NSTransfer | undefined;
  setTransfer: (transferData: NSTransfer) => void;
  getTransfer: (slug: string) => Promise<NSTransfer | undefined>;
};

const defaultData: TransfersContextProps = {
  file: undefined,
  setFile: () => {},
  files: undefined,
  transfer: undefined,
  setTransfer: () => {},
  getTransfer: async () => undefined,
};

export const TransferContext = createContext(defaultData);
// TODO: Refactor this to be Transfers provider
export function FilesProvider({ children }: { children: React.ReactNode }) {
  const [file, setFile] = useState<any>(undefined);
  const [files, setFiles] = useState<NSFile[]>();
  const [transfer, setTransfer] = useState<NSTransfer>();
  const [selected, setSelected] = useState<any>(undefined);

  const { toast } = useToast();

  const getTransfer = async (slug: string): Promise<NSTransfer | undefined> => {
    try {
      const transferRecordResponse = await axios.get(
        `/api/transfers/download/${slug}`
      );
      const transferDataResponse: NSTransfer = transferRecordResponse.data;

      const url = `https://api.apillon.io/storage/buckets/${APILLON_BUCKET_UUID}/files?search=${slug}`;
      const headers = {
        Authorization: `${APILLION_AUTH_SECRET}`,
        "Content-Type": "application/json",
      };
      const fileBinaryResponse = await axios.get(url, { headers });

      let filesInNs: NSFile[] | undefined = undefined;

      if (fileBinaryResponse.data.data.total > 0) {
        filesInNs = fileBinaryResponse.data.data.items.map(
          (item: any, index: number) => {
            return {
              id: item.fileUuid,
              path: item.path,
              src: item.link,
              name: item.name,
              format: item.contentType,
              uploadTimestamp: item.createTime,
              size: transferRecordResponse.data.files[index].size,
            };
          }
        );
      }

      const transferData: NSTransfer = {
        id: slug,
        sendersEmail: transferDataResponse.sendersEmail,
        receiversEmail: transferDataResponse.receiversEmail,
        title: transferDataResponse.title,
        message:
          transferDataResponse.message === ""
            ? undefined
            : transferDataResponse.message,
        files: filesInNs,
        size: transferDataResponse.size,
        downloadCount: transferDataResponse.downloadCount,
        sentTimestamp: transferDataResponse.sentTimestamp,
        isPaid: transferDataResponse.isPaid,
        paymentStatus: transferDataResponse.paymentStatus,
        paymentAmount: transferDataResponse.paymentAmount,
        walletAddress: transferDataResponse.walletAddress,
      };

      return transferData;
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

  return (
    <TransferContext.Provider
      value={{
        file,
        setFile,
        files,
        transfer,
        setTransfer,
        getTransfer,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
}
