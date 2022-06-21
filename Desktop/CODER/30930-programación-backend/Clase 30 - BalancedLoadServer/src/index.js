const dotenv = require('dotenv')
dotenv.config();
require('dotenv').config();
const express = require('express');
const path = require('path');
const mainRouter = require('./routes/index');
const viewsPath= path.resolve(__dirname, './views');
const http =require('http');
const { initWsServer} = require ('./services/socket');
const { initMongoDB } = require ('./services/db');
const session = require ('express-session');
const MongoStore= require('connect-mongo');
const { password } = require('./models/users');
const passport = require('passport');
const loginFunc = require('./services/auth').loginFunc
const signupFunc = require('./services/auth').signupFunc
const cluster=require('cluster');
const os=require('os');

const inicioBD = initMongoDB
const aplicacion = express();
const server = http.Server(aplicacion);

const yargs = require('yargs')

const args = yargs
    .alias({
        p:'puerto',
        m:'modo'
    })
    .describe({
        p: 'Indica el puerto de escucha del Servidor (8080 por defecto)',
        m: 'Indica el modo fork o cluster. (fork por defecto)'
    })
    .choices({
        m: ['cluster', 'fork']
    })
    .default({
        puerto:8080,
        modo:'fork'
    })
    // .check((args, options)=>{
        // console.log(args.modo)
        // if (args.modo =='cluster' || args.modo =='fork'){
            // return true
        // }else{
            // throw new Error ('Modo invalido')
        // }
    // })
    .argv;

console.log('hola mundo 2')
// const argsFinal={
const puerto = args['puerto']
const modo=args['modo']
// }

// const puerto= argsFinal.puerto
//Init SocketIo Server
initWsServer(server);

//Configuracion de Express-Session
aplicacion.use(
    session({
        secret: process.env.SESSION_SECRET || 'backEnder',
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 60000
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


aplicacion.set('views', viewsPath);
aplicacion.set('view engine', 'pug');

const numCPUs = os.cpus().length;

console.log(`Inicio de Server en modo: ${modo}`);

if(modo=='cluster'){
    console.log('entre por cluster');
    if (cluster.isMaster){
        //MASTER
        console.log(`PID Master - ${process.pid}`);
        for (let i = 0; i< numCPUs; i++){ //Se crean tantos workers como procesadores existen
            cluster.fork();
        }

        cluster.on('exit', (worker, code)=>{
            console.log(`Worker ${worker.process.pid} finalizo con codigo ${code} a las ${Date()}`);
            cluster.fork();
        })
    }else{
        //WORKERS
        const servidor = server.listen(puerto,()=>{
            console.log(`Server Listo. Escuchando en el puerto ${puerto} - PID WORKER ${process.pid}`)
        });

        servidor.on('error', (err)=>{
            console.log('Hubo un error', err)
        });
    }
}else{
    console.log('entre por fork');
    const servidor = server.listen(puerto,()=>{
        console.log(`Server Listo. Escuchando en el puerto ${puerto} - PID ${process.pid}`)
    });
    servidor.on('error', (err)=>{
        console.log('Hubo un error', err)
    });
}


aplicacion.use (express.json());
aplicacion.use(express.urlencoded({extended: true}));

const publicPath = path.resolve(__dirname, '../public');
aplicacion.use(express.static(publicPath));

aplicacion.use('/api', mainRouter);

aplicacion.use('/', mainRouter);