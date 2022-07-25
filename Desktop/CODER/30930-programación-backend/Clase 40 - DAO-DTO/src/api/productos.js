const tableName = 'productos';
const ProductosFactoryDAO = require('../models/productos/factory/productos');
const { logger } = require('../services/logger');
const args= require('../services/args');

const persistencia=args['dao'];


class ProductosAPI{
        static instance;
        productos;

        constructor(dao){
                this.productos = dao
        }

        static async getInstance(){
                if(!this.instance){
                        logger.info('Inicializando API de Productos');
                        const dao=await ProductosFactoryDAO.get(persistencia);
                        ProductosAPI.instance= new ProductosAPI(dao);
                }
                return ProductosAPI.instance;
        }
        
        guardarProducto(item) { //Recibe un objeto y lo guarda en la BD
                return this.productos.guardarProducto(item);
        };

        actualizarProducto (id, producto){
                this.productos.actualizarProducto(id, producto)
                return 
        };

        buscarProductoPorId(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
                return this.productos.buscarProductoPorId(id);
        };

        buscarProductos(){ //Devuelve un array con los objetos presentes en el archivo 
                const listaProductos= this.productos.buscarProductos();
                return listaProductos
        };
        
        borrarProductoPorId(id){ // Elimina del archivo el objeto con el id buscado
                    return this.productos.borrarProductoPorId(id);
        };
};

module.exports=ProductosAPI