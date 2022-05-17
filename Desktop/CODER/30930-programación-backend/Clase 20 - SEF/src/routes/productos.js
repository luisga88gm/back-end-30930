const express =require('express');
const router = express.Router();
const { Producto , verifBodyProducto } = require('../controllers/productosMongo');
const { generaId } = require('../controllers/varios');

const administrador=true;


const validaPerfil=(req, resp, next)=>{
    if (administrador){
        next()
    }else{
        resp.status(401).json({
            error: 'No tiene permisos para acceder al recurso'
        })
    }
}

router.get('/', async (request, response)=>{
    const productos= await Producto.getAll();
    response.json(productos)
});

router.get('/:id', async (request, response)=>{
    const id = request.params.id;
    const producto= await Producto.getById(id)
    if (producto!=null){
        response.json(producto)
    }else{
        response.status(404).json({
            error : 'producto no encontrado' 
        })
    }
});

router.post('/', validaPerfil, verifBodyProducto, async (request, response)=>{
    const idAsignado= generaId();
    const body= request.body;
    const item= {
        id: idAsignado,
        timestamp: Date.now(),
        nombre: body.nombre,
        descripcion: body.descripcion,
        codigo: idAsignado,
        foto: body.foto,
        precio: body.precio,
        stock: body.stock
    }
    Producto.save(item);
    response.json({msg: 'Se dio de alta el producto',
    producto: item});
});

router.delete('/:id', validaPerfil, async (request, response)=>{
    const id = request.params.id;
    let producto= await Producto.getById(id);
    if (producto!=null) {
        const prods=await Producto.deleteById(id);
        response.json({
            msg: 'Producto Eliminado!',
            productos: prods
        })
    }else{
        response.status(404).json({error : 'producto no encontrado!'})
    }
}); 

router.put('/:id', validaPerfil, async (request, response)=>{
    const id = request.params.id;
    body = request.body;
    const itemNewData= body
    let producto= await Producto.getById(id);
    if (producto != null){
        Object.assign(producto, itemNewData);
        Producto.updateItem(producto);
        response.json(producto);
    }else{
        response.status(404).json({error : 'producto no encontrado!'});
    }
}); 

module.exports = router;