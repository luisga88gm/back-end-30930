const {modeloChat} = require ('../models/mensajes');


const guardaMensaje=async(mensaje)=>{
    const nuevoMensaje = await modeloChat.create(mensaje);
    return nuevoMensaje
}

const cargarMesajes=async()=>{
    const mensajes = await modeloChat.find().lean();
    return mensajes
}


module.exports= {guardaMensaje, cargarMesajes}