import Usuario from '../models/usuarioModel.js';

export const obtenerPerfil = async (req, res) => {
    try {
        const id = req.user.id;
        const usuario = await Usuario.obtenerPorId(id);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({
            vchNombre: usuario.vchnombre,
            vchApellidoP: usuario.vchapellido,
            vchApellidoM: usuario.vchApellidoM,
            vchCorreo: usuario.vchcorreo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const id = req.user.id;
        const { vchnombre, vchapellidoP, vchapellidoM, vchpassword } = req.body;

        await Usuario.actualizarPerfil(id, {
            nombre: vchnombre,
            apellido: vchapellidoP,
            apellidoM: vchapellidoM,
            password: vchpassword || null
        });

        res.json({ status: "success", mensaje: "Perfil actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};