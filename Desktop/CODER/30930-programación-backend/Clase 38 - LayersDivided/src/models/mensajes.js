const mongoose = require('mongoose');
const coleccionChat= 'chat';

const chatSchema = mongoose.Schema({
    text: { type: String, required:true, max:250},
    author:{
        id: {type: String, required: true, max:50},
        nombre: {type: String, required:true, max:50},
        apellido: {type: String, required:true, max:50},
        alias: {type: String, required:true, max:50},
        edad: {type: Number, required:true},
        avatar: {type: String, required:true},
    }
    },
    { timestamps: true, versionKey: false}
);

const modeloChat=mongoose.model(
    coleccionChat,
    chatSchema
);

module.exports= { modeloChat };
