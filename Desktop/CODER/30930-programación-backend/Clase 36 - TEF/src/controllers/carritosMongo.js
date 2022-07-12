const { ModeloCarritos } = require('../models/carritos');
const {logger,  loggeoPeticiones} = require('../services/logger');
class Carrito{
    carritos;
    
    static async save(item){ //Recibe un objeto y lo guarda en BD
        try{
            const carrito= await ModeloCarritos.create(item);
            return carrito
        }catch (err){
            const respError={
                error: err.message
            }
            logger.error(respError)
            return respError
        }
    };

    static async updateItem(carrito){
        try{
            const id= carrito._id;
            const carritoActualizado = await ModeloCarritos.findByIdAndUpdate(id, carrito, {new: true});
            return carritoActualizado
        }catch(err){
            const respError={
                error: err.message
            }
            logger.error(respError)
            return respError
        }   
    };

    static getIndex(carrito, idProd){
        const prodIndex = carrito.productos.findIndex(e=>e._id==idProd);
        return prodIndex;
    };

    static async getById(id){ //Recibe en id y devuelve el objeto con ese id o null si no est
        try{
            const carrito = await ModeloCarritos.findById(id)
            return carrito
        }catch(err){
            const respError={
                error: err.message
            }
            logger.error(respError)
            return null
        }
    };
    
    getRandom(){
        const min = 0; 
        const max = this.carritos.length;
        const idx= randomIndex(min, max);
        return (this.carritos[idx]);
    }

    static async getAll(){ //Devuelve un array con los objetos presentes en el archivo 
        try{
            const items = await ModeloCarritos.find();
            return items
        }catch (err){
            const respError={
                error: err.message
            }
            logger.error(respError)
            return respError
        }   
    };
    
    static async deleteById(id){ // Elimina del archivo el objeto con el id buscado
        try{
            await ModeloCarritos.findByIdAndDelete(id);
            return({
                msg: 'Se elimino el carrito',
            })
        }catch (err){
            const respError={
                error: err.message
            }
            logger.error(respError)
            return respError
        }   
    };

    static async deleteProdById(carrito, idProd) { //Elimina un producto de un carrito
        const idxProd= this.getIndex(carrito, idProd);
        if (idxProd>-1){
            carrito.productos.splice(idxProd, 1);
            return carrito;
        }else{
            return null
        }
    }

    static async deleteAllItems(carrito){ // Elimina todos los items del carrito
        try{
            await ModeloCarritos.findByIdAndUpdate(carrito, {$set:{productos:[]}});
            logger.info('productos eliminados')
            return({
                msg: 'Se vacio el carrito',
            });
        }catch (err){
            const respError={
                error: err.message
            }
            logger.error(respError)
            return respError
        }; 
    };
};

module.exports= { Carrito }
