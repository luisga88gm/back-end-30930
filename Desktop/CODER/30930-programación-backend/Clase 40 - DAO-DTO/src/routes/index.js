const passport = require('passport');
const express = require('express');
const router = express.Router();

//Routers
const routerProductos = require('./productos');
// const routerProductosTest = require('./productos-test');
const routerInfo = require('./info');
const routerRandoms = require('./randoms'); 
const routerAuth = require('./auth');

const path = require('path');
const fs = require('fs/promises');
const session= require('express-session');
const util=require('util');

const file='../../public/productos.txt';
const fileVacio='../../public/productos_vacio.txt';
const fileTest='../../public/productos_test.txt';

const ruta= path.resolve(__dirname, file);
const {Contenedor, getProducts} = require('../controllers/productos');
const { post } = require('./productos');
const { appendFile } = require('fs');

const {logger, loggeoPeticiones} = require('../services/logger');
const { validarLogin } = require('../controllers/auth');



router.get('/', loggeoPeticiones, validarLogin, getProducts, (request, response)=>{
    const productos={
        user: request.user.email,
        productos: listaProductos.productos
    }
    response.render('altaProducto', productos)
})

router.use('/info', loggeoPeticiones, routerInfo);

router.use('/randoms', loggeoPeticiones, routerRandoms);

router.use('/productos', loggeoPeticiones, routerProductos);

router.use('/auth', loggeoPeticiones, routerAuth);

// router.use('/productos-test', loggeoPeticiones, routerProductosTest);

router.use(function(req, res, next) {
    const msg404= 'Ruta no definida'
    logger.warn(`${msg404} - Se intento acceder a la ruta ${req.url} con el metodo ${req.method}`)
    res.status(404).send(msg404)
  });

router.use(function(err, req, res, next){
    logger.error((`Algo salio mal - ${err}`))
    res.status(500).send(`Algo salio mal - ${err}`)
})

module.exports = router;

