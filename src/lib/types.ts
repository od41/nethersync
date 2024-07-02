export type NSFile = {
  id: string;
  selected?: NSFile["id"];
  path: string;
  name: string;
  format: string;
  size: string;
  uploadTimestamp: number;
  src?: string;
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
  receiversEmail: string;
  sendersEmail: string;
  isPaid?: boolean;
  paymentStatus?: boolean;
  paymentAmount?: number;
  walletAddress?: string;
};

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

export type UserProps = {
  email: string | undefined;
};

export type AuthTypeProps = {
  signIn: () => void;
  sessionId: string | undefined;
  user: UserProps | undefined;
};
