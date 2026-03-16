import express from "express";
import { listarCompras, registrarCompra, verCompra } from "../controllers/comprasController.js";
import { verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",verificarAdmin, listarCompras);
router.get("/:id",verificarAdmin, verCompra);
router.post("/",verificarAdmin, registrarCompra)

export default router;