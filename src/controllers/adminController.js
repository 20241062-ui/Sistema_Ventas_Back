// IMPORTANTE: Ya NO importamos 'db', solo el Modelo
import Producto from '../models/productoModel.js';

export const obtenerDashboardProductos = async (req, res) => {
    const busqueda = req.query.buscar || "";
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 10;
    const offset = (pagina - 1) * limite;

    try {
        // 1. Pedimos las estadísticas al modelo
        const counts = await Producto.obtenerEstadisticas();

        // 2. Pedimos los datos del dashboard (Procedimientos) al modelo
        const { totalItems, listaProductos } = await Producto.obtenerDashboard(busqueda, offset, limite);

        // 3. Respondemos con el formato que espera el Frontend
        res.json({
            counts: counts,
            productos: listaProductos,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limite) || 1,
                currentPage: pagina
            }
        });
    } catch (error) {
        console.error("Error en obtenerDashboardProductos:", error);
        res.status(500).json({ mensaje: "Error al procesar el dashboard" });
    }
};

export const cambiarEstadoProducto = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; 

    try {
        // Le ordenamos al modelo cambiar el estado
        await Producto.cambiarEstado(id, estado);
        res.json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "No se pudo cambiar el estado" });
    }
};