"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilesProvider } from "./transfers";
import { ContractsProvider } from "./contracts";
import AuthProvider from "./auth";

const queryClient = new QueryClient();

export const ApplicationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ContractsProvider>
          <FilesProvider>{children}</FilesProvider>
        </ContractsProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};
