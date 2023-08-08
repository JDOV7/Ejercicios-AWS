import express from "express";
import dotenv from "dotenv";
import ejerciciosS3 from "./S3/Router/routes.js";
import ejerciciosCognito from "./Cognito/Router/routes.js";

const app = express();

app.use(express.json());

dotenv.config();

const port = process.env.PORT || 4000;

app.use("/api/s3", ejerciciosS3);
app.use("/api/cognito", ejerciciosCognito);

app.listen(port, servidor);

function servidor() {
  console.log(`Servidor funcionando en el puerto ${port}`);
}
