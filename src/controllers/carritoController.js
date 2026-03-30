import { carritoModel } from "../models/clienteModel.js"; 

export const getCarrito = async (req, res) => {
    try {
        // req.user viene del middleware de autenticación
        const productos = await carritoModel.obtenerPorCliente(req.user.id);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarAlCarrito = async (req, res) => {
    try {
        const { vchNo_Serie } = req.body;
        const id_Cliente = req.user.id; 
        await carritoModel.agregar(id_Cliente, vchNo_Serie);
        res.json({ mensaje: "Producto añadido a la bolsa" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarDelCarrito = async (req, res) => {
    try {
        await carritoModel.eliminar(req.params.id);
        res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};