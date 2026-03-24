import Marca from '../models/marcaModel.js';

export const listarMarcas = async (req, res) => {
    try {
        const { buscar } = req.query;
        const marcas = await Marca.obtenerTodas(buscar || "");
        res.json(marcas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener marcas", error: error.message });
    }
};

export const obtenerMarca = async (req, res) => {
    try {
        const marca = await Marca.obtenerPorId(req.params.id);
        if (!marca) return res.status(404).json({ mensaje: "Marca no encontrada" });
        res.json(marca);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la marca" });
    }
};

export const guardarMarca = async (req, res) => {
    try {
        const { vchNombre } = req.body;
        await Marca.crear(vchNombre);
        res.json({ status: "success", mensaje: "Marca guardada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar la marca" });
    }
};

export const actualizarMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const { vchNombre } = req.body;
        await Marca.actualizar(id, vchNombre);
        res.json({ status: "success", mensaje: "Marca actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la marca" });
    }
};

export const eliminarMarca = async (req, res) => {
    try {
        const { id } = req.params;
        await Marca.eliminarLogico(id);
        res.json({ status: "success", mensaje: "Marca dada de baja del sistema" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al dar de baja la marca" });
    }
};