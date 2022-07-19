const mongoose = require('mongoose');
const config = require ('../config/index');
const { logger } = require('./logger');

const connectionString = config.MONGO_ATLAS_SRV2 || 'mongodb://localhost:27017/luisgagm';


const initMongoDB = async ()=>{
    try{
        logger.info('Conectando a BD...');
        await mongoose.connect(connectionString);
        logger.info('Conexion a BD exitosa!')
    }catch(error){
        logger.error(`Error al conectar a BD - ${error}`);
        return error
    }
}

module.exports=initMongoDB()