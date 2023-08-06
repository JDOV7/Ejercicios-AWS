import express from "express";
import {
  obteniendoInformacionDelBucket,
  eliminandoElementoDelBucket,
  obteniendoInfoObjeto,
} from "../Controllers/S3Controller.js";

const router = express.Router();

router.post("/obteniendo-info-bucket", obteniendoInformacionDelBucket);
router.post("/eliminando-elemento-bucket", eliminandoElementoDelBucket);
router.post("/obteniendo-info-elemento", obteniendoInfoObjeto);

export default router;
