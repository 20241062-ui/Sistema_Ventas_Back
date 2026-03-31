import Carrito from '../models/carritoModel.js';

export const obtenerCarrito = async (req, res) => {
    try {
        const id_cliente = req.user.id; // Extraído del middleware de autenticación
        const items = await Carrito.obtenerPorUsuario(id_cliente);
        res.json(items);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el carrito", error: error.message });
    }
};

export const agregarAlCarrito = async (req, res) => {
    try {
        const id_cliente = req.user.id;
        const { vchNo_Serie, intCantidad } = req.body;

        if (!vchNo_Serie) return res.status(400).json({ mensaje: "ID de producto requerido" });

        await Carrito.agregar(id_cliente, vchNo_Serie, intCantidad || 1);
        res.json({ status: 'success', mensaje: "Producto añadido al carrito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al agregar al carrito", error: error.message });
    }
};

export const eliminarDelCarrito = async (req, res) => {
    try {
        const id_cliente = req.user.id;
        const { id } = req.params; // ID del registro en el carrito

        await Carrito.eliminar(id, id_cliente);
        res.json({ status: 'success', mensaje: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar del carrito", error: error.message });
    }
};