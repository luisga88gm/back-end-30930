const express =require('express');
const router = express.Router();
const { Carrito } = require('../controllers/carritosMongo');
const { generaId } = require('../controllers/varios');
const { Producto } = require('../controllers/productosMongo');
const { ModeloCarritos } = require('../models/carritos');
const {logger, loggeoPeticiones} = require('../services/logger');
const { validarLogin } = require('../services/auth');
const { render } = require('pug');
const axios = require('axios')

const msg404Carrito= 'Carrito no encontrado'
const msg404Producto= 'Producto no encontrado'


router.get('/:id/detalle', validarLogin, async(request, response)=>{
    const id = request.params.id;
    const carrito = await Carrito.getById(id);
    if (carrito!= null){
        response.render('carrito', carrito)
    }else{
        logger.info(`Carrito id: ${id} - ${msg404Carrito}`)
        response.status(404).json({
            error : msg404Carrito 
        })
    }
});

router.get('/:id', async (request, response)=>{ 
    const id = request.params.id;
    const carrito = await Carrito.getById(id);
    if (carrito!= null){
        // response.render('carrito', carrito)
        response.json(carrito)
    }else{
        logger.info(`Carrito id: ${id} - ${msg404Carrito}`)
        response.status(404).json({
            error : msg404Carrito 
        })
    }
});

router.get('/:id/productos', validarLogin, async (request, response)=>{ 
    const id = request.params.id;
    const carrito = await Carrito.getById(id);
    if (carrito!= null){
        if (carrito.productos.length>0){
            response.json({productos: carrito.productos})
        }else{
            response.json({
                msg: 'No hay productos en el carrito',
                productos: carrito.productos
            })
        }
    }else{
        logger.info(`Carrito id: ${id} - ${msg404Carrito}`)
        response.status(404).json({
            error : msg404Carrito 
        })
    }
});

router.post('/', validarLogin, async (request, response)=>{ // Crear Carrito - LISTO
    const body=request.body
    const usuario = body.usuario //generaId();
    const item= {
        usuario: usuario,
        timestamp: Date.now(),
        productos: []
    }
    Carrito.save(item);
    logger.info(`Carrito creado`)
    response.json({
        msg: 'Carrito creado',
        carrito: item});

});

router.delete('/:id', validarLogin, async(request, response)=>{ //Borra por carrito segun id (hace falta controlar/reponer stock)?
    const id = request.params.id;
    const carrito= await Carrito.getById(id)
    if(carrito!=null){
        const borrarCarrito = await Carrito.deleteById(id);
        response.json(borrarCarrito) //Devuelve array de carritos creados
    }else{
        logger.info(`Carrito id: ${id} - ${msg404Carrito}`)
        response.status(404).json({error : msg404Carrito})
    }
}); 

router.post('/:id/productos', validarLogin, async(request, response)=>{
    const idCarrito = request.params.id;
    const carrito = await Carrito.getById(idCarrito);
    if (carrito!= null){
        const body= request.body;
        let producto= await Producto.getById(body.idProd);
        if (producto!=null){
            const idxProd = Carrito.getIndex(carrito, producto._id)
            if (idxProd == -1){
                carrito.productos.push(producto);
                await Carrito.updateItem(carrito);
                // response.json(carrito);
                response.redirect('/api/productos')
            }else{
               response.status(400).json({msg: 'Producto ya existe en Carrito'})
            }
        }else{
            logger.info(`Producto id: ${body.idProd} - ${msg404Producto}`);
            response.status(404).json({error: msg404Producto})
        }
    }else{
        logger.info(`Carrito id: ${id} - ${msg404Carrito}`);
        response.status(404).json({error: msg404Carrito})
    }

});

router.delete('/:id/productos/:id_prod', validarLogin, async(request, response)=>{
    const idCarrito = request.params.id;
    const idProd = request.params.id_prod;
    const carrito = await Carrito.getById(idCarrito);
    if (carrito!= null){
        const updtCarrito = await Carrito.deleteProdById(carrito, idProd);
            if (updtCarrito==null){
                logger.info(`Producto id: ${idProd} - ${msg404Producto}`);
                response.status(404).json({error: msg404Producto})
            }else{
                Carrito.updateItem(carrito);
                response.json(carrito);
            }
    }else{
        logger.info(`Carrito id: ${id} - ${msg404Carrito}`);
        response.status(404).json({error: msg404Carrito})
    }
});


module.exports = router;