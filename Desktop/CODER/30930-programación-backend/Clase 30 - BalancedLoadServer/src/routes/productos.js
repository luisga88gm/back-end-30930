const express =require('express');
const router = express.Router();
const Contenedor = require('../utils/contenedor');
const session= require('express-session');


const validaItem= (item)=>{
    let itemOK
    if (item.nombre==''||item.precio==''){
        itemOK=false
    }else{
        itemOK=true
    }
    return itemOK
}

let listaProductos

const validarLogin=(req, res, next)=>{
    if (req.isAuthenticated()){
        user=req.session.user;
        next()
    }else{
        res.render('login')
    }
};

const mwProductos = async (req,resp, next)=>{
    try{
        const prodDB= await Contenedor.init();
        let prods = await Contenedor.getAll();
        listaProductos= new Contenedor(prods);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
        resp.json({msg: err})
    }
}

router.get('/', validarLogin, mwProductos, (request, response)=>{
    const productos={
        user: request.user.email,
        productos: listaProductos.productos
    }    
    response.render('productos', productos)
});

router.post('/',mwProductos, (request, response)=>{
    const body= request.body;
    const item= {
        nombre: body.nombre,
        precio: parseFloat(body.precio),
        thumbnail: body.thumbnail,
    }
    const cargaOK= validaItem(item);
    if (cargaOK){
        listaProductos.save(item);
        response.status(200).json({msg: 'Producto agregado ok'})
    }else{
        response.status(400).json({error : 'Debe completar datos'})
    }
});


router.get('/:id', mwProductos, async (request, response)=>{
    const id = (request.params.id);
    let producto= await listaProductos.getById(id);
    if (producto.length){
        response.json(producto)
    }else{
        response.status(404).json({
            error : 'producto no encontrado!' 
        })
    }
})

router.delete('/:id', mwProductos, async(request, response)=>{
    const id = request.params.id;
    const prods=await listaProductos.deleteById(id);
    if (prods!=null){
        response.json(prods)
    }else{
        response.status(404).json({error : 'producto no encontrado!'})
    }
});

router.put('/:id', mwProductos, async (request, response)=>{
    const id = request.params.id;
    const itemNewData= request.query;
    let producto= await listaProductos.getById(id);
    if (producto.length){
        listaProductos.updateItem(id, itemNewData);
        producto= await listaProductos.getById(id);
        response.json(producto);
    }else{
        response.status(404).json({error : 'producto no encontrado!'});
    }
});

module.exports = router;