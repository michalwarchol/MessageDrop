import { FileUpload } from "graphql-upload";

export const createFileBuffer = (media: FileUpload): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        let chunks: any[] = [];
        let streamReader = media.createReadStream();
        streamReader.on("data", (chunk) => chunks.push(chunk as Buffer));
        streamReader.once("end", () => resolve(Buffer.concat(chunks)));
        streamReader.on("error", (err) =>
          reject(`error converting stream - ${err}`)
        );
      });
}