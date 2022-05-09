const express =require('express');
const router = express.Router();
const fs = require('fs/promises');
const knex = require('knex');
const optionsMySQL = require('../../options/mariaDB');

const tableName = 'productos'

class Contenedor{
    productos;

    constructor (prods){
        this.productos = prods;
        const options = optionsMySQL;
        this.connection = knex(options);
    }

    static init(){
        const options = optionsMySQL;
        this.connection = knex(options);
        this.connection.schema.hasTable('productos').then((exists)=>{
            if(exists) {
                console.log(`Tabla ${tableName} existe`);
                return
            }else{
                console.log(`Creando tabla ${tableName}`);
                return this.connection.schema.createTable(
                    tableName,
                    (productosTable)=>{
                        productosTable.increments();
                        productosTable.string('nombre').notNullable();
                        productosTable.decimal('precio', 8, 2);
                        productosTable.string('thumbnail');
                        productosTable.timestamps(true, true);
                    }
                )
            }
        })
    }
    
    async save(item){ //Recibe un objeto y lo guarda en la BD
        return this.connection(tableName).insert(item);
    };

    async updateItem(id, producto){
        await this.connection(tableName).where('id', id).update(producto);
        return 
    };

    // randomIndex (min,max){
        // return Math.floor(Math.random() * (max - min) + min);
    // };

    generaId(){
        const cantProd=this.productos.length;
        let ultimoId
        if (cantProd==0){
            ultimoId=0
        }else{
            ultimoId= this.productos[cantProd -1].id;
        }
        const idAsignado=ultimoId+1;
        return idAsignado
    };

    async getById(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
        return await this.connection(tableName).where('id', id);
    };
    
    // getRandom(){
        // const min = 0; 
        // const max = this.productos.length;
        // const idx= randomIndex(min, max);
        // return (this.productos[idx]);
    // }

    static async getAll(){ //Devuelve un array con los objetos presentes en el archivo 
        const options = optionsMySQL;
        this.connection = knex(options);
        const listaProductos= await this.connection(tableName)
        return listaProductos
    };
    
    async deleteById(id){ // Elimina del archivo el objeto con el id buscado
        const prod= await this.connection(tableName).where('id', id)
        if (prod.length){
            await this.connection(tableName).where('id',id).del();
            const listaProductos= await this.connection(tableName)
            return (listaProductos);
        }else{
            return null
        }
    };

    // async deleteAll(){ // Elimina todos los objetos presentes en el archivo
        // this.productos.length=0;
        // const productosStringified = JSON.stringify(this.productos, null, '\t');
        // await fs.writeFile(ruta, productosStringified)
    // };
};

module.exports = router;

module.exports= Contenedor;