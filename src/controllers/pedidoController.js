import { pedidoModel } from '../models/pedidoModel.js';

export const procesarCompra = async (req, res) => {
    const { total, items } = req.body;
    const clienteId = req.user.id; // Viene del token

    try {
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío" });
        }

        const pedidoId = await pedidoModel.crear(clienteId, total, items);
        res.status(201).json({ 
            success: true, 
            message: "Pedido realizado con éxito", 
            pedidoId 
        });
    } catch (error) {
        res.status(500).json({ message: "Error al procesar el pedido", error: error.message });
    }
};