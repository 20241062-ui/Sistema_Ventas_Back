import db from '../config/BD.js';

export const faqModel = {
    obtenerTodas: async (busqueda = "") => {
        let sql = "SELECT * FROM tblpreguntasfrecuentes";
        let params = [];

        if (busqueda) {
            sql += " WHERE vchpregunta LIKE ? OR intid LIKE ?";
            const filtro = `%${busqueda}%`;
            params = [filtro, filtro];
        }

        sql += " ORDER BY intid ASC";
        const [rows] = await db.query(sql, params);
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM tblpreguntasfrecuentes WHERE intid = ?", [id]);
        return rows[0];
    },

    guardar: async (datos) => {
        const { intid, vchpregunta, vchrespuesta } = datos;
        
        if (intid) {
            const sql = "UPDATE tblpreguntasfrecuentes SET vchpregunta = ?, vchrespuesta = ?, fecha = NOW() WHERE intid = ?";
            return await db.query(sql, [vchpregunta, vchrespuesta, intid]);
        } else {
            const sql = "INSERT INTO tblpreguntasfrecuentes (vchpregunta, vchrespuesta, estado, fecha) VALUES (?, ?, 1, NOW())";
            return await db.query(sql, [vchpregunta, vchrespuesta]);
        }
    },

    cambiarEstado: async (id, nuevoEstado) => {
        return await db.query("UPDATE tblpreguntasfrecuentes SET estado = ?, fecha = NOW() WHERE intid = ?", [nuevoEstado, id]);
    }
};