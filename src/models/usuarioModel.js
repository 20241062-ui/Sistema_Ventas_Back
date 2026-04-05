import db from '../config/BD.js';

const Usuario = {
    buscarPorCorreo: async (correo) => {
        try {
            const sql = "SELECT id_usuario, vchnombre, vchapellido, vchapellidoM, vchcorreo, vchpassword, vchRol FROM tblusuario WHERE vchcorreo = ?";
            const [rows] = await db.query(sql, [correo]);
            return rows[0];
        } catch (error) {
            console.error("Error en buscarPorCorreo:", error);
            throw error;
        }
    },

    obtenerPorId: async (id) => {
        try {
            const sql = "SELECT id_usuario, vchnombre, vchapellido, vchapellidoM, vchcorreo, vchRol FROM tblusuario WHERE id_usuario = ?";
            const [rows] = await db.query(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error("Error en obtenerPorId:", error);
            throw error;
        }
    },

    actualizarPerfil: async (id, datos) => {
        const { nombre, apellido, password } = datos;
        let sql, params;

        if (password) {
            sql = "UPDATE tblusuario SET vchnombre = ?, vchapellido = ?, vchapellidoM = ?, vchpassword = ? WHERE id_usuario = ?";
            params = [nombre, apellido, password, id];
        } else {
            sql = "UPDATE tblusuario SET vchnombre = ?, vchapellido = ?,vchapellidoM = ?, WHERE id_usuario = ?";
            params = [nombre, apellido, id];
        }

        try {
            const [result] = await db.query(sql, params);
            return result;
        } catch (error) {
            console.error("Error en actualizarPerfil:", error);
            throw error;
        }
    }
};

export default Usuario;