import { contactoModel } from "../models/contactoModel.js";

export const getContactos = async (req, res) => {
    try {
        const { buscar } = req.query;
        const contactos = await contactoModel.obtenerTodos(buscar);
        res.json(contactos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getContactoById = async (req, res) => {
    try {
        const contacto = await contactoModel.obtenerPorId(req.params.id);
        if (!contacto) return res.status(404).json({ mensaje: "Contacto no encontrado" });
        res.json(contacto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const upsertContacto = async (req, res) => {
    try {
        await contactoModel.guardar(req.body);
        res.json({ mensaje: "Información de contacto guardada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteContacto = async (req, res) => {
    try {
        await contactoModel.eliminar(req.params.id);
        res.json({ mensaje: "Contacto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};