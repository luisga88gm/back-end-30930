const passport = require('passport');
const express = require('express');
const router = express.Router();

//Routers
const routerProductos = require('./productos');
const routerProductosTest = require('./productos-test');
const routerInfo = require('./info');
const routerRandoms = require('./randoms'); 

const path = require('path');
const fs = require('fs/promises');
const session= require('express-session');
const util=require('util');

const file='../../public/productos.txt';
const fileVacio='../../public/productos_vacio.txt';
const fileTest='../../public/productos_test.txt';

const ruta= path.resolve(__dirname, file);
const Contenedor = require('../utils/contenedor');
const { post } = require('./productos');
const { appendFile } = require('fs');

const winston=require('winston')
const {createLogger, format, transports} = winston;
const {combine, printf, timestamp, colorize} =format;


let listaProductos;
let user;

// configuracion de Winston (logger)
const logger=createLogger({
    level:'info',
    format: combine(
        timestamp({
            format: 'MM-DD-YYYY HH:mm:ss',
        }),
        printf((info)=>`${info.level} | ${info.timestamp} | ${info.message}`)
    ),
    transports:[
        new transports.Console({
            format: combine(
                timestamp({
                    format: 'MM-DD-YYYY HH:mm:ss',
                }),
                colorize(),
                printf((info)=>`${info.level} | ${info.timestamp} | ${info.message}`)
            ),
        }),
        new transports.File({
            filename: './logs/warn.log',
            level: 'warn',
        }),
        new transports.File({
            filename: './logs/error.log',
            level: 'error'
        })
    ]
});


const mwProductos = async (req,resp, next)=>{
    try{
        const prodDB= await Contenedor.init();
        let prods = await Contenedor.getAll();
        listaProductos= new Contenedor(prods);
        next()
    }
    catch(err){
        logger.error(`Error al recuperar los productos - ${err}`)
        resp.json({msg: err})
    }
};

const validarLogin=(req, res, next)=>{
    if (req.isAuthenticated()){
        user=req.session.user;
        next()
    }else{
        // res.redirect('/login')
        res.render('login')
    }
};

const loggeoPeticiones=(req, res, next)=>{
    logger.info(`Accediendo a la ruta ${req._parsedOriginalUrl.path} - Utilizando el metodo ${req.method}`);
    next()
}

router.get('/login', loggeoPeticiones,(req, res)=>{
    res.render('login');
});

router.get('/signup', loggeoPeticiones, (req, res)=>{
    res.render('signup');
});

router.post('/login', loggeoPeticiones, passport.authenticate('login', {failureRedirect:'/loginFailed'}), (req, res)=>{
    res.redirect('/');
});

router.get('/loginFailed', loggeoPeticiones,(req, res)=>{
    res.render('loginFailed');
});

router.get('/signupFailed', loggeoPeticiones,(req, res)=>{
    res.render('signupFailed');
});


router.post('/signup', loggeoPeticiones,passport.authenticate('signup', {failureRedirect:'/signupFailed'}), (req, res)=>{
        res.render('login')
});


router.post('/logout', loggeoPeticiones,function (req, res) {
    console.log('user logout...', req.user.email)
    const user = req.user.email
    req.logOut(function(err){
        if(err){
            logger.error(`error en logout - ${err}`);
            return next(err)
        }
    });
    res.render('logout', {user: user})
})

router.get('/', loggeoPeticiones, validarLogin, mwProductos, (request, response)=>{
    const productos={
        user: request.user.email,
        productos: listaProductos.productos
    }
    response.render('altaProducto', productos)
})

router.use('/info', loggeoPeticiones, routerInfo);

router.use('/randoms', loggeoPeticiones, routerRandoms);

router.use('/productos', loggeoPeticiones, routerProductos);

router.use('/productos-test', loggeoPeticiones, routerProductosTest);

router.use(function(req, res, next) {
    const msg404= 'Ruta no definida'
    logger.warn(`${msg404} - Se intento acceder a la ruta ${req.url} con el metodo ${req.method}`)
    res.status(404).send(msg404)
  });

router.use(function(err, req, res, next){
    logger.error((`Algo salio mal - ${err}`))
    res.status(500).send(`Algo salio mal - ${err}`)
})

module.exports = {router, logger};