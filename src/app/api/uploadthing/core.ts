import { createUploadthing, type FileRouter } from "uploadthing/next"
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      console.log("Middleware input:", input)
      return { input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete metadata:", metadata); // لاگ کردن متادیتا
      console.log("Uploaded file:", file); // لاگ کردن فایل آپلود شده
      const { configId } = metadata.input;
      return { configId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
