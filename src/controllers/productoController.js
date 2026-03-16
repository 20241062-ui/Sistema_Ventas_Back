import Producto from '../models/productoModel.js';

export const obtenerDashboardProductos = async (req, res) => {
    try {
        const buscar = req.query.buscar || "";
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;

        /** * LÓGICA DE FILTRO: 
         * Si req.user existe (pasó por verificarAdmin), mostramos todos.
         * Si no existe req.user, es la parte pública: solo mostramos activos.
         */
        const esAdmin = req.user ? true : false;

        const result = await Producto.obtenerTodos(buscar, offset, limite, esAdmin);
        
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
        await Producto.eliminar(id);
        res.json({ status: 'success', message: 'Producto eliminado físicamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};