import db from '../config/BD.js';

const publicModel = {
    getPoliticas: async () => {
        const [rows] = await db.query('SELECT vchtitulo, vchcontenido FROM tblpoliticas ORDER BY intid ASC');
        return rows;
    },

    getFAQ: async () => {
        const [rows] = await db.query(
            'SELECT vchpregunta, vchrespuesta FROM tblpreguntasfrecuentes WHERE estado = 1 ORDER BY intid ASC'
        );
        return rows;
    },

    getContactoInfo: async () => {
        const [rows] = await db.query('SELECT vchcampo, vchvalor FROM tblcontacto_info');
        return rows;
    },

    saveMensaje: async (nombre, correo, mensaje) => {
        const [result] = await db.query(
            'INSERT INTO tblcontacto (vchNombre, vchCorreo, vchMensaje, dtFechaEnvio) VALUES (?, ?, ?, NOW())',
            [nombre, correo, mensaje]
        );
        return result;
    },

    getMarcas: async () => {
        const [rows] = await db.query('SELECT intid_Marca, vchNombre FROM tblmarcas ORDER BY vchNombre ASC');
        return rows;
    },

    getCategorias: async () => {
        const [rows] = await db.query('SELECT intid_Categoria, vchNombre FROM tblcategoria ORDER BY vchNombre ASC');
        return rows;
    }
};

export default publicModel;