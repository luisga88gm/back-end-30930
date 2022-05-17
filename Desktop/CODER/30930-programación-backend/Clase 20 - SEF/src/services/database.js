const mongoose = require('mongoose');

const connectionString = process.env.MONGO_ATLAS_SRV || 'mongodb://localhost:27017/luisgagm'


const initMongoDB = async ()=>{
    try{
        console.log('Conectando a Base de Datos...');
        await mongoose.connect(connectionString);
        console.log('Conexion a Base de Datos OK!')
    } catch (error){
        console.log('Error al conectar a BD');
        console.log(error);
        return error
    }
};

module.exports=initMongoDB()