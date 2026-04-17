import db from '../config/BD.js';

export const analisisModel = {
    obtenerHistorialParaCalculo: async (noSerie) => {
        const sql = `
            SELECT 
                p.vchNombre,
                p.intStock as stock_actual,
                (p.intStock + SUM(dv.Cantidad)) as stock_inicial_estimado,
                DATEDIFF(MAX(v.Fecha_Venta), MIN(v.Fecha_Venta)) as dias_venta
                
            FROM tblproductos p
            INNER JOIN tbldetalleventa dv ON p.vchNo_Serie = dv.No_Serie
            INNER JOIN tblventas v ON dv.id_ventas = v.id_Ventas
            WHERE p.vchNo_Serie = ?
            GROUP BY p.vchNo_Serie`;
        const [rows] = await db.query(sql, [noSerie]);
        return rows[0];
    }
};