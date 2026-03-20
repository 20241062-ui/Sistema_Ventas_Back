import db from '../config/BD.js';

const Venta = {
    listar: async (busqueda) => {
        const [result] = await db.query("CALL sp_listar_ventas(?)", [busqueda]);
        return result[0];
    },

    obtenerPorId: async (id) => {
        const [result] = await db.query("CALL sp_ver_detalle_venta(?)", [id]);

        return {
            venta: result[0] && result[0][0] ? result[0][0] : null,
            productos: result[1] || []
        };
    },

    contarTotal: async () => {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM tblventas");
        return rows[0].total;
    }
};

export default Venta;