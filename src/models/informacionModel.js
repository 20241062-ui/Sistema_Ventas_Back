import db from '../config/BD.js';

export const informacionModel = {
    obtenerTodos: async (busqueda = "") => {
        let sql = "SELECT * FROM tblinformacion";
        let params = [];

        if (busqueda) {
            sql += " WHERE vchtitulo LIKE ? OR intid LIKE ?";
            const filtro = `%${busqueda}%`;
            params = [filtro, filtro];
        }

        sql += " ORDER BY intid ASC";
        const [rows] = await db.query(sql, params);
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM tblinformacion WHERE intid = ?", [id]);
        return rows[0];
    },

    guardar: async (datos) => {
        const { intid, vchtitulo, vchcontenido } = datos;
        
        if (intid) {
            // UPDATE
            const sql = "UPDATE tblinformacion SET vchtitulo = ?, vchcontenido = ? WHERE intid = ?";
            return await db.query(sql, [vchtitulo, vchcontenido, intid]);
        } else {
            // INSERT (Estado por defecto 1)
            const sql = "INSERT INTO tblinformacion (vchtitulo, vchcontenido, Estado) VALUES (?, ?, 1)";
            return await db.query(sql, [vchtitulo, vchcontenido]);
        }
    },

    cambiarEstado: async (id, nuevoEstado) => {
        return await db.query("UPDATE tblinformacion SET Estado = ? WHERE intid = ?", [nuevoEstado, id]);
    }
};