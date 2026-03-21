import db from '../config/BD.js';

export const sucursalModel = {
    obtenerTodas: async () => {
        const [rows] = await db.query("SELECT * FROM tblsucursales WHERE intEstado = 1 ORDER BY vchnombre ASC");
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM tblsucursales WHERE intid = ?", [id]);
        return rows[0];
    },

    crear: async (datos) => {
        const { nombre, direccion, ciudad, telefono, horario, linkmapa } = datos;
        const sql = `INSERT INTO tblsucursales 
            (vchnombre, vchdireccion, vchciudad, vchtelefono, vchhorario, vchlink_mapa, intEstado) 
            VALUES (?, ?, ?, ?, ?, ?, 1)`;
        return await db.query(sql, [nombre, direccion, ciudad, telefono, horario, linkmapa]);
    },

    actualizar: async (id, datos) => {
        const { nombre, direccion, ciudad, telefono, horario, linkmapa } = datos;
        const sql = `UPDATE tblsucursales SET 
            vchnombre=?, vchdireccion=?, vchciudad=?, vchtelefono=?, vchhorario=?, vchlink_mapa=? 
            WHERE intid=?`;
        return await db.query(sql, [nombre, direccion, ciudad, telefono, horario, linkmapa, id]);
    },

    eliminarLogico: async (id) => {
        return await db.query("UPDATE tblsucursales SET intEstado = 0 WHERE intid = ?", [id]);
    }
};