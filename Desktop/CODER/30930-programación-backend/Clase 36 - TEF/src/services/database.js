require('dotenv').config();
const mongoose=require('mongoose');
const {logger,  loggeoPeticiones} = require('./logger');

const connectionString = process.env.MONGO_ATLAS_SRV || 'mongodb://localhost:27017/luisgagm'


const initMongoDB = async ()=>{
    try{
        logger.info('Conectando a Base de Datos...');
        await mongoose.connect(connectionString);
        logger.info('Conexion a Base de Datos OK!')
    } catch (error){
        logger.error(`Error al conectar a BD: ${error}`  );
        return error
    }
};

module.exports=initMongoDB()