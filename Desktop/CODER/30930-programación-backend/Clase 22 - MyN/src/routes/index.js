const express =require('express');
const router = express.Router();
const routerProductos = require('./productos');
const routerProductosTest = require('./productos-test');
const path = require('path');
const fs = require('fs/promises');

const file='../../public/productos.txt';
const fileVacio='../../public/productos_vacio.txt';
const fileTest='../../public/productos_test.txt';

const ruta= path.resolve(__dirname, file);
const Contenedor = require('../utils/contenedor');


let listaProductos;

const mwProductos = async (req,resp, next)=>{
    try{
        const prodDB= await Contenedor.init();
        let prods = await Contenedor.getAll();
        listaProductos= new Contenedor(prods);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos!', err)
        resp.json({msg: err})
    }
}

router.get('/', mwProductos, (request, response)=>{
    response.render('altaProducto', listaProductos)
})

router.use('/productos', routerProductos);

router.use('/productos-test', routerProductosTest);

module.exports =router;