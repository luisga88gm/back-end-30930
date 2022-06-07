const passport = require('passport');
const express = require('express');
const router = express.Router();
const routerProductos = require('./productos');
const routerProductosTest = require('./productos-test');
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



let listaProductos;
let user;


const mwProductos = async (req,resp, next)=>{
    try{
        const prodDB= await Contenedor.init();
        let prods = await Contenedor.getAll();
        listaProductos= new Contenedor(prods);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
        resp.json({msg: err})
    }
};

const validarLogin=(req, res, next)=>{
    if (req.isAuthenticated()){
        user=req.session.user;
        next()
    }else{
        res.render('login')
    }
};

router.get('/login', (req, res)=>{
    res.render('login');
});

router.get('/signup', (req, res)=>{
    res.render('signup');
});

router.post('/login', passport.authenticate('login', {failureRedirect:'/loginFailed'}), (req, res)=>{
    res.redirect('/');
});

router.get('/loginFailed', (req, res)=>{
    res.render('loginFailed');
});

router.get('/signupFailed', (req, res)=>{
    res.render('signupFailed');
});


router.post('/signup', passport.authenticate('signup', {failureRedirect:'/signupFailed'}), (req, res)=>{
        res.render('login')
});


router.post('/logout', function (req, res) {
    console.log('user logout...', req.user.email)
    const user = req.user.email
    req.logOut(function(err){
        if(err){
            console.log('error en logout', err);
            return next(err)
        }
    });
    res.render('logout', {user: user})
})

router.get('/', validarLogin, mwProductos, (request, response)=>{
    const productos={
        user: request.user.email,
        productos: listaProductos.productos
    }
    response.render('altaProducto', productos)
})

router.use('/productos', routerProductos);

router.use('/productos-test', routerProductosTest);

module.exports = router;