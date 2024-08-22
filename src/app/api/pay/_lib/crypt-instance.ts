// @ts-ignore
const CryptAPI = require("@cryptapi/api");
import {
  BASE_URL,
  NETHERSYNC_FEES_WALLET_ADDRESS,
  NS_FEES_PERCENTAGE,
} from "@/server/config";
import { AllowedCurrency } from "@/lib/types";

export type CryptInstance = {
  payId: string;
  amount: number;
  receiverWalletAddress: string;
};
export async function cryptInstance(params: CryptInstance) {
  const { payId, amount, receiverWalletAddress } = params;
  const callbackUrl = `${BASE_URL}/api/pay/callback`;
  const nsParams = {
    pay_id: payId,
  };
  const NSFees = Number(NS_FEES_PERCENTAGE) * amount;
  const receiversPercentage = 1.0 - Number(NS_FEES_PERCENTAGE); // 90 percent
  const totalAmount = amount + NSFees;
  const cryptapiParams = { post: 1 };
  const recipientAddresses = `${NS_FEES_PERCENTAGE}@${NETHERSYNC_FEES_WALLET_ADDRESS}|${receiversPercentage}@${receiverWalletAddress}`;
  const ca = new CryptAPI(
    AllowedCurrency.POLYGON_USDT,
    recipientAddresses,
    callbackUrl,
    nsParams,
    cryptapiParams
  );
  const address = await ca.getAddress();
  const qrCode = await ca.getQrcode(totalAmount);
  const fees = await CryptAPI.getEstimate(AllowedCurrency.POLYGON_USDT);

  return { ca, totalAmount, NSFees, fees, qrCode, address };
}
