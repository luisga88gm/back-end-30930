const express =require('express');
const router = express.Router();
const Contenedor = require('../utils/contenedor');


const validaItem= (item)=>{
    let itemOK
    if (item.nombre==''||item.precio==''){
        itemOK=false
    }else{
        itemOK=true
    }
    return itemOK
}

let productos



const mwProductos = async (req,resp, next)=>{
    try{
        const prodDB= await Contenedor.init();
        let prods = await Contenedor.getAll();
        productos= new Contenedor(prods);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
        resp.json({msg: err})
    }
}

router.get('/', mwProductos, (request, response)=>{
        response.render('productos', productos)
});

router.post('/',mwProductos, (request, response)=>{
    // const idAsignado= productos.generaId();
    const body= request.body;
    const item= {
        nombre: body.nombre,
        precio: parseFloat(body.precio),
        thumbnail: body.thumbnail,
        // id: idAsignado
    }
    const cargaOK= validaItem(item);
    if (cargaOK){
        productos.save(item);
        response.status(200).json({msg: 'Porducto agregado ok'})
        // response.redirect('/')
    }else{
        response.status(400).json({error : 'Debe completar datos'})
    }
});


router.get('/:id', mwProductos, async (request, response)=>{
    const id = (request.params.id);
    let producto= await productos.getById(id);
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
    const prods=await productos.deleteById(id);
    if (prods!=null){
        response.json(prods)
    }else{
        response.status(404).json({error : 'producto no encontrado!'})
    }
});

router.put('/:id', mwProductos, async (request, response)=>{
    const id = request.params.id;
    const itemNewData= request.query;
    let producto= await productos.getById(id);
    if (producto.length){
        productos.updateItem(id, itemNewData);
        producto= await productos.getById(id);
        response.json(producto);
    }else{
        response.status(404).json({error : 'producto no encontrado!'});
    }
});

module.exports = router;