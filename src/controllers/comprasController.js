import * as comprasModel from "../models/comprasModel.js"

const listarCompras = async (req, res) => {
    try {
        const compras = await comprasModel.obtenerCompras()
        res.json({
            total: compras.length,
            compras: compras
        })
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo compras" })
    }
}

const verCompra = async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await comprasModel.obtenerCompraPorId(id)

        if (!resultado.compra) {
            return res.status(404).json({ error: "Compra no encontrada" })
        }
        res.json(resultado)

    } catch (error) {
        console.error("Error en verCompra:", error);
        res.status(500).json({ error: "Error obteniendo detalle" })
    }
}

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

export { listarCompras, verCompra, registrarCompra }