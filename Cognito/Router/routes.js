import express from "express";
import {
  configurandoPool,
  crearUsuario,
} from "../Controllers/cognitoController.js";

const router = express.Router();

router.post("/configurando-pool", configurandoPool);
router.post("/crear-usuario", crearUsuario);

export default router;
