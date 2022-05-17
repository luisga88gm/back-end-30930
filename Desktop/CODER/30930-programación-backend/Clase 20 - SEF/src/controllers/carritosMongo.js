// const express =require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs/promises');
// const {leerArchivo, grabarDatos} = require('./conservados');
// const {randomIndex} = require('./varios')
// const file='../../public/carritos.txt';
// const ruta= path.resolve(__dirname, file);

const { ModeloCarritos } = require('../models/carritos');

class Carrito{
    carritos;

    // constructor (cart){
        // this.carritos = cart;
    // }
    
    static async save(item){ //Recibe un objeto y lo guarda en BD
        try{
            await ModeloCarritos.create(item);
        }catch (err){
            const respError={
                error: err.message
            }
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
            console.log(respError)
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
            return respError
        }   
    };

    static async deleteProdById(carrito, idProd) { //Elimina un producto de un carrito
        const idxProd= Carrito.getIndex(carrito, idProd);
        if (idxProd>-1){
            carrito.productos.splice(idxProd, 1);
            return carrito;
        }else{
            return null
        }
    }

    static async deleteAll(){ // Elimina todos los objetos presentes en el archivo
        this.carritos.length=0;
        const carritosStringified = JSON.stringify(this.carritos, null, '\t');
        await grabarDatos(ruta, carritosStringified)
    };
};

module.exports= { Carrito }