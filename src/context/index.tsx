"use client";
import React from "react";
import { FilesProvider } from "./transfers";
import { ContractsProvider } from "./contracts";
import AuthProvider from "./auth";
import { Providers as Web3Provider } from "./providers";

export const ApplicationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <Web3Provider>
        <ContractsProvider>
          <FilesProvider>{children}</FilesProvider>
        </ContractsProvider>
      </Web3Provider>
    </AuthProvider>
  );
};
