const dotenv = require('dotenv')
dotenv.config();
require('dotenv').config();
const express = require('express');
const path = require('path');
const mainRouter = require('./routes/index');
const viewsPath= path.resolve(__dirname, '../views');
const http =require('http');
const { initWsServer} = require ('./services/socket');
const { initMongoDB } = require ('./services/db');
const session = require ('express-session');
const MongoStore= require('connect-mongo');



const inicioBD = initMongoDB
const aplicacion = express();
const server = http.Server(aplicacion);
const puerto = process.env.PORT || 8080;

//Init SocketIo Server
initWsServer(server);


//Configuracion del Session
aplicacion.use(session({
    store: MongoStore.create({mongoUrl: process.env.MONGO_ATLAS_SRV2}),
    secret: 'backEnder',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie:{
        maxAge: 60000
    }
}))

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