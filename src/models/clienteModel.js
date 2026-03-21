import db from '../config/BD.js';

export const clienteModel = {
    obtenerTodos: async (busqueda = "") => {
        let sql = "SELECT intid_Cliente, vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo, Estado FROM tblcliente";
        let params = [];

        if (busqueda) {
            sql += " WHERE vchNombre LIKE ? OR vchApellido_Paterno LIKE ? OR vchCorreo LIKE ?";
            const filtro = `%${busqueda}%`;
            params = [filtro, filtro, filtro];
        }

        sql += " ORDER BY intid_Cliente ASC";
        const [rows] = await db.query(sql, params);
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM tblcliente WHERE intid_Cliente = ?", [id]);
        return rows[0];
    },

    actualizar: async (id, datos) => {
        const { vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo, Estado } = datos;
        const sql = `UPDATE tblcliente SET 
            vchNombre=?, vchApellido_Paterno=?, vchApellido_Materno=?, vchCorreo=?, Estado=? 
            WHERE intid_Cliente=?`;
        return await db.query(sql, [vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo, Estado, id]);
    },

    cambiarEstado: async (id, estado) => {
        return await db.query("UPDATE tblcliente SET Estado = ? WHERE intid_Cliente = ?", [estado, id]);
    }
};