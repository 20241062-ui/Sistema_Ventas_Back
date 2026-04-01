import Carrito from '../models/carritoModel.js';

export const obtenerCarrito = async (req, res) => {
    try {
        const id_cliente = req.user.intid_Cliente || req.user.id; 
        
        if (!id_cliente) {
            return res.status(401).json({ mensaje: "Usuario no identificado" });
        }

        const items = await Carrito.obtenerPorUsuario(id_cliente);
        res.json(items);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener carrito", error: error.message });
    }
};

export const agregarAlCarrito = async (req, res) => {
    try {
        const id_cliente = req.user.id || req.user.intid_Cliente;
        const { vchNo_Serie, intCantidad } = req.body;
        await Carrito.agregar(id_cliente, vchNo_Serie, intCantidad || 1);
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarDelCarrito = async (req, res) => {
    try {
        const id_cliente = req.user.id || req.user.intid_Cliente;
        const { id } = req.params; 
        await Carrito.eliminar(id, id_cliente);
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};