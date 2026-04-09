import Categoria from '../models/categoriaModel.js';

export const listarCategorias = async (req, res) => {
    try {
        const { buscar } = req.query;
        const categorias = await Categoria.obtenerTodas(buscar || "");
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener categorías", error: error.message });
    }
};

export const obtenerCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.obtenerPorId(req.params.id);
        if (!categoria) return res.status(404).json({ mensaje: "Categoría no encontrada" });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la categoría" });
    }
};

export const guardarCategoria = async (req, res) => {
    try {
        const { vchNombre } = req.body;
        await Categoria.crear(vchNombre);
        res.json({ status: "success", mensaje: "Categoría guardada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar la categoría" });
    }
};

export const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { vchNombre } = req.body;
        await Categoria.actualizar(id, vchNombre);
        res.json({ status: "success", mensaje: "Categoría actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la categoría" });
    }
};

export const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        await Categoria.cambiarEstado(id, 0);
        res.json({ status: "success", mensaje: "Categoría dada de baja correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al dar de baja la categoría" });
    }
};

export const reactivarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        await Categoria.cambiarEstado(id, 1);
        res.json({ status: "success", mensaje: "Categoría reactivada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al reactivar la categoría" });
    }
};