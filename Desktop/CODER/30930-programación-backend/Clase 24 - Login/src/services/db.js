require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = process.env.MONGO_ATLAS_SRV2 || 'mongodb://localhost:27017/luisgagm';


const initMongoDB = async ()=>{
    try{
        console.log('Conectando a BD...');
        await mongoose.connect(connectionString);
        console.log('Conexion a BD exitosa!')
    }catch(error){
        console.log('Error al conectar a BD');
        console.log(error);
        return error
    }
}

module.exports=initMongoDB()