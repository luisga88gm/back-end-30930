const express =require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const {leerArchivo, grabarDatos} = require('./conservados.js');
const {randomIndex} = require('./varios')
const file='../../public/productos.txt';
// const fileTest='../../public/productos_test.txt';
const ruta= path.resolve(__dirname, file);

class Producto{
    productos;

    constructor (prods){
        this.productos = prods;
    }
    
    async save(item){ // Recibe un objeto y lo guarda en el archivo
        this.productos.push(item)
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await grabarDatos(ruta, productosStringified)
    };

    async updateItem(producto){
        const indice = this.productos.findIndex(e=>e.id==producto.id)
        this.productos.splice(indice, 1, producto)
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await grabarDatos(ruta, productosStringified)
    };

    getById(id){ // Recibe en id y devuelve el objeto con ese id o null si no está
        const producto = this.productos.find(e=>e.id==id)
        if (producto){
            return producto
        }else{
            return null
        }
    };
    
    getRandom(){
        const min = 0; 
        const max = this.productos.length;
        const idx= randomIndex(min, max);
        return (this.productos[idx]);
    }

    static getAll(){ // Devuelve un array con los objetos presentes en el archivo 
        return leerArchivo(ruta)
    };
    
    async deleteById(id){ // Elimina del archivo el objeto con el id especificado
        const idIndex = this.productos.findIndex((e)=>e.id==id)
        if (idIndex > -1){
            this.productos.splice(idIndex,1)
            const productosStringified = JSON.stringify(this.productos, null, '\t');
            await grabarDatos(ruta, productosStringified)
            return(this.productos)
        }else{
            return null
        };

    };

    async deleteAll(){ // Elimina todos los objetos presentes en el archivo
        this.productos.length=0;
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await grabarDatos(ruta, productosStringified)
    };
};

module.exports= { Producto }