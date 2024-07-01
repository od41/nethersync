import axios from "axios";

export async function handlePayApi(payId: string, payAmount: number) {
  try {
    const url = "/api/pay/create";
    const payload = {
      payId,
      amount: payAmount,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const res = await axios.post(url, payload, { headers });
    console.log("pay response", res);
    return { data: res.data };
  } catch (error) {
    console.error("something went wrong", error);
    return false;
  }
}
