import db from '../config/BD.js';

const publicModel = {
    // Políticas
    getPoliticas: async () => {
        const [rows] = await db.query('SELECT vchtitulo, vchcontenido FROM tblpoliticas ORDER BY intid ASC');
        return rows;
    },

    // FAQ
    getFAQ: async () => {
        const [rows] = await db.query(
            'SELECT vchpregunta, vchrespuesta FROM tblpreguntasfrecuentes WHERE estado = 1 ORDER BY intid ASC'
        );
        return rows;
    },

    // Nosotros
    getNosotros: async () => {
        const [rows] = await db.query('SELECT vchseccion as titulo, vchcontenido as contenido FROM tblnosotros ORDER BY intid ASC');
        return rows;
    },

    // Sucursales
    getSucursales: async () => {
        const [rows] = await db.query('SELECT * FROM tblsucursales');
        return rows;
    },

    // Contacto Info
    getContactoInfo: async () => {
        const [rows] = await db.query('SELECT vchcampo, vchvalor FROM tblcontacto_info');
        return rows;
    },

    // Guardar mensaje de contacto
    saveMensaje: async (nombre, correo, mensaje) => {
        const [result] = await db.query(
            'INSERT INTO tblcontacto (vchNombre, vchCorreo, vchMensaje, dtFechaEnvio) VALUES (?, ?, ?, NOW())',
            [nombre, correo, mensaje]
        );
        return result;
    },

    // Marcas (para selects)
    getMarcas: async () => {
        const [rows] = await db.query('SELECT intid_Marca, vchNombre FROM tblmarcas ORDER BY vchNombre ASC');
        return rows;
    },

    // Categorías (para selects)
    getCategorias: async () => {
        const [rows] = await db.query('SELECT intid_Categoria, vchNombre FROM tblcategoria ORDER BY vchNombre ASC');
        return rows;
    }
};

export default publicModel;