const express =require('express');
const router = express.Router();
const passport = require('passport');
const { modeloUser } = require('../models/users');
const {logger, loggeoPeticiones} = require('../services/logger')


const validarLogin=(req, res, next)=>{
    if (req.isAuthenticated()){
        user=req.session.user;
        next()
    }else{
        // res.redirect('/login')
        res.render('login')
    }
};

router.get('/login', loggeoPeticiones, (req, res)=>{
    res.render('login');
});

router.get('/signup',   (req, res)=>{
    res.render('signup');
});

router.post('/login', loggeoPeticiones,  passport.authenticate('login', {failureRedirect:'/api/auth/loginFailed'}), (req, res)=>{
    res.redirect('/api/productos')
    // res.status(200).json({message: 'login ok', user: req.user.email});
});

router.get('/loginFailed',  (req, res)=>{
    logger.info('Error en login')
    // res.status(500).json({message: 'Error en login - Usuario o contraseña erroneo'})
    res.render('loginFailed');
});

router.get('/signupFailed',  (req, res)=>{
    logger.info('Error en signup')
    res.render('signupFailed', );
});


router.post('/signup',  passport.authenticate('signup', {failureRedirect:'/api/auth/signupFailed', failureMessage: true}), (req, res)=>{
    // res.status(200).json({message: 'Usuario dado de alta', user: req.user.email});    
    res.render('login')
});


router.post('/logout', validarLogin, function (req, res) {
    logger.info('user logout...', req.user.email)
    const user = req.user.email
    req.logOut(function(err){
        if(err){
            logger.error(`error en logout - ${err}`);
            return next(err)
        }
    });
    res.render('logout', {user: user})
});

router.get('/:id', async(req, res)=>{
    const id = req.params.id;
    const usuario = await modeloUser.findById(id);
    res.render('perfilUsuario', usuario);
} )

module.exports = {router};