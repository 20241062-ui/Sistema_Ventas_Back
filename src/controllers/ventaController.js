import Venta from '../models/ventaModel.js';

/* LISTAR VENTAS */
export const obtenerVentas = async (req, res) => {
    const busqueda = req.query.buscar || "";

    try {
        // Usamos el modelo que ya definiste
        const ventas = await Venta.listar(busqueda);
        const total = await Venta.contarTotal();

        res.json({
            total,
            ventas
        });

    } catch (error) {
        console.error("Error obtenerVentas:", error);
        res.status(500).json({
            mensaje: "Error al obtener ventas",
            error: error.message
        });
    }
};

/* DETALLE DE VENTA */
export const obtenerDetalleVenta = async (req, res) => {
    const { id } = req.params;

    try {
        // El modelo ya maneja la lógica de los índices [0] y [1] del CALL
        const data = await Venta.obtenerPorId(id);

        if (!data.venta) {
            return res.status(404).json({
                mensaje: "Venta no encontrada"
            });
        }

        res.json({
            venta: data.venta,
            detalle: data.productos
        });

    } catch (error) {
        console.error("Error detalle venta:", error);
        res.status(500).json({
            mensaje: "Error al obtener detalle",
            error: error.message
        });
    }
};