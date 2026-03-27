import db from '../config/BD.js';

export const analisisModel = {
    // Obtiene solo productos activos que han tenido ventas registradas
    obtenerProductosPredecibles: async () => {
        const sql = `
            SELECT 
                p.vchNo_Serie, 
                p.vchNombre, 
                p.intStock as stock_actual,
                SUM(dv.intCantidad) as unidades_vendidas
            FROM tblproductos p
            INNER JOIN tbldetalleventa dv ON p.vchNo_Serie = dv.No_Serie
            WHERE p.Estado = 1
            GROUP BY p.vchNo_Serie
            HAVING unidades_vendidas > 0`;
        const [rows] = await db.query(sql);
        return rows;
    },

    // Obtiene el detalle matemático para un producto específico
    obtenerHistorialParaCalculo: async (noSerie) => {
        const sql = `
            SELECT 
                p.vchNombre,
                p.intStock as stock_actual,
                (p.intStock + SUM(dv.intCantidad)) as stock_inicial_estimado,
                DATEDIFF(MAX(v.fecFecha), MIN(v.fecFecha)) as dias_venta
            FROM tblproductos p
            INNER JOIN tbldetalleventa dv ON p.vchNo_Serie = dv.No_Serie
            INNER JOIN tblventas v ON dv.id_venta = v.id_Ventas
            WHERE p.vchNo_Serie = ?
            GROUP BY p.vchNo_Serie`;
        const [rows] = await db.query(sql, [noSerie]);
        return rows[0];
    }
};