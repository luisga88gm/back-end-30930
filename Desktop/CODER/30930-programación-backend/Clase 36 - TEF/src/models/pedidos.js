const mongoose= require("mongoose");
const { coleccionProductos } = require("./productos");
const { coleccionUser } = require("./users")

const coleccionPedidos = 'pedidos'

const pedidosSchema = new mongoose.Schema(
    {
        usuario: { type: Object, required: true },
        timestamp: { type: String, required: true},
        productos: { type: Array ,ref: coleccionProductos, required: true }
    },
    { timestamps: true, versionKey: false}
);

const ModeloPedidos = mongoose.model(
    coleccionPedidos,
    pedidosSchema
);

module.exports={ ModeloPedidos };