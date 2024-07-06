// utils/upload-js.ts
import { Upload } from "upload-js";

const upload =  Upload({ apiKey: process.env.NEXT_PUBLIC_UPLOAD_API_KEY! });

export default upload;
