import { redis } from "@/server/config";
export async function POST(request: Request, response: Response) {
  const { senderEmail, recipientEmail, fileUrl, fileName, sessionId } =
    request.body;
  if (!senderEmail || !recipientEmail || !fileUrl || !fileName) {
    return response.status(400).json({ message: "Missing required fields" });
  }
  await redis.hset(sessionId, {
    senderEmail,
    recipientEmail,
    fileUrl,
    fileName,
    createdAt: new Date().toISOString(),
  });

  response
    .status(200)
    .json({ message: "File uploaded successfully", sessionId });
}
