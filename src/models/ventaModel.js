import db from '../config/BD.js';

const Venta = {
    // Listar todas las ventas con búsqueda
    listar: async (busqueda) => {
        const [result] = await db.query("CALL sp_listar_ventas(?)", [busqueda]);
        // Los resultados de un CALL en mysql2 vienen en el índice [0]
        return result[0];
    },

    obtenerPorId: async (id) => {
        // El primer nivel de desestructuración [result] obtiene los paquetes de datos del SP
        const [result] = await db.query("CALL sp_ver_detalle_venta(?)", [id]);

        return {
            // result[0][0] es la primera fila del primer SELECT (datos generales de la venta)
            venta: result[0] && result[0][0] ? result[0][0] : null,
            // result[1] es el segundo SELECT completo (la lista de productos vendidos)
            productos: result[1] || []
        };
    },

    contarTotal: async () => {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM tblventas");
        return rows[0].total;
    }
};

export default Venta;