import * as comprasModel from "../models/comprasModel.js";

/* 1. LISTAR TODAS LAS COMPRAS */
const listarCompras = async (req, res) => {
    try {
        const compras = await comprasModel.obtenerCompras();
        res.json({
            total: compras.length,
            compras: compras
        });
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo compras" });
    }
};

/* 2. VER DETALLE DE UNA COMPRA */
export const verCompra = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await comprasModel.obtenerCompraPorId(id);

        if (!resultado.compra) {
            return res.status(404).json({ error: `La compra ${id} no existe.` });
        }
        
        res.json(resultado);
    } catch (error) {
        // IMPORTANTE: Esto te dirá el error real en el JSON de respuesta
        res.status(500).json({ 
            error: "Error en la base de datos",
            sqlMessage: error.sqlMessage, // Ejemplo: "Unknown column 'id_Compra' in 'where clause'"
            code: error.code 
        });
    }
};

/* 3. REGISTRAR UNA NUEVA COMPRA (TRANSACCIÓN) */
const registrarCompra = async (req, res) => {
    try {
        const { rfc, total, productos } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).json({ mensaje: "La compra debe tener al menos un producto" });
        }

        const resultado = await comprasModel.crearCompra({ rfc, total, productos });
        res.status(201).json({ mensaje: "Compra registrada con éxito", id: resultado.id_Compra });

    } catch (error) {
        console.error("Error al registrar compra:", error);
        res.status(500).json({ mensaje: "Error interno al procesar la compra", error: error.message });
    }
};

/* 4. AUXILIAR: OBTENER PROVEEDORES (PARA SELECT) */
const obtenerProveedoresParaSelect = async (req, res) => {
    try {
        // El controlador ya no hace SQL, le pide al MODELO los datos
        const proveedores = await comprasModel.obtenerProveedoresParaSelect();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener proveedores" });
    }
};

/* 5. AUXILIAR: OBTENER PRODUCTOS (PARA SELECT) */
const obtenerProductosParaSelect = async (req, res) => {
    try {
        // El controlador ya no hace SQL, le pide al MODELO los datos
        const productos = await comprasModel.obtenerProductosParaSelect();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

// EXPORTACIÓN ÚNICA (Limpia y sin conflictos)
export { 
    listarCompras, 
    verCompra, 
    registrarCompra, 
    obtenerProveedoresParaSelect, 
    obtenerProductosParaSelect 
};