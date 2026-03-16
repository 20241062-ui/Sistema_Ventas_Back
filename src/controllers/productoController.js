import Producto from '../models/productoModel.js';

export const obtenerDashboardProductos = async (req, res) => {
    try {
        const buscar = req.query.buscar || "";
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 12; // Cantidad para la galería
        const offset = (pagina - 1) * limite;

        // 1. Llamamos al modelo (esAdmin = false para ver solo activos)
        const result = await Producto.obtenerTodos(buscar, offset, limite, false);

        // 2. Lógica para el HERO (Elegir uno al azar de los resultados)
        let productoDestacado = null;
        if (result.productos && result.productos.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * result.productos.length);
            productoDestacado = result.productos[indiceAleatorio];
        }

        // 3. RESPUESTA COMPATIBLE CON HOME.JS
        res.json({
            hero: productoDestacado, // Esto es lo que le falta a tu front
            productos: result.productos, 
            counts: result.stats,
            pagination: {
                totalPages: Math.ceil(result.totalFiltrados / limite) || 1, 
                currentPage: pagina
            }
        });
    } catch (error) {
        console.error("ERROR CRÍTICO:", error);
        // CAMBIA ESTO PARA DIAGNOSTICAR:
        res.status(500).json({ 
            mensaje: "Error en el servidor", 
            sqlError: error.message, // <--- Esto te dirá exactamente qué columna falta
            pila: error.stack 
        });
    }
};

// 2. OBTENER DETALLE (La que faltaba y causaba el error)
export const obtenerDetalleProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.obtenerPorId(id);
        
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// 3. Agregar Producto
export const agregarProducto = async (req, res) => {
    try {
        await Producto.crear(req.body);
        res.json({ status: 'success', message: 'Producto agregado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// 4. Actualizar Producto
export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    // req.user viene del middleware verificarAdmin
    const usuario = { nombre: req.user.nombre, rol: req.user.rol }; 

    try {
        await Producto.actualizar(id, req.body, usuario);
        res.json({ mensaje: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// 5. Cambiar Estado (Alta/Baja)
export const cambiarEstadoProducto = async (req, res) => {
    const { id } = req.params; 
    const { estado } = req.body; 
    const usuario = { nombre: req.user.nombre, rol: req.user.rol };

    try {
        await Producto.cambiarEstado(id, estado, usuario);
        res.json({ 
            status: "success", 
            mensaje: estado === 0 ? "Producto desactivado correctamente." : "Producto activado correctamente." 
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el estado" });
    }
};

// 6. Eliminar (Físico)
export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = { nombre: req.user.nombre, rol: req.user.rol };

        // En lugar de Producto.eliminar (que hace DELETE), usamos cambiarEstado a 0
        await Producto.cambiarEstado(id, 0, usuario);
        
        res.json({ 
            status: 'success', 
            message: 'Producto dado de baja correctamente (Estado inactivo)' 
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al procesar la baja" });
    }
};