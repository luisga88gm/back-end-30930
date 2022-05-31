const express =require('express');
const router = express.Router();
const util=require('util');
const { normalize, schema} = require('normalizr');
const {modeloChat} = require ('../models/mensajes');
// const knex = require('knex');
// const optionsSQLite =require('../../options/sqlite3');

// const tableName = 'chatHistoria'

const author = new schema.Entity('author');

const mensaje = new schema.Entity('mensaje', {author: author} , {idAttribute: '_id'});

const schemaMensajes = new schema.Array(mensaje);


class ChatHistoria{
    mensajes;

    static async save(item){ //Recibe un objeto y lo guarda en la BD
        try{
            console.log('save item', item);
            const nuevoMensaje = await modeloChat.create(item);
            return nuevoMensaje;
        }catch(error){
            console.log('Error', error)
            return null
        }
    };

    static async getChats(){ //Devuelve un array con los registros de la BD 
        try{
            const mensajesOriginales = await modeloChat.find().lean();
            const mensajesNormalizados = normalize(mensajesOriginales, schemaMensajes);
            console.log('Datos Normalizados:', util.inspect(mensajesNormalizados, true, 7, true));
            return mensajesNormalizados;
        }catch(error){
            console.log('Error', error)
            return null            
        }
    };
};

module.exports = router;

module.exports= ChatHistoria;