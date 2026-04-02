import db from '../config/BD.js';

const Usuario = {
    buscarPorCorreo: async (id) => {
        const sql = "SELECT intid_Usuario, vchNombre, vchApellidoP, vchApellidoM, vchCorreo, intid_Rol FROM tblusuario WHERE id_Usuario = ?";
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    actualizarPerfil: async (id, datos) => {
        const { nombre, apellidoP, apellidoM, password } = datos;
        let sql, params;

        if (password) {
            sql = "UPDATE tblusuario SET vchnombre = ?, vchapellido = ?, vchpassword = ? WHERE id_usuario = ?";
            params = [nombre, apellidoP, apellidoM, password, id];
        } else {
            sql = "UPDATE tblusuario SET vchnombre = ?, vchapellido = ? WHERE id_usuario = ?";
            params = [nombre, apellidoP, apellidoM, id];
        }

        return await db.query(sql, params);
    }
};

export default Usuario;