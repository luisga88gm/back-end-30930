const config = require('../config/index');
const { ModeloPedidos } = require('../models/pedidos');
const EmailService = require('../services/email');
const {logger,  loggeoPeticiones} = require('../services/logger');
const TwilioService = require('../services/twilio');


class Pedido{
    pedidos;

    constructor (pedido){
        this.pedidos = pedido;
    }
    
    async save(item){ //Recibe un objeto y lo guarda en BD
        try{
            await ModeloPedidos.create(item);
        }catch (err){
            const respError={
                error: err.message
            }
            logger.error(respError);
            return respError
        }
    };

    async updateItem(pedido){
        try{
            const id= pedido._id;
            const pedidoActualizado = await ModeloPedidos.findByIdAndUpdate(id, pedido, {new: true});
            return pedidoActualizado
        }catch(err){
            const respError={
                error: err.message
            }
            logger.error(respError);
            return respError
        }   
    };

    getIndex(pedido, idProd){
        const prodIndex = pedido.productos.findIndex(e=>e._id==idProd);
        return prodIndex;
    };

    async getById(id){ //Recibe en id y devuelve el objeto con ese id o null si no est
        try{
            const pedido = await ModeloPedido.findById(id)
            return pedido
        }catch(err){
            const respError={
                error: err.message
            }
            logger.error(respError);
            return null
        }
    };
    
    getRandom(){
        const min = 0; 
        const max = this.pedidos.length;
        const idx= randomIndex(min, max);
        return (this.pedidos[idx]);
    }

    async getAll(){ //Devuelve un array con todos los pedidos en BD 
        try{
            const items = await ModeloPedidos.find();
            return items
        }catch (err){
            const respError={
                error: err.message
            }
            logger.error(respError);
            return respError
        }   
    };
    
    async deleteById(id){ // Elimina de la BD el objeto con el id buscado
        try{
            await ModeloPedidos.findByIdAndDelete(id);
            return({
                msg: 'Pedido eliminado',
            })
        }catch (err){
            const respError={
                error: err.message
            }
            logger.error(respError);
            return respError
        }   
    };

    static async deleteProdById(pedido, idProd) { //Elimina un producto de un pedido
        const idxProd= Pedido.getIndex(pedido, idProd);
        if (idxProd>-1){
            pedido.productos.splice(idxProd, 1);
            return pedido;
        }else{
            return null
        }
    }
    
    enviaMensajes(pedido){
        const cellAdmin = config.DESTINATARIO_CELU_ADMIN;
        const mailAdmin = config.DESTINATARIO_MAIL_ADMIN;
        const cellUsuario = pedido.usuario.telefono;
        const nombreUsuario = pedido.usuario.nombre;
        const emailUsuario = pedido.usuario.email;
        const productos = pedido.productos;
        let listaProductos=""
        productos.forEach(e => {
            listaProductos= listaProductos +`<p>${e.id} - <b>${e.nombre}</b></p>`
        });
        
        const asunto =`Nuevo pedido de ${nombreUsuario} - ${emailUsuario}`

        const contProductos=`<H2>NUEVO PEDIDO </H2>
        <H3>Productos:</H3>
        ${listaProductos}`

        const mensajeSMSUsuario = `${nombreUsuario}, te confirmamos que recibimos tu pedido y esta siendo procesado`;

        TwilioService.sendWhatsAppMessage(cellAdmin, asunto);
        TwilioService.sendSMSMessage(cellUsuario, mensajeSMSUsuario);
        EmailService.sendEmail(mailAdmin, asunto, contProductos);


    }
};

const pedido = new Pedido() 
module.exports= pedido