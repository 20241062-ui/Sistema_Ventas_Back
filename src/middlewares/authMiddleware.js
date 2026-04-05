import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const verificarAdmin = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token con formato inválido o requerido.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        
        if (decoded.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
        }
        
        req.user = decoded; 
        
        console.log(`Middleware: Usuario ${decoded.id} verificado con éxito.`);
        
        next(); 
    } catch (error) {
        console.error("Error al verificar token:", error.message);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};