const socketIo = require ('socket.io');
const Contenedor = require('../utils/contenedor');
const ChatHistoria = require('../utils/chatHistoria');
const { getAll, connection } = require('../utils/contenedor');
let listaMensajes={mensajes:[]}
const chatHistoria= new ChatHistoria(listaMensajes);
const ImportProductos = require('../crearTablaProductos');
const knex = require('knex');
const optionsMySQL = require('../../options/mariaDB');

chatHistoria.init();

const file='./public/productos.txt';

const listaChat= async()=>{
    try{

        let mensajes = await ChatHistoria.getChats();
        listaMensajes= new ChatHistoria(mensajes);
        return listaMensajes
    }
    catch(err){
        console.log('Error al recuperar los mensajes!', err)
        return (listaMensajes.mensajes=[])
    }
}

const Productos = async ()=>{
    try{
        let prodDB = await Contenedor.init();
        console.log ('prodDB2', prodDB)
        let prods = await Contenedor.getAll();
        produc= new Contenedor(prods);
        return produc
    }
    catch(err){
        console.log('Error al recuperar los productos!', err)
        resp.json({msg: err})
    }
}


const initWsServer = (server) => {
    io = socketIo(server);
  
    io.on('connection', async (socket) => {
      console.log('Nueva Conexion establecida!');
      const listaMensajes = await listaChat();
      if (listaMensajes.mensajes.length>0){
        socket.emit('listaMensajes', listaMensajes.mensajes)
      } 
    //Recibo una linea Nueva
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
            console.log(data);
            const listaMensajes= await listaChat()
            console.log('nuevo mensaje' ,listaMensajes)
            await listaMensajes.save(data)
            const newListaMensajes= await listaChat()
            console.log(newListaMensajes)
            console.log(newListaMensajes);
            io.emit('listaMensajes', newListaMensajes.mensajes)
      })
    
    return io;
    })};
  
  module.exports = {
    initWsServer,
  };