const express =require('express');
const router = express.Router();
const routerProductos = require('./productos');
const routerProductosTest = require('./productos-test');
// const routerLogin = require('./')
const path = require('path');
const fs = require('fs/promises');
const session= require('express-session');
const util=require('util');

const file='../../public/productos.txt';
const fileVacio='../../public/productos_vacio.txt';
const fileTest='../../public/productos_test.txt';

const ruta= path.resolve(__dirname, file);
const Contenedor = require('../utils/contenedor');
const { post } = require('./productos');
const { appendFile } = require('fs');


let listaProductos;
let user;

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
};

const validarLogin=(req, res, next)=>{
    if (req.session.loggedIn===true){
        user=req.session.user;
        next()
    }else{
        res.render('login')
    }
};

router.post('/login', (req, res)=>{
    user = req.body.nombre;
    if (user){
        req.session.loggedIn=true;
        req.session.user=user;
        res.redirect('back')
    }else{
        res.status(400).json({error: 'Debe ingresar un usuario!'})
    }
})

router.post('/logout', (req, res)=>{
    // let user= req.session.user
    req.session.destroy();
    res.render('logout', {user: user})
})

router.get('/', validarLogin, mwProductos, (request, response)=>{
    const productos={
        user: user,
        productos: listaProductos.productos
    }
    response.render('altaProducto', productos)
})

router.use('/productos', routerProductos);

router.use('/productos-test', routerProductosTest);

module.exports = router;