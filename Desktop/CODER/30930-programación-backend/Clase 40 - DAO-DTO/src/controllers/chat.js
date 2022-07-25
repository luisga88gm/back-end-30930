const express =require('express');
const util=require('util');
const { normalize, schema} = require('normalizr');
const optionsSQLite =require('../config/sqlite3');
const {logger} = require('../services/logger');
const {guardaMensaje, cargarMesajes} = require('../models/mensajes/mensajes.mongo.dao');

const author = new schema.Entity('author');

const mensaje = new schema.Entity('mensaje', {author: author} , {idAttribute: '_id'});

const schemaMensajes = new schema.Array(mensaje);


class ChatHistoria{
    mensajes;

    async save(mensaje){ //Recibe un objeto y lo guarda en la BD
        try{
            logger.info(`Guardar mensaje: ${mensaje}`);
            const nuevoMensaje = await guardaMensaje(mensaje);
            return nuevoMensaje;
        }catch(error){
            logger.error('Error', error)
            return null
        }
    };

    async getChats(){ //Devuelve un array con los registros de la BD 
        try{
            const mensajesOriginales = await cargarMesajes();
            const mensajesNormalizados = normalize(mensajesOriginales, schemaMensajes);
            return mensajesNormalizados;
        }catch(error){
            logger.error('Error', error)
            return null            
        }
    };
};

const Chat = new ChatHistoria()

module.exports= Chat;