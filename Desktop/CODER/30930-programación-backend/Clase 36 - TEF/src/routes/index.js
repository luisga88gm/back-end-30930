const express =require('express');
const router = express.Router();
const routerProductos = require('./productos');
const routerPedido = require('./pedido');
const routerCarrito = require('./carrito');
const routerAuthenticate = require('./auth').router;
const validarLogin = require('../services/auth').validarLogin;
const {logger, loggeoPeticiones} = require('../services/logger')


router.get('/', validarLogin, (request, response)=>{
    response.render('productos')
})

router.use('/productos', routerProductos);
router.use('/carrito', routerCarrito);
router.use('/auth', routerAuthenticate);
router.use('/pedido', routerPedido);

router.use(function(req, res, next) {
    const msg404= 'Ruta no definida'
    logger.warn(`${msg404} - Se intento acceder a la ruta ${req.url} con el metodo ${req.method}`)
    res.status(404).send(msg404)
  });

router.use(function(err, req, res, next){
    logger.error((`Algo salio mal - ${err}`))
    res.status(500).send(`Algo salio mal - ${err}`)
})


module.exports =router;