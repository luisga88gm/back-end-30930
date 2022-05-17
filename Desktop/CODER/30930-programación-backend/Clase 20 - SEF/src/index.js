require('dotenv').config();
const express = require('express');
// const { appendFile } = require('fs');
const path = require('path');
// const fs = require('fs/promises');
const mainRouter = require('./routes/index');
const { initMongoDB }=require('./services/database')

// const rutaHome = path.resolve(__dirname, './views/index.html')

const inicioBD = initMongoDB
const aplicacion = express();
const puerto = process.env.PORT || 8080;

const servidor = aplicacion.listen(puerto,()=>{
    console.log("Server Listo. Escuchando en el puerto", puerto)
});

aplicacion.use(function (err, req, res, next) {
    return res.status('500').json({
        msg: 'Se ha producido un error inesperado',
        error: err.message,
    });
});

servidor.on('error', (err)=>{
    console.log('Hubo un error', err)
});

aplicacion.use (express.json());
aplicacion.use(express.urlencoded({extended: true}));

const publicPath = path.resolve(__dirname, '../public');
aplicacion.use(express.static(publicPath));

aplicacion.use('/api', mainRouter);