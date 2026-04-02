import Usuario from '../models/usuarioModel.js';
import { clienteModel as Cliente } from '../models/clienteModel.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const login = async (req, res) => {
    const { user, password } = req.body; 

    try {
        let persona = await Usuario.buscarPorCorreo(user);
        let tipoUsuario = 'Staff';

        if (!persona) {
            persona = await Cliente.buscarPorCorreo(user);
            if (persona) {
                tipoUsuario = 'Cliente';
                persona.vchRol = 'Cliente'; 
            }
        }

        if (!persona) {
            return res.status(404).json({ 
                status: 'error',
                message: 'No se encontró ninguna cuenta vinculada a este correo.' 
            });
        }

        const hashAlmacenado = persona.vchpassword || persona.vchPassword;
        let passwordCorrecta = false;

        if (!hashAlmacenado) {
            return res.status(500).json({ message: "Error en la estructura de datos de seguridad." });
        }

        if (hashAlmacenado.startsWith('$2')) {
            passwordCorrecta = await bcrypt.compare(password, hashAlmacenado);
        } else {
            passwordCorrecta = (password === hashAlmacenado);
        }

        if (!passwordCorrecta) {
            return res.status(401).json({ 
                status: 'error',
                message: 'La contraseña ingresada es incorrecta.' 
            });
        }

        if (persona.Estado === 0 || persona.intEstado === 0) {
            return res.status(403).json({ 
                status: 'error',
                message: 'Esta cuenta se encuentra desactivada. Contacte al administrador.' 
            });
        }

        const token = jwt.sign(
            { 
                id: persona.id_usuario || persona.intid_Cliente, 
                nombre: persona.vchNombre, 
                rol: persona.vchRol 
            },
            SECRET_KEY,
            { expiresIn: '24h' } 
        );

        res.json({
            status: 'success',
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: persona.id_usuario || persona.intid_Cliente,
                nombre: persona.vchNombre,
                rol: persona.vchRol,
                tipo: tipoUsuario
            }
        });

    } catch (error) {
        console.error("Error crítico en el proceso de login:", error);
        res.status(500).json({ 
            status: 'error',
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};
export const registrar = async (req, res) => {
    const { nombre, paterno, materno, correo, password } = req.body;

    try {
        const existeU = await Usuario.buscarPorCorreo(correo);
        const existeC = await Cliente.buscarPorCorreo(correo);

        if (existeU || existeC) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHasheada = await bcrypt.hash(password, salt);

        await Cliente.crear({
            vchNombre: nombre,
            vchApellido_Paterno: paterno,
            vchApellido_Materno: materno,
            vchCorreo: correo,
            vchpassword: passwordHasheada
        });

        res.status(201).json({ status: "success", message: "Usuario registrado correctamente." });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error al registrar", error: error.message });
    }
};