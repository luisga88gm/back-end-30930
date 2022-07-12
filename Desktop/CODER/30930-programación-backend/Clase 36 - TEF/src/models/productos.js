const mongoose = require('mongoose');

const coleccionProductos = 'productos';

const productosSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        timestamp: { type: String, required: true },
        nombre: { type: String, requiered: true },
        descripcion: { type: String, required: true },
        foto: { type: String, required: true},
        codigo: { type: String, required: true },
        precio: { type: Number, required: true},
        stock: { type: Number, required: true}
    },
    { timestamps: true, versionKey: false }
);

const ModeloProductos = mongoose.model(
    coleccionProductos,
    productosSchema
);

module.exports= { ModeloProductos, coleccionProductos };