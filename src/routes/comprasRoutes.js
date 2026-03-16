import express from "express";
import { 
    listarCompras, 
    registrarCompra, 
    verCompra, 
    obtenerProveedoresParaSelect, 
    obtenerProductosParaSelect 
} from "../controllers/comprasController.js";

const router = express.Router();

// 1. Rutas Estáticas / Auxiliares (Poner arriba para evitar conflictos con :id)
router.get("/aux/proveedores", obtenerProveedoresParaSelect);
router.get("/aux/productos", obtenerProductosParaSelect);

// 2. Rutas Generales
router.get("/", listarCompras);
router.post("/", registrarCompra);

// 3. Rutas con Parámetros (Poner al final)
router.get("/:id", verCompra);

export default router;