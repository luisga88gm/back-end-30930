const util=require('util');
const socketIo = require ('socket.io');
const Contenedor = require('../utils/contenedor');
const ChatHistoria = require('../utils/chatHistoria');
const { getAll, connection } = require('../utils/contenedor');
const ImportProductos = require('../crearTablaProductos');
const knex = require('knex');
const optionsMySQL = require('../../options/mariaDB');
const logger = require('../routes/index').logger

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

const Productos = async ()=>{
    try{
        let prodDB = await Contenedor.init();
        let prods = await Contenedor.getAll();
        produc= new Contenedor(prods);
        return produc
    }
    catch(err){
        logger.error(`Error al recuperar los productos - ${err}`)
        resp.json({msg: err})
    }
}


const initWsServer = (server) => {
    io = socketIo(server);
  
    io.on('connection', async (socket) => {
      console.log('Nueva Conexion establecida!');
      const listaMensajes = await listaChat();
      console.log('Enviando lista de mensajes...');
      socket.emit('listaMensajes', listaMensajes);
      console.log('...Lista de mensajes enviada!');
      socket.on('altaProducto', async () => {
        console.log('Se agrego un producto');
        const productos= await Productos();
        console.log('Existen nuevos productos:', productos)
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
            console.log('nuevo mensaje' ,listaMensajes)
            await ChatHistoria.save(data)
            const newListaMensajes= await listaChat()
            io.emit('listaMensajes', newListaMensajes)
      })
    
    return io;
    })};
  
  module.exports = {
    initWsServer,
  };