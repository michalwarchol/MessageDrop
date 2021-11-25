import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export const getFile = async (
  s3: S3,
  imageId: string | null
): Promise<string | null> => {
  if (imageId == null) {
    return null;
  }

  const image = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageId,
    })
  );
  const buffer: Buffer = await new Promise((resolve, reject) => {
    let readableStream = image?.Body as Readable;
    let chunks: any[] = [];
    readableStream.on("data", (chunk) => chunks.push(chunk));
    readableStream.once("end", () => resolve(Buffer.concat(chunks)));
    readableStream.on("error", (err) =>
      reject(`error converting stream - ${err}`)
    );
  });

  return buffer.toString("base64");
};
