const express =require('express');
const router = express.Router();
const { Carrito } = require('../controllers/carritosMongo');
const { generaId } = require('../controllers/varios');
const { Producto } = require('../controllers/productosMongo');
const { ModeloCarritos } = require('../models/carritos');

const msg404Carrito= 'Carrito no encontrado'
const msg404Producto= 'Producto no encontrado'



router.get('/:id/productos', async (request, response)=>{ 
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
        response.status(404).json({
            error : msg404Carrito 
        })
    }
});

router.post('/', async (request, response)=>{ // Crea Carrito - LISTO
    const idAsignado= generaId();
    const item= {
        id: idAsignado,
        timestamp: Date.now(),
        productos: []
    }
    Carrito.save(item);
    response.json({
        msg: 'Carrito creado',
        carrito: item});

});

router.delete('/:id', async(request, response)=>{ //Borra por carrito segun id (hace falta controlar/reponer stock)?
    const id = request.params.id;
    const carrito= await Carrito.getById(id)
    if(carrito!=null){
        const borrarCarrito = await Carrito.deleteById(id);
        response.json(borrarCarrito) //Devuelve array de carritos creados
    }else{
        response.status(404).json({error : msg404Carrito})
    }
}); 

router.post('/:id/productos', async(request, response)=>{
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
                response.json(carrito);
            }else{
               response.status(400).json({msg: 'Producto ya existe en Carrito'})
            }
        }else{
            response.status(404).json({error: msg404Producto})
        }
    }else{
        response.status(404).json({error: msg404Carrito})
    }

});

router.delete('/:id/productos/:id_prod', async(request, response)=>{
    const idCarrito = request.params.id;
    const idProd = request.params.id_prod;
    const carrito = await Carrito.getById(idCarrito);
    if (carrito!= null){
        const updtCarrito = await Carrito.deleteProdById(carrito, idProd);
            if (updtCarrito==null){
                response.status(404).json({error: msg404Producto})
            }else{
                Carrito.updateItem(carrito);
                response.json(carrito);
            }
    }else{
        response.status(404).json({error: msg404Carrito})
    }
});


module.exports = router;