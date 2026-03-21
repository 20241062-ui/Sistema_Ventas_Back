import { faqModel } from "../models/faqModel.js";

export const getFAQs = async (req, res) => {
    try {
        const { buscar } = req.query;
        const faqs = await faqModel.obtenerTodas(buscar);
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFAQById = async (req, res) => {
    try {
        const faq = await faqModel.obtenerPorId(req.params.id);
        if (!faq) return res.status(404).json({ mensaje: "Pregunta no encontrada" });
        res.json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const upsertFAQ = async (req, res) => {
    try {
        await faqModel.guardar(req.body);
        res.json({ mensaje: "Pregunta guardada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const patchEstadoFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await faqModel.cambiarEstado(id, estado);
        res.json({ mensaje: "Estado actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};