import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const verificarAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // 1. Validar formato estándar: "Bearer TOKEN"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token con formato inválido o requerido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token con la clave secreta
        const decoded = jwt.verify(token, SECRET_KEY);

        // 3. Validar el ROL (Fundamental para el panel administrativo)
        if (decoded.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
        }

        // 4. Inyectar los datos en el request
        // IMPORTANTE: Usamos req.user (o req.usuario) para que el controlador 
        // pueda enviar el nombre y rol a los Triggers de la DB.
        req.user = decoded; 
        
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};