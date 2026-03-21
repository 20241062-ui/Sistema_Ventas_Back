import { sucursalModel } from "../models/sucursalModel.js";

export const getSucursales = async (req, res) => {
    try {
        const sucursales = await sucursalModel.obtenerTodas();
        res.json(sucursales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSucursalById = async (req, res) => {
    try {
        const sucursal = await sucursalModel.obtenerPorId(req.params.id);
        res.json(sucursal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const guardarSucursal = async (req, res) => {
    try {
        const { intid } = req.body;
        if (intid) {
            await sucursalModel.actualizar(intid, req.body);
            res.json({ mensaje: "Sucursal actualizada" });
        } else {
            await sucursalModel.crear(req.body);
            res.status(201).json({ mensaje: "Sucursal creada" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarSucursal = async (req, res) => {
    try {
        await sucursalModel.eliminarLogico(req.params.id);
        res.json({ mensaje: "Sucursal dada de baja" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};