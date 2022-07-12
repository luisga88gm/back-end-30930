const express =require('express');
const router = express.Router();
const { Carrito } = require('../controllers/carritosMongo');
const pedido = require('../controllers/pedidosCtrl');
const { generaId } = require('../controllers/varios');
const { Producto } = require('../controllers/productosMongo');
const { ModeloPedidos } = require('../models/pedidos');
const {logger, loggeoPeticiones} = require('../services/logger');
const { validarLogin } = require('../services/auth');
const axios=require('axios');
const config = require('../config');

const msg404Pedido= 'Pedido no encontrado'
const msg404Producto= 'Producto no encontrado'

axios.defaults.withCredentials = true;

router.post('/:idCarrito', validarLogin, async(req, res)=>{
    const idCarrito = req.params.idCarrito
    try{
        const carrito = await axios.get(`${config.RUTA_APP}/api/carrito/${idCarrito}`)

        if (carrito){
            try{
                const nuevoPedido = await axios.post(`${config.RUTA_APP}/api/pedido`, {carrito: carrito.data, withCredentials: true })
            }catch (error){
                logger.error(error)
            }
            res.render('pedidoOK')   
        }else{
            res.status(404).json({error: 'Carrito no encontrado'})
        }
    }catch (error){
        logger.error(error)
    }
})

router.post('/', async (request, response)=>{ // Crea Pedido - LISTO
    const carrito = request.body.carrito;
    const item= {
        usuario: carrito.usuario,
        timestamp: Date.now(),
        productos: carrito.productos
    }
    pedido.save(item); // Se crea el pedido
    Carrito.deleteAllItems(carrito._id); // Se vacia el carrito
    pedido.enviaMensajes(item);  //Se envia mail y Whatsapp a Admin con el pedido y SMS de confirmacion al cliente
    logger.info('Pedido creado')
    response.json({
        msg: 'Pedido creado',
        carrito: item});

});

module.exports = router;