// pages/api/upload-handler.ts
import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { db } from "@/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fileUrl } = req.body;

    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();
    const imgMetadata = await sharp(Buffer.from(buffer)).metadata();
    const { width, height } = imgMetadata;

    const configuration = await db.configuration.create({
      data: {
        imageUrl: fileUrl,
        height: height || 500,
        width: width || 500,
      },
    });

    res.status(200).json({ configId: configuration.id });
  } catch (error) {
    console.error("Upload or database operation failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
