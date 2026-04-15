import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET;

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token requerido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Sesión inválida o expirada.' });
    }
};

export const verificarAdmin = (req, res, next) => {
    verificarToken(req, res, () => {
        const rolesPermitidos = [
            'Administrador', 'Vendedor', 'Encargado', 
            'Auxiliar', 'DBA', 'Programador', 
            'Auditor', 'Soporte Técnico'
        ];

        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ message: 'Acceso denegado: Requiere permisos de personal autorizado.' });
        }
        
        next(); 
    });
};