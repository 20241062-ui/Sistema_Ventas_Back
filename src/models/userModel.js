import db from '../config/BD.js';

export const userModel = {
    obtenerPorId: async (id) => {
        const [rows] = await db.query(
            'SELECT vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo, vchPassword FROM tblcliente WHERE intid_Cliente = ?', 
            [id]
        );
        return rows[0];
    },

    actualizar: async (id, datos) => {
        const { vchNombre, vchApellido_Paterno, vchApellido_Materno, vchTelefono, passwordHash } = datos;
        const sql = `UPDATE tblcliente SET 
            vchNombre = ?, 
            vchApellido_Paterno = ?, 
            vchApellido_Materno = ?, 
            vchTelefono = ?, 
            vchPassword = ? 
            WHERE intid_Cliente = ?`;
        
        return await db.query(sql, [
            vchNombre, 
            vchApellido_Paterno, 
            vchApellido_Materno, 
            vchTelefono || null, 
            passwordHash, 
            id
        ]);
    }
};