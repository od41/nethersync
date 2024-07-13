import { Resend } from "resend";
import { RESEND_API_KEY } from "@/server/config";
import { TransferAlertProps } from "./types";

const resend = new Resend(RESEND_API_KEY);

export async function sendTransferAlert(options: TransferAlertProps) {
  const {
    title,
    receiversEmail,
    downloadLink,
    message,
    sendersEmail,
    receiverWalletAddress,
    paymentWalletAddress,
    paymentAmount,
  } = options;
  const { data, error } = await resend.emails.send({
    from: "NetherSync <info@nethersync.xyz>",
    to: [receiversEmail],
    subject: `${sendersEmail} sent you ${title} via NetherSync`,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
        </head>
        <body style="background-color:rgb(255,255,255);margin-top:auto;margin-bottom:auto;margin-left:auto;margin-right:auto;font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;padding-left:0.5rem;padding-right:0.5rem">
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:465px;border-width:1px;border-style:solid;border-color:rgb(234,234,234);border-radius:0.25rem;margin-top:40px;margin-bottom:40px;margin-left:auto;margin-right:auto;padding:20px">
            <tbody>
              <tr style="width:100%">
                <td>
                  <h1 style="color:rgb(0,0,0);font-size:24px;font-weight:400;text-align:center;padding:0px;margin-top:30px;margin-bottom:30px;margin-left:0px;margin-right:0px"><a href="mailto:${sendersEmail}" style="color:#6d28d9;font-weight:normal;text-decoration:none"><span style="color:#6d28d9;font-weight:normal;text-decoration:none">${sendersEmail}</span></a> <br/> sent you ${title}</h1>
                  <strong style="font-size:14px;line-height:24px;margin-top:16px;color:rgb(0,0,0)">${title}</strong>
                  <p style="font-size:14px;line-height:24px;margin-bottom:16px;color:rgb(0,0,0)">${message}</p>
                  <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center;margin-top:32px;margin-bottom:32px">
                    <tbody>
                      <tr>
                        <td><a href="${downloadLink}" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;background-color:#6d28d9;border-radius:0.55rem;color:rgb(255,255,255);font-size:12px;font-weight:600;text-decoration-line:none;text-align:center;padding-left:1.25rem;padding-right:1.25rem;padding-top:0.75rem;padding-bottom:0.75rem;padding:12px 20px 12px 20px" target="_blank"><span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Get your files</span><span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                      </tr>
                    </tbody>
                  </table>
                  <hr style="border:1px solid rgb(234,234,234);" />
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)"><strong>Download Link:</strong> <br/><a href="https://nethersync.xyz" style="font-size:12px;line-height:24px;margin:16px 0;color:#6d28d9">${downloadLink}</a></p>

                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)"><strong>Payment Amount: </strong> <br/>${paymentAmount}</p>
                  <hr style="border:1px solid rgb(234,234,234);" />

                  <a href="https://nethersync.xyz" style="font-size:12px;line-height:24px;margin:16px 0;color:rgb(102,102,102)">NetherSync</a>
      </html>`,
  });
  if (error) {
    return console.error({ error });
  }
}
export async function sendDownloadAlert(options: any) {}
export async function sendPaymentAlert(options: any) {}
