const express =require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { Carrito } = require('../controllers/carritosCtrl');
const { generaId } = require('../controllers/varios');
const { Producto } = require('../controllers/productosCtrl')

const msg404Carrito= 'Carrito no encontrado!'
const msg404Producto= 'Producto no encontrado!'

const file='../../public/carritos.txt';
// const fileTest='../../public/carritos_test.txt';
const ruta= path.resolve(__dirname, file);

let carritos

const mwCarritos = async (req,resp, next)=>{
    try{
        let carts = await Carrito.getAll(ruta);
        let cartsJson = JSON.parse(carts);
        carritos= new Carrito(cartsJson);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
        resp.json({msg: err})
    }
}

const listaProductos = async (req,resp, next)=>{
    try{
        let prods = await Producto.getAll(ruta);
        let prodsJson = JSON.parse(prods);
        productos= new Producto(prodsJson);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
        resp.json({msg: err})
    }
}

router.get('/:id/productos', mwCarritos, (request, response)=>{
    const id = request.params.id;
    const carrito = carritos.getById(id);
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

router.post('/',mwCarritos, (request, response)=>{ // Crea Carrito - OK
    const idAsignado= generaId();
    const item= {
        id: idAsignado,
        timestamp: Date.now(),
        productos: []
    }
    carritos.save(item);
    response.json(item);
});

router.delete('/:id', mwCarritos, async(request, response)=>{ //Borra por carrito segun id
    const id = request.params.id;
    const carts = await carritos.deleteById(id);
    if (carts!=null){
        response.json(carts) //Devuelve un array de carritos creados
    }else{
        response.status(404).json({error : msg404Carrito})
    }
}); 

router.get('/:id/productos', mwCarritos, async(request, response)=>{

});

router.post('/:id/productos', mwCarritos, listaProductos, async(request, response)=>{
    const idCarrito = request.params.id;
    const carrito = carritos.getById(idCarrito);
    if (carrito!= null){
        const body= request.body;
        const producto= productos.getById(body.idProd);
        const cant ={cant: parseInt(body.cant)};
        if (producto!=null){
            if (cant.cant>0){
                const idxProd = carritos.getIndex(carrito, producto.id)
                if (idxProd == -1){
                    const prodCarrito={
                        ...producto,
                        ...cant
                    };
                    carrito.productos.push(prodCarrito);
                }else{
                    carrito.productos[idxProd].cant += cant.cant;
                }
                carritos.updateItem(carrito);
                response.json(carrito);
            }else{
                response.status(400).json({error: 'error en la cantidad'})
            }
        }else{
            response.status(404).json({error: msg404Producto})
        }
    }else{
        response.status(404).json({error: msg404Carrito})
    }

});

router.delete('/:id/productos/:id_prod', mwCarritos, async(request, response)=>{
    const idCarrito = request.params.id;
    const idProd = request.params.id_prod;
    const carrito = carritos.getById(idCarrito);
    if (carrito!= null){
        const updtCarrito = await carritos.deleteProdById(carrito, idProd);
            if (updtCarrito==null){
                response.status(404).json({error: msg404Producto})
            }else{
                carritos.updateItem(carrito);
                response.json(carrito);
            }
    }else{
        response.status(404).json({error: msg404Carrito})
    }
});


module.exports = router;