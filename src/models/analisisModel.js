import db from '../config/BD.js';

export const analisisModel = {
    obtenerDatosSimulacion: async (noSerie) => {
        const sql = "SELECT vchNombre, intStock FROM tblproductos WHERE vchNo_Serie = ?";
        const [rows] = await db.query(sql, [noSerie]);
        return rows[0];
    }
};