import Venta from '../models/ventaModel.js';

export const obtenerVentas = async (req, res) => {
    const busqueda = req.query.buscar || "";
    try {
        const ventas = await Venta.listar(busqueda);
        const total = await Venta.contarTotal();

        res.json({
            total,
            ventas
        });
    } catch (error) {
        console.error("Error obtenerVentas:", error);
        res.status(500).json({ mensaje: "Error al obtener ventas", error: error.message });
    }
};

export const obtenerDetalleVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Venta.obtenerPorId(id);

        if (!data.venta) {
            return res.status(404).json({ mensaje: "Venta no encontrada" });
        }

        // Enviamos la respuesta limpia al frontend
        res.json({
            venta: data.venta,
            detalle: data.productos // El frontend suele buscar "detalle" para el bucle de productos
        });
    } catch (error) {
        console.error("Error detalle venta:", error);
        res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
    }
};