const knex = require('knex');
const optionsPgSQL = require('../config/postgres');
const { logger } = require('./logger');
const tableName = 'productos'

const options = optionsPgSQL;

// class ConnectionProds{
    // static init(){
        const connection = knex(options); 
        connection.schema.hasTable('productos').then((exists)=>{
            if(exists) {
                logger.info(`Tabla ${tableName} existe`);
                return connection
            }else{
                logger.info(`Creando tabla ${tableName}`);
                return connection.schema.createTable(
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
    // }
// }

module.exports=connection

