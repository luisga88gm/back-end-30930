const express =require('express');
const router = express.Router();
const {Contenedor, getProducts} = require('../controllers/productos');
const session= require('express-session');
const {logger} = require('../services/logger');
const {validarLogin}=require('../controllers/auth');


const init = async () =>{
listaProductos=await Contenedor//.productos
}

init()
// const validarLogin=(req, res, next)=>{
    // if (req.isAuthenticated()){
        // user=req.session.user;
        // next()
    // }else{
        // res.render('login')
    // }
// };

// const mwProductos = async (req,resp, next)=>{
    // try{
        // const prodDB= await Contenedor.init();
        // let prods = await Contenedor.getAll();
        // listaProductos= new Contenedor(prods);
        // logger.error(`Error de prueba productos `)
        // next()
    // }
    // catch(err){
        // logger.error(`Error al recuperar los productos - ${err}`)
        // resp.json({msg: err})
    // }
// }

router.get('/', validarLogin, getProducts, (request, response)=>{
    const productos={
        user: request.user.email,
        productos: listaProductos.productos
    }    
    response.render('productos', productos)
});

router.post('/', (request, response)=>{
    const body= request.body;
    const item= {
        nombre: body.nombre,
        precio: parseFloat(body.precio),
        thumbnail: body.thumbnail,
    }
    const cargaOK= Contenedor.validaItem(item)//Contenedor.validaItem(item);
    if (cargaOK){
        Contenedor.save(item);
        response.status(200).json({msg: 'Producto agregado ok'})
    }else{
        response.status(400).json({error : 'Debe completar datos'})
    }
});


router.get('/:id', async (request, response)=>{
    const id = (request.params.id);
    let producto= await Contenedor.getById(id);
    if (producto.length){
        response.json(producto)
    }else{
        response.status(404).json({
            error : 'producto no encontrado' 
        })
    }
})

router.delete('/:id', async(request, response)=>{
    const id = request.params.id;
    const prods=await Contenedor.deleteById(id);
    if (prods!=null){
        response.json(prods)
    }else{
        response.status(404).json({error : 'producto no encontrado'})
    }
});

router.put('/:id', async (request, response)=>{
    const id = request.params.id;
    const itemNewData= request.query;
    let producto= await Contenedor.getById(id);
    if (producto.length){
        Contenedor.updateItem(id, itemNewData);
        producto= await Contenedor.getById(id);
        response.json(producto);
    }else{
        response.status(404).json({error : 'producto no encontrado'});
    }
});

module.exports = router;

