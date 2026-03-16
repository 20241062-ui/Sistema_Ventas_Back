import publicModel from '../models/publicModel.js';

export const obtenerPoliticas = async (req, res) => {
    try {
        const datos = await publicModel.getPoliticas();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos del servidor.' });
    }
};

export const obtenerFAQ = async (req, res) => {
    try {
        const datos = await publicModel.getFAQ();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las preguntas frecuentes.' });
    }
};

export const obtenerNosotros = async (req, res) => {
    try {
        const datos = await publicModel.getNosotros();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos de la empresa.' });
    }
};

export const obtenerSucursales = async (req, res) => {
    try {
        const rows = await publicModel.getSucursales();
        
        // La lógica de transformación sigue en el controlador (es lógica de negocio/presentación)
        const sucursales = rows.map(s => ({
            ...s,
            vchlink_mapa: s.vchlink_mapa.replace('/viewer?', '/embed?')
        }));

        res.json(sucursales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la ubicación de las sucursales.' });
    }
};

export const obtenerContactoInfo = async (req, res) => {
    try {
        const rows = await publicModel.getContactoInfo();
        const info = {};
        rows.forEach(row => {
            info[row.vchcampo.toLowerCase()] = row.vchvalor;
        });
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener información de contacto.' });
    }
};

export const enviarMensajeContacto = async (req, res) => {
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    try {
        await publicModel.saveMensaje(nombre, correo, mensaje);
        res.json({ success: true, message: '¡Gracias! Tu mensaje ha sido enviado con éxito.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Hubo un error al enviar tu mensaje.' });
    }
};

export const obtenerMarcas = async (req, res) => {
    try {
        const datos = await publicModel.getMarcas();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener marcas" });
    }
};

export const obtenerCategorias = async (req, res) => {
    try {
        const datos = await publicModel.getCategorias();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener categorías" });
    }
};