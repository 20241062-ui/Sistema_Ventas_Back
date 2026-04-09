import db from '../config/BD.js';

export const contactoModel = {
    obtenerTodos: async (busqueda = "") => {
        let sql = "SELECT * FROM tblcontacto_info";
        let params = [];

        if (busqueda) {
            sql += " WHERE intid LIKE ? OR vchcampo LIKE ? OR vchvalor LIKE ?";
            const filtro = `%${busqueda}%`;
            params = [filtro, filtro, filtro];
        }

        sql += " ORDER BY intid ASC";
        const [rows] = await db.query(sql, params);
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM tblcontacto_info WHERE intid = ?", [id]);
        return rows[0];
    },

    guardar: async (datos) => {
        const { intid, vchcampo, vchvalor } = datos;
        
        if (intid) {
            const sql = "UPDATE tblcontacto_info SET vchcampo = ?, vchvalor = ? WHERE intid = ?";
            return await db.query(sql, [vchcampo, vchvalor, intid]);
        } else {
            const sql = "INSERT INTO tblcontacto_info (vchcampo, vchvalor) VALUES (?, ?)";
            return await db.query(sql, [vchcampo, vchvalor]);
        }
    },

    eliminar: async (id) => {
        return await db.query("DELETE FROM tblcontacto_info WHERE intid = ?", [id]);
    }
};