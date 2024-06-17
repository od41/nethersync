"use client";
import { createContext, useEffect, useState } from "react";

export enum Checkpoints {
  Start = "0",
  Quarter = "25",
  Halfway = "50",
  ThreeQuarters = "75",
  End = "100",
}

export type NSMilestone = {
  id: string;
  description: string;
  milestoneCount?: Checkpoints;
  dueDate: Date;
  approvalStatus?: boolean;
  completionStatus?: boolean;
  payoutAmount?: number;
  includesPayout?: boolean;
};

export type NSContract = {
  id: string;
  title: string;
  description?: string;
  milestones: NSMilestone[] | undefined;
  clientEmail: string;
  dateCreated: Date;
  activeStatus?: boolean;
  approvalStatus?: boolean;
  completionStatus?: boolean;
  paymentAmount: number;
};

type ContractsContextProps = {
  selectedMilestone: NSMilestone | undefined;
  setSelectedMilestone: (milestone: NSMilestone) => void;
  contracts: NSContract[] | undefined;
  selectedContract: NSContract | undefined;
  setSelectedContract: (contract: NSContract) => void;
};

const defaultData: ContractsContextProps = {
  selectedMilestone: undefined,
  setSelectedMilestone: () => {},
  contracts: undefined,
  selectedContract: undefined,
  setSelectedContract: () => {},
};

export const ContractsContext = createContext(defaultData);

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const [selectedMilestone, setSelectedMilestone] = useState<NSMilestone>();
  const [selectedContract, setSelectedContract] = useState<NSContract>();
  const [contracts, setContracts] = useState<NSContract[]>();

  const dummyMilestones: NSMilestone[] = [
    {
      id: "djsjd324",
      description: "research and ideation",
      milestoneCount: Checkpoints.Start,
      dueDate: new Date(1717629066),
      approvalStatus: false,
      completionStatus: false,
      includesPayout: false,
      payoutAmount: 0,
    },
    {
      id: "fgg4422",
      description: "research and ideation",
      milestoneCount: Checkpoints.Halfway,
      dueDate: new Date(1717629066),
      approvalStatus: false,
      completionStatus: false,
      includesPayout: false,
      payoutAmount: 0,
    },
    {
      id: "kdkjew984",
      description: "final deliverables",
      milestoneCount: Checkpoints.End,
      dueDate: new Date(1717629066),
      approvalStatus: false,
      completionStatus: false,
      includesPayout: true,
      payoutAmount: 320,
    },
  ];

  const dummyContracts: NSContract[] = [
    {
      id: "fdadf2092kdk",
      title: "nethersync logo",
      description: "a logo design project",
      milestones: dummyMilestones,
      dateCreated: new Date(1717629066),
      clientEmail: "mail@nethersync.xyz",
      activeStatus: false,
      approvalStatus: false,
      completionStatus: false,
      paymentAmount: 320,
    },
    {
      id: "a49292dlkajdf",
      title: "nethersync website",
      description: "a website design and development project",
      milestones: dummyMilestones,
      dateCreated: new Date(1717629866),
      clientEmail: "mail@nethersync.xyz",
      activeStatus: true,
      approvalStatus: true,
      completionStatus: false,
      paymentAmount: 420,
    },
  ];

  useEffect(() => {
    setSelectedMilestone(dummyMilestones[0]);
    setSelectedContract(dummyContracts[0]);
    setContracts(dummyContracts);
  }, []);

  return (
    <ContractsContext.Provider
      value={{
        selectedMilestone,
        setSelectedMilestone,
        selectedContract,
        setSelectedContract,
        contracts,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
}
