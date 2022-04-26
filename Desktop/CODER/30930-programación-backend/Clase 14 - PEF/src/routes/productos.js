const express =require('express');
const router = express.Router();
const path = require('path');
const { Producto } = require('../controllers/productosCtrl');
const { generaId } = require('../controllers/varios');

const administrador=true;

const file='../../public/productos.txt';
const fileTest='../../public/productos_test.txt';
const ruta= path.resolve(__dirname, file);

let productos

const validaPerfil=(req, resp, next)=>{
    if (administrador){
        next()
    }else{
        resp.status(401).json({
            error: 'Ud. no tiene permisos para acceder al recurso'
        })
    }
}

const mwProductos = async (req,resp, next)=>{
    try{
        let prods = await Producto.getAll(ruta);
        let prodsJson = JSON.parse(prods);
        productos= new Producto(prodsJson);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos!', err)
        resp.json({msg: err})
    }
}

router.get('/', mwProductos, (request, response)=>{
    response.json(productos)
});

router.get('/:id', mwProductos, (request, response)=>{
    const id = request.params.id;
    let producto
    if (id=='random'){
        producto= productos.getRandom()
    }else{
        producto=productos.getById(id)
    }
    if (producto!=null){
        response.json(producto)
    }else{
        response.status(404).json({
            error : 'Producto no encontrado!' 
        })
    }
});

router.post('/', validaPerfil, mwProductos, (request, response)=>{
    const idAsignado= generaId();
    const body= request.body;
    let nombre='';
    let descripcion='';
    let foto = '';
    let precio=0;
    let stock=0;
    nombre = body.nombre;
    if (body.descripcion!=null){descripcion=body.descripcion};
    if (body.foto!=null){foto = body.foto};
    if (body.precio!=null){precio = parseFloat(body.precio)};
    if (body.stock!=null) {stock = parseInt (body.stock)};
    if (nombre!=null){
        const item= {
            id: idAsignado,
            timestamp: Date.now(),
            nombre: nombre,
            descripcion: descripcion,
            codigo: idAsignado,
            foto: foto,
            precio: precio,
            stock: stock
        }
        productos.save(item);
        response.json(item);
    }else{
        response.status(400).json({
            error: "Debe definir al menos un nombre para el producto"
        })
    }
});

router.delete('/:id', validaPerfil, mwProductos, async(request, response)=>{
    const id = request.params.id;
    const prods=await productos.deleteById(id);
    if (prods!=null){
        response.json(prods)
    }else{
        response.status(404).json({error : 'Producto no encontrado!'})
    }
}); 

router.put('/:id', validaPerfil, mwProductos, (request, response)=>{
    const id = request.params.id;
    body = request.body;
    const itemNewData= body
    let producto=productos.getById(id);
    if (producto != null){
        Object.assign(producto, itemNewData);
        productos.updateItem(producto);
        response.json(producto);
    }else{
        response.status(404).json({error : 'Producto no encontrado!'});
    }
}); 

module.exports = router;