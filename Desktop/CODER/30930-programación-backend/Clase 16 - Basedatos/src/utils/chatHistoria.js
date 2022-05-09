const express =require('express');
const router = express.Router();
const knex = require('knex');
const optionsSQLite =require('../../options/sqlite3');

const tableName = 'chatHistoria'


class ChatHistoria{
    mensajes;

    constructor (listaMensajes){
        this.mensajes = listaMensajes;
        const options = optionsSQLite;
        this.connection = knex(options);
    }

    async init() {
        this.connection.schema.hasTable('chatHistoria').then((exists)=>{
            if(exists) {
                console.log(`Tabla ${tableName} existe`)
                return
            } else {
                console.log(`Creando tabla ${tableName}`)
                return this.connection.schema.createTable(
                    tableName,
                    (chatHistoriaTable) =>{
                        chatHistoriaTable.increments();
                        chatHistoriaTable.string('email').notNullable();
                        chatHistoriaTable.string('mensaje').notNullable();
                        chatHistoriaTable.string('fecha');
                        chatHistoriaTable.timestamps(true, true);
                    }
                )
            }
        })
    }

    async save(item){ //Recibe un objeto y lo guarda en la BD
        console.log('save item', item);
        return this.connection(tableName).insert(item);
    };

    static getChats(){ //Devuelve un array con los registros de la BD 
        const options = optionsSQLite;
        this.connection = knex(options);
        const listaChat= this.connection(tableName)
        return listaChat
    };
};

module.exports = router;

module.exports= ChatHistoria;