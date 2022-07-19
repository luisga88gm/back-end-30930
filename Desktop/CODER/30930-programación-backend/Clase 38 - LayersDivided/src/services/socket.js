const util=require('util');
const socketIo = require ('socket.io');
const {Contenedor} = require('../controllers/productos');
const ChatHistoria = require('../controllers/chat');
const { getAll, connection } = require('../controllers/productos');
const ImportProductos = require('../utils/crearTablaProductos');
const knex = require('knex');
const optionsMySQL = require('../config/mariaDB');
const {logger} = require('../services/logger')

const file='./public/productos.txt';

const listaChat= async()=>{
    try{

        const listaMensajes = await ChatHistoria.getChats();
        return listaMensajes
    }
    catch(err){
        logger.error(`Error al recuperar los mensajes - ${err}`)
        return (listaMensajes.mensajes=[])
    }
}


const initWsServer = (server) => {
    io = socketIo(server);
  
    io.on('connection', async (socket) => {
      logger.info('Nueva Conexion establecida!');
      const listaMensajes = await listaChat();
      logger.info('Enviando lista de mensajes...');
      socket.emit('listaMensajes', listaMensajes);
      logger.info('...Lista de mensajes enviada!');
      socket.on('altaProducto', async () => {
        logger.info('Se agrego un producto');
        const productos= await Contenedor.getAll();
        logger.info('Existen nuevos productos:', productos)
        io.emit('nuevoProducto', productos);
      });

      socket.on('importProductos', async() =>{
        const connectionDB=knex(optionsMySQL)
        await ImportProductos.llenarTablaProductos(file, connectionDB);
        const productos= await Productos();
        io.emit('nuevoProducto', productos);
      });

      socket.on('nuevoMensaje', async (data)=>{
            const listaMensajes= await listaChat()
            logger.info('nuevo mensaje' ,listaMensajes)
            await ChatHistoria.save(data)
            const newListaMensajes= await listaChat()
            io.emit('listaMensajes', newListaMensajes)
      })
    
    return io;
    })};
  
  module.exports = {
    initWsServer,
  };