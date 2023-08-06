import express from "express";
import { obteniendoInformacionDelBucket } from "../Controllers/S3Controller.js";

const router = express.Router();

router.post("/info-contenido-bucket", obteniendoInformacionDelBucket);

export default router;
