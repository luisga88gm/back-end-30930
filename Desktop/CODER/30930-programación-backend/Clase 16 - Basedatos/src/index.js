const express = require('express');
const path = require('path');
const mainRouter = require('./routes/index');
const viewsPath= path.resolve(__dirname, './views');
const http =require('http');
const { initWsServer} = require ('./services/socket');

const aplicacion = express();
const server = http.Server(aplicacion);
const puerto = 8080;

//Init SocketIo Server
initWsServer(server);

aplicacion.set('views', viewsPath);
aplicacion.set('view engine', 'pug');

const servidor = server.listen(puerto,()=>{
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

aplicacion.use('/', mainRouter);