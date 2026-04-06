import { usuarioModel } from "../models/adminsuarioModel.js";

export const getUsuarios = async (req, res) => {
    try {
        const { buscar } = req.query;
        const usuarios = await usuarioModel.obtenerTodos(buscar);
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsuarioById = async (req, res) => {
    try {
        const usuario = await usuarioModel.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const upsertUsuario = async (req, res) => {
    try {
        await usuarioModel.guardar(req.body);
        res.json({ mensaje: "Usuario procesado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error: El correo electrónico ya podría estar en uso." });
    }
};

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await usuarioModel.cambiarEstado(id, 0);
        res.json({ mensaje: "Usuario dado de baja correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al dar de baja: " + error.message });
    }
};

export const patchEstadoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await usuarioModel.cambiarEstado(id, estado);
        res.json({ mensaje: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
