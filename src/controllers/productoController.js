import Producto from '../models/productoModel.js';

export const obtenerDashboardProductos = async (req, res) => {
    try {
        const buscar = req.query.buscar || "";
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;

        const result = await Producto.obtenerTodos(buscar, offset, limite);
        
        let productoDestacado = null;
        if (result.productos && result.productos.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * result.productos.length);
            productoDestacado = result.productos[indiceAleatorio];
        }

        res.json({
            hero: productoDestacado,
            productos: result.productos, 
            counts: result.stats,
            pagination: {
                totalPages: Math.ceil(result.totalFiltrados / limite), 
                currentPage: pagina
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Nueva función para Detalle de Producto
export const obtenerDetalleProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.obtenerPorId(id);
        if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const agregarProducto = async (req, res) => {
    try {
        await Producto.crear(req.body);
        res.json({ status: 'success', message: 'Producto agregado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = { nombre: req.user.nombre, rol: req.user.rol }; // Viene del middleware de JWT
        await Producto.actualizar(id, req.body, usuario);
        res.json({ status: 'success', message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const cambiarEstadoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const usuario = { nombre: req.user.nombre, rol: req.user.rol };
        await Producto.cambiarEstado(id, estado, usuario);
        res.json({ status: 'success', message: `Producto ${estado == 1 ? 'activado' : 'desactivado'} correctamente` });
    } catch (error) {
        res.status(500).json({ status: 'error', mensaje: error.message });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await Producto.eliminar(id);
        res.json({ status: 'success', message: 'Producto eliminado físicamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};