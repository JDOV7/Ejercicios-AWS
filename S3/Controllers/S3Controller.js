import {
  S3Client,
  ListObjectsCommand,
  DeleteObjectCommand,
  GetObjectAttributesCommand,
  GetObjectCommand,
  SelectObjectContentCommand,
} from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
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

// Se necesita de una Key para obtener el objecto
const obteniendoObjecto = async (req, res) => {
  try {
    const { Key } = req.body;
    if (!Key) {
      throw new Error("La llave es obligatoria");
    }
    const configuracion = {
      Bucket,
      Key,
    };
    const comando = new GetObjectCommand(configuracion);
    const respuesta = await client.send(comando);
    return res.status(200).json({ ContentType: respuesta.ContentType });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }
};

const upload = multer({
  storage: multerS3({
    s3: client,
    bucket: Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",

    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const mimetype = file.mimetype.split("/")[1];
      cb(null, `ejercicios/${Date.now().toString()}.${mimetype}`);
    },
  }),
});

// el campo por el cual se envia el objecto se llama imagen
const subiendoObjecto = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "Ocurrio un error" });
  }
  return res.status(200).json({ objecto: req.file });
};

// Datos: Key, Expression
// Key: el nombre del objecto en este caso un JSON
// Expression: la sentencia SQL necesaria para buscar
/**
 * 
 * Ejemplo 1
  {
    "Key":"Path para Trabajadores",
    "Expression":"SELECT s.Nombre, s.Puesto FROM s3object[*][*] s where s.Puesto.Cargo= 'Asistente' ;"
  }
 * Ejemplo 2
  {
    "Key":"Path para dragon_stats_one.json",
    "Expression":"SELECT s.dragon_name_str, s.description_str FROM s3object[*][*] s where  s.family_str='red';"
  }
 * **/
const buscandoDentroDeUnJSON = async (req, res) => {
  try {
    const { Key, Expression } = req.body;
    if (!Key || !Expression) {
      throw new Error("La llave es obligatoria");
    }
    // console.log(Key);
    // console.log(Expression);
    const configuracion = {
      Bucket,
      Key,
      Expression,
      ExpressionType: "SQL",
      InputSerialization: {
        JSON: {
          Type: "DOCUMENT",
        },
      },
      OutputSerialization: { JSON: {} },
    };
    const comando = new SelectObjectContentCommand(configuracion);
    const respuesta = await client.send(comando);
    let results = "";

    for await (const event of respuesta.Payload) {
      if (event.Records) {
        const chunk =
          event.Records.Payload instanceof Buffer
            ? event.Records.Payload
            : Buffer.from(event.Records.Payload);

        results += chunk.toString();
      }
    }
    const jsonArray = results.trim().split("\n");
    const parsedObjects = jsonArray.map((jsonString) => JSON.parse(jsonString));

    return res.status(200).json(parsedObjects);
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
  obteniendoObjecto,
  upload,
  subiendoObjecto,
  buscandoDentroDeUnJSON,
};
