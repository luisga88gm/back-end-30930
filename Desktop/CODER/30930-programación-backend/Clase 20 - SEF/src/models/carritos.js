const mongoose= require("mongoose");
const { coleccionProductos } = require("./productos");

const coleccionCarritos = 'carritos'

const carritosSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        timestamp: { type: String, required: true},
        productos: { type: Array ,ref: coleccionProductos, required: true }
    },
    { timestamps: true, versionKey: false}
);

const ModeloCarritos = mongoose.model(
    coleccionCarritos,
    carritosSchema
);

module.exports={ ModeloCarritos };