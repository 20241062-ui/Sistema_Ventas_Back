import { proveedoresModel } from "../models/proveedoresModel.js";

export const getProveedores = async (req, res) => {
    try {
        const { buscar } = req.query;
        const proveedores = await proveedoresModel.obtenerTodos(buscar);
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProveedorByRFC = async (req, res) => {
    try {
        const proveedor = await proveedoresModel.obtenerPorRFC(req.params.rfc);
        if (!proveedor) return res.status(404).json({ mensaje: "No encontrado" });
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const guardarProveedor = async (req, res) => {
    try {
        const { vchRFC } = req.body;
        // Verificar si ya existe para decidir si es UPDATE o INSERT
        const existe = await proveedoresModel.obtenerPorRFC(vchRFC);
        
        if (existe) {
            await proveedoresModel.actualizar(vchRFC, req.body);
            res.json({ mensaje: "Proveedor actualizado con éxito" });
        } else {
            await proveedoresModel.crear(req.body);
            res.status(201).json({ mensaje: "Proveedor creado con éxito" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarProveedor = async (req, res) => {
    try {
        await proveedoresModel.eliminarLogico(req.params.rfc);
        res.json({ mensaje: "Proveedor eliminado (lógicamente)" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};