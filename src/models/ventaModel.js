import db from '../config/BD.js';

const Venta = {
    // Listar todas las ventas con búsqueda
    listar: async (busqueda) => {
        const [result] = await db.query("CALL sp_listar_ventas(?)", [busqueda]);
        // Los resultados de un CALL en mysql2 vienen en el índice [0]
        return result[0]; 
    },

    // Obtener una venta y su lista de productos (Detalle)
    obtenerPorId: async (id) => {
        const [result] = await db.query("CALL sp_ver_detalle_venta(?)", [id]);
        
        /* Si tu SP hace dos SELECT (uno a la venta y otro a los productos):
           result[0] contiene los datos de la venta (Cabecera)
           result[1] contiene la lista de productos (Detalle)
        */
        return {
            venta: result[0][0] || null,
            productos: result[1] || []
        };
    },

    contarTotal: async () => {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM tblventas");
        return rows[0].total;
    }
};

export default Venta;