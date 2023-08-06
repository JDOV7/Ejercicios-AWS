import {
  S3Client,
  ListObjectsCommand,
  DeleteObjectCommand,
  GetObjectAttributesCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const { accessKeyId, secretAccessKey, Bucket } = process.env;
const client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

//controlador para ver todos los elementos de un Bucket
// Prefix busca que la llave inicie con este valor
// maxKeys: es la cantidad de valores que se desea devolver
const obteniendoInformacionDelBucket = async (req, res) => {
  console.log(req.body);
  try {
    // throw new Error("error");
    const { Prefix, Marker, MaxKeys } = req.body;
    const informacion = { Bucket, Prefix, Marker, MaxKeys };
    const comando = new ListObjectsCommand(informacion);
    const respuesta = await client.send(comando);
    return res.status(200).json({
      respuesta: respuesta.Contents,
    });
  } catch (error) {
    return res.status(400).json({
      msg: "Ocurrio un error inesperado",
    });
  }
};

// Este comando elimina un elemento de bucket usando el bucket y la llave, la desventaja es que envia la misma solicutd independienteme si el objeto existe o no, por lo tanto debe combinarse mas de un comando para anes verificar que si existe el objeto
const eliminandoElementoDelBucket = async (req, res) => {
  try {
    const { Key } = req.body;
    if (!Key) {
      throw new Error("La llave este obligatoria");
    }
    // throw new Error("error");
    const configuracion = {
      Bucket,
      Key,
    };
    const comando = new DeleteObjectCommand(configuracion);
    const respuesta = await client.send(comando);
    if (!respuesta) {
      throw new Error("Error en la peticion");
    }
    return res.status(200).json({
      respuesta,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }
};

// si el objecto existe devuelve la info de las propiedades espeficadas en ObjectAttributes con un code 200, si no retorna un erro con code 400
// ObjectAttributes, Bucket y Key son valores obligatorios
const obteniendoInfoObjeto = async (req, res) => {
  try {
    const { Key } = req.body;
    if (!Key) {
      throw new Error("La llave este obligatoria");
    }
    // throw new Error("error");
    const configuracion = {
      Bucket,
      Key,
      ObjectAttributes: [
        "ETag",
        "Checksum",
        "ObjectParts",
        "StorageClass",
        "ObjectSize",
      ],
    };
    const comando = new GetObjectAttributesCommand(configuracion);
    const respuesta = await client.send(comando);
    return res.status(200).json({
      respuesta,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }
};

export {
  obteniendoInformacionDelBucket,
  eliminandoElementoDelBucket,
  obteniendoInfoObjeto,
};
