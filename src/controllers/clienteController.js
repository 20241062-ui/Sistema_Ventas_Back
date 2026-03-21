import { clienteModel } from "../models/clienteModel.js";

export const getClientes = async (req, res) => {
    try {
        const { buscar } = req.query;
        const clientes = await clienteModel.obtenerTodos(buscar);
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getClienteById = async (req, res) => {
    try {
        const cliente = await clienteModel.obtenerPorId(req.params.id);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarCliente = async (req, res) => {
    try {
        await clienteModel.actualizar(req.params.id, req.body);
        res.json({ mensaje: "Cliente actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const patchEstadoCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await clienteModel.cambiarEstado(id, estado);
        res.json({ mensaje: "Estado del cliente actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};