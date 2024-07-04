import axios from "axios";

export async function handlePayApi(
  payId: string,
  payAmount: number,
  receiverWalletAddress: string
) {
  try {
    const url = "/api/pay/create";
    const payload = {
      payId,
      amount: payAmount,
      receiverWalletAddress,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const res = await axios.post(url, payload, { headers });
    console.log("pay response", res);
    if (res.status !== 200) {
      throw new Error("Couldn't create new payment");
    }
    return { data: res.data };
  } catch (error) {
    console.error("something went wrong", error);
    return false;
  }
}

export async function handleConfirmPaymentApi(
  payId: string,
  payAmount: number,
  receiverWalletAddress: string
) {
  try {
    const url = "/api/pay/verify";
    const payload = {
      payId,
      amount: payAmount,
      receiverWalletAddress,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const res = await axios.post(url, payload, { headers });
    return { data: res.data };
  } catch (error) {
    console.error("something went wrong", error);
    return false;
  }
}
