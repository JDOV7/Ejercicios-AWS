import express from "express";
import {
  obteniendoInformacionDelBucket,
  eliminandoElementoDelBucket,
  obteniendoInfoObjeto,
  obteniendoObjecto,
  upload,
  subiendoObjecto,
  buscandoDentroDeUnJSON,
} from "../Controllers/S3Controller.js";

const router = express.Router();

router.post("/obteniendo-info-bucket", obteniendoInformacionDelBucket);
router.post("/eliminando-elemento-bucket", eliminandoElementoDelBucket);
router.post("/obteniendo-info-elemento", obteniendoInfoObjeto);
router.post("/obteniendo-elemento", obteniendoObjecto);
router.post("/subiendo-elemento", upload.single("imagen"), subiendoObjecto);
router.post("/buscando-info-elemento", buscandoDentroDeUnJSON);

export default router;
