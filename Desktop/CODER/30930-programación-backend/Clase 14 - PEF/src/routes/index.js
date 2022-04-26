const express =require('express');

const router = express.Router();
const routerProductos = require('./productos');
const routerCarrito = require('./carrito');

router.get('/',(request, response)=>{
    response.json({
        error: '-2, ruta no implementada'
    })
})

router.use('/productos', routerProductos);
router.use('/carrito', routerCarrito);


module.exports =router;