"use client";
import { createContext, useEffect, useState } from "react";

export type KeeperSlip = {
  id: string;
};

type ApplicationContextProps = {
  totalLiquidity: number;
  totalDebt: number;
  totalKeeperAgents: number;
  collaterizationRatio: number;
  userLiquidityBalance: number;
  userWithdrawalBalance: number;
  userEarningsBalance: number;
  userDebtBalance: number;
  userKUSDBalance: number;
  userKeeperSlips: KeeperSlip[] | undefined;
  userPoolsHistory: any[] | undefined;
};

const defaultData: ApplicationContextProps = {
  totalLiquidity: 0,
  totalDebt: 0,
  totalKeeperAgents: 0,
  collaterizationRatio: 0,
  userLiquidityBalance: 0,
  userWithdrawalBalance: 0,
  userEarningsBalance: 0,
  userDebtBalance: 0,
  userKUSDBalance: 0,
  userKeeperSlips: undefined,
  userPoolsHistory: undefined,
};

export const ApplicationContext = createContext(defaultData);

export function ApplicationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [totalKeeperAgents, setTotalKeeperAgents] = useState(0);
  const [collaterizationRatio, setCollaterizationRatio] = useState(0);
  const [userLiquidityBalance, setUserLiquidityBalance] = useState(0);
  const [userWithdrawalBalance, setUserWithdrawalBalance] = useState(0);
  const [userEarningsBalance, setUserEarningsBalance] = useState(0);
  const [userDebtBalance, setUserDebtBalance] = useState(0);
  const [userKUSDBalance, setUserKUSDBalance] = useState(0);
  const [userKeeperSlips, setUserKeeperSlips] = useState(undefined);
  const [userPoolsHistory, setUserPoolsHistory] = useState(undefined);

  return (
    <ApplicationContext.Provider
      value={{
        totalLiquidity,
        totalDebt,
        totalKeeperAgents,
        collaterizationRatio,
        userLiquidityBalance,
        userWithdrawalBalance,
        userEarningsBalance,
        userDebtBalance,
        userKUSDBalance,
        userKeeperSlips,
        userPoolsHistory,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
