import Producto from '../models/productoModel.js';

// Cambiamos 'getDashboard' por 'obtenerDashboardProductos' para que coincida con adminRoutes
export const obtenerDashboardProductos = async (req, res) => {
    try {
        const buscar = req.query.buscar || "";
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;

        const result = await Producto.obtenerTodos(buscar, offset, limite);
        
        res.json({
            productos: result.productos, 
            counts: result.stats,
            pagination: {
                totalPages: Math.ceil(result.totalFiltrados / limite), 
                currentPage: pagina
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Cambiamos 'updateEstado' por 'cambiarEstadoProducto'
export const cambiarEstadoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const usuario = { nombre: req.user.nombre, rol: req.user.rol };

        await Producto.cambiarEstado(id, estado, usuario);
        res.json({ status: 'success', message: 'Estado actualizado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// AÑADIR estas funciones que te pide adminRoutes y no tenías
export const agregarProducto = async (req, res) => {
    try {
        await Producto.crear(req.body);
        res.json({ status: 'success', message: 'Producto agregado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Asumiendo que tienes un método eliminar en tu modelo
        await db.query('DELETE FROM tblproductos WHERE vchNo_Serie = ?', [id]);
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};