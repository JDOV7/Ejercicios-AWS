import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const { accessKeyId, secretAccessKey, Bucket } = process.env;
const client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const obteniendoInformacionDelBucket = async (req, res) => {
  console.log(accessKeyId);
  console.log(secretAccessKey);

  try {
    const informacion = { Bucket };
    const comando = new ListObjectsCommand(informacion);
    const respuesta = await client.send(comando);
    return res.status(200).json({
      respuesta,
    });
  } catch (error) {
    return res.status(400).json({
      msj: "Error",
    });
  }
};

export { obteniendoInformacionDelBucket };
