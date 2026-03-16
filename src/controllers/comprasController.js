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

        // Enviamos el objeto con 'compra' y 'detalle'
        res.json(resultado)

    } catch (error) {
        console.error("Error en verCompra:", error);
        res.status(500).json({ error: "Error obteniendo detalle" })
    }
}

export { listarCompras, verCompra }