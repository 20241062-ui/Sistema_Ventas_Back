import db from '../config/BD.js';
import bcrypt from 'bcryptjs';

export const usuarioModel = {
    obtenerTodos: async (busqueda = "") => {
        let sql = "SELECT id_usuario, vchnombre, vchapellido, vchcorreo, vchRol, Estado FROM tblusuario";
        let params = [];

        if (busqueda) {
            sql += " WHERE vchnombre LIKE ? OR vchapellido LIKE ? OR vchcorreo LIKE ? OR vchRol LIKE ?";
            const filtro = `%${busqueda}%`;
            params = [filtro, filtro, filtro, filtro];
        }

        sql += " ORDER BY id_usuario ASC";
        const [rows] = await db.query(sql, params);
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT id_usuario, vchnombre, vchapellido, vchcorreo, vchRol, vchpassword, Estado FROM tblusuario WHERE id_usuario = ?", [id]);
        return rows[0];
    },

    guardar: async (datos) => {
        const { id_usuario, vchnombre, vchapellido, vchcorreo, vchRol, vchpassword } = datos;

        if (id_usuario) {
            let sql = "UPDATE tblusuario SET vchnombre=?, vchapellido=?, vchcorreo=?, vchRol=?";
            let params = [vchnombre, vchapellido, vchcorreo, vchRol];

            if (vchpassword && vchpassword.trim() !== "") {
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(vchpassword, salt);
                sql += ", vchpassword=? ";
                params.push(hashedPass);
            }

            sql += " WHERE id_usuario=?";
            params.push(id_usuario);
            return await db.query(sql, params);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(vchpassword, salt);
            const sql = "INSERT INTO tblusuario (vchnombre, vchapellido, vchcorreo, vchRol, vchpassword, Estado) VALUES (?, ?, ?, ?, ?, 1)";
            return await db.query(sql, [vchnombre, vchapellido, vchcorreo, vchRol, hashedPass]);
        }
    },

    cambiarEstado: async (id, estado) => {
        return await db.query("UPDATE tblusuario SET Estado = ? WHERE id_usuario = ?", [estado, id]);
    },

    eliminarPermanente: async (id) => {
        return await db.query("DELETE FROM tblusuario WHERE id_usuario = ?", [id]);
    }
};