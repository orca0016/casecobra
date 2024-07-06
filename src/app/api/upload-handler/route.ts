// app/api/upload-handler/route.ts
import Log from "@/components/Log";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, cnfId } = await req.json();

    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();
    const imgMetadata = await sharp(Buffer.from(buffer)).metadata();
    const { width, height } = imgMetadata;

    let configuration;
    Log(cnfId);
    if (!cnfId) {
      configuration = await db.configuration.create({
        data: {
          imageUrl: fileUrl,
          height: height || 500,
          width: width || 500,
        },
      });
    } else {
      configuration = await db.configuration.update({
        where: { id: cnfId },
        data: {
          croppedImageUrl: fileUrl,
        },
      });
    }

    return NextResponse.json({ configId: configuration.id }, { status: 200 });
  } catch (error) {
    console.error("Upload or database operation failed", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
