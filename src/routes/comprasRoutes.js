import express from "express";
import { 
    listarCompras, 
    registrarCompra, 
    verCompra, 
    obtenerProveedoresParaSelect, 
    obtenerProductosParaSelect 
} from "../controllers/comprasController.js";

const router = express.Router();

router.get("/", listarCompras);
router.get("/:id", verCompra);
router.post("/", registrarCompra);
router.get("/aux/proveedores", obtenerProveedoresParaSelect);
router.get("/aux/productos", obtenerProductosParaSelect);

export default router;