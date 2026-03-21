import { informacionModel } from "../models/informacionModel.js";

export const getInformaciones = async (req, res) => {
    try {
        const { buscar } = req.query;
        const datos = await informacionModel.obtenerTodos(buscar);
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getInformacionById = async (req, res) => {
    try {
        const dato = await informacionModel.obtenerPorId(req.params.id);
        if (!dato) return res.status(404).json({ mensaje: "Información no encontrada" });
        res.json(dato);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const upsertInformacion = async (req, res) => {
    try {
        await informacionModel.guardar(req.body);
        res.json({ mensaje: "Información guardada con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const patchEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await informacionModel.cambiarEstado(id, estado);
        res.json({ mensaje: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};