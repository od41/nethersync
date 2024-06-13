"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilesProvider } from "./files";
import { ContractsProvider } from "./contracts";

const queryClient = new QueryClient();

export const ApplicationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContractsProvider>
        <FilesProvider>{children}</FilesProvider>
      </ContractsProvider>
    </QueryClientProvider>
  );
};
