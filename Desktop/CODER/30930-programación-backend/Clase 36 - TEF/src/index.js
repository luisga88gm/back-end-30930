const config= require('./config/index')
require('dotenv').config();
const express = require('express');
// const { appendFile } = require('fs');
const path = require('path');
// const fs = require('fs/promises');
const mainRouter = require('./routes/index');
const viewsPath= path.resolve(__dirname, './views');
const http =require('http');
const { initMongoDB }=require('./services/database');
const session=require('express-session');
const passport = require('passport');
const loginFunc = require('./services/auth').loginFunc
const signupFunc = require('./services/auth').signupFunc
const cluster=require('cluster');
const os=require('os');
const {logger}= require('./services/logger')

// const rutaHome = path.resolve(__dirname, './views/index.html')

const yargs = require('yargs');
const compression=require('compression');

//Configuracion de Yargs
const args = yargs
    .alias({
        m:'modo'
    })
    .describe({
        m: 'Indica el modo fork o cluster. (fork por defecto)'
    })
    .choices({
        m: ['cluster', 'fork']
    })
    .default({
        modo:'fork'
    })
    .argv;

const inicioBD = initMongoDB
const aplicacion = express();
const puerto = config.PORT;
const server = http.Server(aplicacion);


//Configuracion de Express-Session
aplicacion.use(
    session({
        secret: process.env.SESSION_SECRET || 'claveSuperSecreta',
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 6000000
        },
        rolling: true,
        resave: true,
        saveUninitialized: true,
    }),
);

//Se indica que passport va a utilizarse en todas las rutas y se le delega el manejo de sesiones
aplicacion.use(passport.initialize());
aplicacion.use(passport.session());


passport.use('login', loginFunc);
passport.use('signup', signupFunc);

//Se utiliza compression para minimizar la trafico de datos
aplicacion.use(compression());

//Se define PUG como motor de plantillas para el front
aplicacion.set('views', viewsPath);
aplicacion.set('view engine', 'pug');



const numCPUs = os.cpus().length;
const modo=args['modo']

logger.info(`Inicio de Server en modo: ${modo}`);

if(modo=='cluster'){
    if (cluster.isMaster){
        //MASTER
        logger.info(`PID Master - ${process.pid}`);
        for (let i = 0; i< numCPUs; i++){ //Se crean tantos workers como procesadores existen
            cluster.fork();
        }

        cluster.on('exit', (worker, code)=>{
            logger.warn(`Worker ${worker.process.pid} finalizo con codigo ${code} a las ${Date()}`);
            cluster.fork();
        })
    }else{
        //WORKERS
        const servidor = server.listen(puerto,()=>{
            logger.info(`Server Listo. Escuchando en el puerto ${puerto} - PID WORKER ${process.pid}`)
        });

        servidor.on('error', (err)=>{
            logger.error('Hubo un error', err)
        });
    }
}else{
    const servidor = server.listen(puerto,()=>{
        logger.info(`Server Listo. Escuchando en el puerto ${puerto} - PID ${process.pid}`)
    });
    servidor.on('error', (err)=>{
        logger.error('Hubo un error', err)
    });
}


aplicacion.use(function (err, req, res, next) {
    return res.status('500').json({
        msg: 'Se ha producido un error inesperado',
        error: err.message,
    });
});


aplicacion.use (express.json());
aplicacion.use(express.urlencoded({extended: true}));

const publicPath = path.resolve(__dirname, '../public');
aplicacion.use(express.static(publicPath));

aplicacion.use('/api', mainRouter);

aplicacion.use('/', mainRouter);
