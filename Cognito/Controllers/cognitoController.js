import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  UpdateUserPoolCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";
dotenv.config();
const { accessKeyId, secretAccessKey, UserPoolId } = process.env;
const cliente = new CognitoIdentityProviderClient({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: "us-east-1",
});

// error 400,
// TODO
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/preview/client/cognito-identity-provider/command/UpdateUserPoolCommand/
const configurandoPool = async (req, res) => {
  try {
    console.log(req.body);
    const { EmailVerificationSubject, EmailVerificationMessage } = req.body;
    if (!EmailVerificationSubject || !EmailVerificationMessage) {
      throw new Error("Falta uno o mas elementos");
    }
    const configuracion = {
      UserPoolId,
      EmailVerificationSubject,
      EmailVerificationMessage,
    };
    const comando = new UpdateUserPoolCommand(configuracion);
    console.log("llengado1");
    const respuesta = await cliente.send(comando);
    console.log("llengado2");
    if (!respuesta) {
      throw new Error("No se pudo configurar el pool");
    }
    res.status(200).json(respuesta);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const crearUsuario = async (req, res) => {
  try {
    console.log(req.body);
    const { Username } = req.body;
    if (!Username) {
      throw new Error("Falta uno o mas elementos");
    }
    const configuracion = {
      UserPoolId,
      Username,
      UserAttributes: [
        // AttributeListType
        {
          // AttributeType
          Name: "name", // required
          Value: "jesus daniel",
        },
      ],
      //   UserAttributes: [{ Name }],
      DesiredDeliveryMediums: [
        // DeliveryMediumListType
        "EMAIL",
      ],
    };
    const comando = new AdminCreateUserCommand(configuracion);
    const respuesta = await cliente.send(comando);
    if (!respuesta) {
      throw new Error("No se pudo crear el usuario");
    }
    res.status(200).json(respuesta);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export { crearUsuario, configurandoPool };
