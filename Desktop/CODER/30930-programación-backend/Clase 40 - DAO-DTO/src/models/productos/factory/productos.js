const ProductosFsDao = require('../dao/productos.fs');
const ProductosPgSqlDao = require('../dao/productos.postgreSql');
const ProductosMemDao= require('../dao/productos.memory');
const {logger} = require('../../../services/logger');


class ProductosFactoryDAO {
    
    static async get(dao){
        switch (dao){
            case 'mem':
                logger.info('Retornando Instancia Productos Memoria');
                return await ProductosMemDao.getInstance();
            
            case 'fs':
                logger.info('Retornando Instanca Productos File System');
                return await ProductosFsDao.getInstance();
            
            case 'pg':
                logger.info('Retornando Instancia Productos PostgreSQL');
                return await ProductosPgSqlDao.getInstance();

            default:
                logger.info('Retornando Instancia Productos Default');
                return await ProductosPgSqlDao.getInstance();
        }
    }
}

module.exports=ProductosFactoryDAO