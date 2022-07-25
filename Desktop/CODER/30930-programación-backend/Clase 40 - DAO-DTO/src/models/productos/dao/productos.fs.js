const path = require('path');
const fs = require('fs/promises');
const ProductosDTO= require('../dto/productos');
const { logger } = require('../../../services/logger');

const file='./productos.txt';
const ruta= path.resolve(__dirname, file);

class DaoProductos{
    static instance;
    productos;
// 
    constructor (prods){
        this.productos = prods;
        
    }

    static async getInstance(){
        if (!DaoProductos.instance){
            logger.info('Inicializando DAO Productos- FS');
            const prods= await DaoProductos.getProds()
            DaoProductos.instance= await new DaoProductos(prods);
        }
        return DaoProductos.instance;
    }

    async guardarProducto(item){ //Recibe un objeto, lo guarda en el archivo, devuelve el ids asignado
        const cantProd=this.productos.length;
        let ultimoId
        if (cantProd==0){
            ultimoId=0
        }else{
            ultimoId= this.productos[cantProd -1].id;
        }
        const idAsignado=ultimoId+1;
        item.id= idAsignado
        this.productos.push(item)
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await fs.writeFile(ruta, productosStringified)
        return idAsignado
    };

    async actualizarProducto(id, producto){
        const indice = this.productos.findIndex(e=>e.id==id);
        Object.assign(this.productos[indice], producto)
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await fs.writeFile(ruta, productosStringified)
    };

    buscarProductoPorId(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
        const producto = this.productos.find(e=>e.id==id)
        if (producto){
            return new ProductosDTO(producto)
        }else{
            return null
        }
    };
    

    async buscarProductos(){ //Devuelve un array con los objetos presentes en el archivo 
        const listaProductos= JSON.parse(await fs.readFile(ruta, 'utf-8'))
        return listaProductos.map((prod)=> new ProductosDTO(prod));
    };

    static async getProds(){ //Devuelve un array con los objetos presentes en el archivo 
        const listaProductos= JSON.parse(await fs.readFile(ruta, 'utf-8'))
        return listaProductos
    };
    
    async borrarProductoPorId(id){ // Elimina del archivo el objeto con el id buscado
        const idIndex = this.productos.findIndex((e)=>e.id==id)
        if (idIndex > -1){
            this.productos.splice(idIndex,1)
            const productosStringified = JSON.stringify(this.productos, null, '\t');
            await fs.writeFile(ruta, productosStringified)
        }else{
            logger.info(`No se encontro el id solicitado: ${id}`)
        };

    };
}



module.exports= DaoProductos