export type NSFile = {
  id: string;
  selected?: NSFile["id"];
  path: string;
  name: string;
  format: string;
  size: string;
  uploadTimestamp: number;
  src?: string;
  cid?: string;
  receiver?: string;
  isPaid?: boolean;
  paymentAmount?: number;
  dataToEncryptHash?: string;
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

export enum AllowedCurrency {
  POLYGON_USDT = "polygon_usdt",
  POLYGON_USDC = "polygon_usdc",
  BASE_USDC = "base_usdc",
}

export type TransactionProps = {
  isComplete: boolean;
  pending: boolean;
  timeStamp: Date;
  hash: string;
  amount: number;
  currency: AllowedCurrency;
  addressIn: `0x${string}`;
  addressOut: `0x${string}`;
  txidOut?: string;
  confirmations?: number;
  gasFees?: number;
  NSFees?: number;
  price?: number;
};

export type TransferAlertProps = {
  receiversEmail: string;
  sendersEmail: string;
  title: string;
  downloadLink: string;
  message?: string;
  receiverWalletAddress?: string;
  paymentWalletAddress?: string;
  paymentAmount?: number;
};

export type EncryptedFile = {
  ciphertext: string;
  metadata?: any;
};
