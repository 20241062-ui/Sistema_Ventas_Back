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
    const { id } = req.params;
    const { intid_Marca, intid_Categoria, vchNombre, vchDescripcion, floPrecioUnitario, intStock, floPrecioCompra } = req.body;
    const { nombre, rol } = req.user; // Del Token

    try {
        // 1. Actualizar datos generales
        await db.query(
            `UPDATE tblproductos SET intid_Marca=?, intid_Categoria=?, vchNombre=?, vchDescripcion=?, intStock=?, floPrecioCompra=? WHERE vchNo_Serie=?`,
            [intid_Marca, intid_Categoria, vchNombre, vchDescripcion, intStock, floPrecioCompra, id]
        );

        // 2. Llamar al procedimiento de precio (como hacías en PHP)
        await db.query("CALL sp_actualizar_precio(?, ?, ?, ?)", [id, floPrecioUnitario, nombre, rol]);

        res.json({ mensaje: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const cambiarEstadoProducto = async (req, res) => {
    const { id } = req.params; 
    const { estado } = req.body; 
    const { nombre, rol } = req.user; 

    try {
        await db.query("SET @usuario_sistema = ?, @rol_usuario = ?", [nombre, rol]);

        const [result] = await db.query(
            "UPDATE tblproductos SET Estado = ? WHERE vchNo_Serie = ?",
            [estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({ 
            status: "success", 
            mensaje: estado === 0 ? "Producto desactivado correctamente." : "Producto activado correctamente." 
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el estado" });
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