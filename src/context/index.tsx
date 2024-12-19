"use client";
import React from "react";
import { TransfersProvider } from "./transfers";
import { ContractsProvider } from "./contracts";
import AuthProvider from "./auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ParticleConnectkit } from "./wallet";

const queryClient = new QueryClient();

export const ApplicationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ParticleConnectkit>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ContractsProvider>
            <TransfersProvider>{children}</TransfersProvider>
          </ContractsProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ParticleConnectkit>
  );
};
