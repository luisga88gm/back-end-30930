const express =require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const {leerArchivo, grabarDatos} = require('../controllers/persistencia');
const {randomIndex} = require('./varios')
const file='../../public/carritos.txt';
// const fileTest='../../public/carritos_test.txt';
const ruta= path.resolve(__dirname, file);

class Carrito{
    carritos;

    constructor (cart){
        this.carritos = cart;
    }
    
    async save(item){ //Recibe un objeto y lo guarda en el archivo
        this.carritos.push(item)
        const carritosStringified = JSON.stringify(this.carritos, null, '\t');
        await grabarDatos(ruta, carritosStringified)
    };

    async updateItem(carrito){
        const indice = this.carritos.findIndex(e=>e.id==carrito.id)
        this.carritos.splice(indice, 1, carrito)
        const carritosStringified = JSON.stringify(this.carritos, null, '\t');
        await grabarDatos(ruta, carritosStringified)
    };

    getIndex(carrito, idProd){
        const prodIndex = carrito.productos.findIndex(e=>e.id==idProd);
        return prodIndex;
    };

    getById(id){ //Recibe en id y devuelve el objeto con ese id o null si no est
        const carrito = this.carritos.find(e=>e.id==id)
        if (carrito){
            return carrito
        }else{
            return null
        }
    };
    
    getRandom(){
        const min = 0; 
        const max = this.carritos.length;
        const idx= randomIndex(min, max);
        return (this.carritos[idx]);
    }

    static getAll(ruta){ //Devuelve un array con los objetos presentes en el archivo 
        return leerArchivo(ruta)
    };
    
    async deleteById(id){ // Elimina del archivo el objeto con el id buscado
        const idIndex = this.carritos.findIndex((e)=>e.id==id)
        if (idIndex > -1){
            const carritoEliminado= this.carritos[idIndex];
            this.carritos.splice(idIndex,1);
            const carritosStringified = JSON.stringify(this.carritos, null, '\t');
            await grabarDatos(ruta, carritosStringified);
            return({
                msg: 'Se elimino el carrito',
                carrito: carritoEliminado
            })
        }else{
            return null
        };

    };

    async deleteProdById(carrito, idProd) { //Elimina un producto de un carrito
        const idxProd= this.getIndex(carrito, idProd);
        if (idxProd>-1){
            carrito.productos.splice(idxProd, 1);
            return carrito;
        }else{
            return null
        }
    }

    async deleteAll(){ // Elimina todos los objetos presentes en el archivo
        this.carritos.length=0;
        const carritosStringified = JSON.stringify(this.carritos, null, '\t');
        await grabarDatos(ruta, carritosStringified)
    };
};

module.exports= { Carrito }
