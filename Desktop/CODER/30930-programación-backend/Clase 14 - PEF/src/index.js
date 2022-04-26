const express = require('express');
const { appendFile } = require('fs');
const path = require('path');
const fs = require('fs/promises');
const mainRouter = require('./routes/index');

// const rutaHome = path.resolve(__dirname, './views/index.html')

const aplicacion = express();
const puerto = process.env.PORT || 8080;

const servidor = aplicacion.listen(puerto,()=>{
    console.log("Server Listo. Escuchando en el puerto", puerto)
});

servidor.on('error', (err)=>{
    console.log('Hubo un error', err)
});

aplicacion.use (express.json());
aplicacion.use(express.urlencoded({extended: true}));

const publicPath = path.resolve(__dirname, '../public');
aplicacion.use(express.static(publicPath));

aplicacion.use('/api', mainRouter);

// aplicacion.get('/', (request, response)=>{
    // response.sendFile(rutaHome);
// });