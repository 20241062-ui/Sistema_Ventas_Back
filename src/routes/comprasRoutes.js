import express from "express";
import { 
    listarCompras, 
    registrarCompra, 
    verCompra, 
    obtenerProveedoresParaSelect, 
    obtenerProductosParaSelect 
} from "../controllers/comprasController.js";

const router = express.Router();

router.get("/aux/proveedores", obtenerProveedoresParaSelect);
router.get("/aux/productos", obtenerProductosParaSelect);

router.get("/", listarCompras);
router.post("/", registrarCompra);

router.get("/:id", verCompra);

export default router;