import { userModel } from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const obtenerDatosPerfil = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.obtenerPorId(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { vchPassword, ...datosPublicos } = user;
        res.json(datosPublicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarDatosPerfil = async (req, res) => {
    const { vchNombre, vchApellido_Paterno, vchApellido_Materno, vchTelefono, vchpassword } = req.body;
    const userId = req.user.id;

    try {
        const userActual = await userModel.obtenerPorId(userId);
        if (!userActual) return res.status(404).json({ message: "Usuario no encontrado" });

        let passwordFinal = userActual.vchPassword;

        if (vchpassword && vchpassword.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            passwordFinal = await bcrypt.hash(vchpassword, salt);
        }

        await userModel.actualizar(userId, {
            vchNombre,
            vchApellido_Paterno,
            vchApellido_Materno,
            vchTelefono,
            passwordHash: passwordFinal
        });

        res.json({ success: true, message: 'Perfil actualizado correctamente.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};