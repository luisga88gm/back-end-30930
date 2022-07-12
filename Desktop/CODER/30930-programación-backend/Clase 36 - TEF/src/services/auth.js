const passport= require('passport');
const LocalStrategy=require('passport-local').Strategy;
const {modeloUser}=require('../models/users');
const EmailService=require('../services/email');
const config=require('../config/index');
const {logger,  loggeoPeticiones} = require('./logger');
const { Carrito } = require('../controllers/carritosMongo');

const strategyOptions={
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
};

const login = async(req, username, password, done)=>{
    logger.info('intentando login...');
    const user = await modeloUser.findOne({email:username});
    if(!user){
        logger.info(`Login fallo! Usuario inexistente ${username}`)
        return done(null, false, {message: 'Usuario inexitente'});
    }
    const passOk= await user.isValidPassword(password)
    if(!passOk){
    logger.info('Login fallo! Password erronea')
    return done(null, false, {message: 'Password Erronea'});
    }
    logger.info(`Login exitoso de usuario ${username}`);
    return done(null, user);
};

const signup = async (req, username, password, done)=>{
    try{
        logger.info('intentando registro de usuario...');
        const { email, password, nombre, apellido, direccion, edad, codPais, telefono, foto, admin } = req.body;
        const query={
            email: email
        };
        const user=await modeloUser.findOne(query);

        if (user){
            logger.info(`Usuario ya existe ${user.email}`);
            return done (null, false, {message:'Usuario ya existe'});
        }else{
            const datosUser={
                email,
                password,
                nombre,
                apellido,
                direccion,
                edad,
                codPais,
                telefono,
                foto,
                admin
            };
            const nuevoUser= await modeloUser.create(datosUser);
            const usrCarrito={
                _id: nuevoUser._id,
                email: nuevoUser.email,
                nombre: nuevoUser.nombre,
                telefono: `+${datosUser.codPais}${datosUser.telefono}`
            }
            const item= {
                usuario: usrCarrito,
                timestamp: Date.now(),
                productos: []
            }
            const carrito=await Carrito.save(item);

            const updUser = await modeloUser.findByIdAndUpdate(nuevoUser._id, {carrito:carrito._id}, {new: true});

            logger.info(`Se dio de alta el usuario ${datosUser.email}`)
            const destAltaUsr= config.DESTINATARIO_MAIL_ADMIN;
            const subjAltaUsr='Nuevo Registro';
            
            const contAltaUsr=`<h2>Se dio de alta el usuario <b>${datosUser.email}</b>!</h2>
            <br>
            <h4><b>Nombre:</b> ${datosUser.nombre}</h4>
            <h4><b>Apellido:</b> ${datosUser.apellido}</h4>
            <h4><b>Edad:</b> ${datosUser.edad}</h4>
            <h4><b>Direccion:</b> ${datosUser.direccion}</h4>
            <h4><b>Telefono:</b> (+${datosUser.codPais}) ${datosUser.telefono}</h4>`

            EmailService.sendEmail(destAltaUsr, subjAltaUsr, contAltaUsr)
            logger.info(`Se envio email a Admin con los datos de alta del usuario ${datosUser.email}`)
            return done(null,nuevoUser);
        };
    }catch(error){
        done(error);
    } 
};

const loginFunc= new LocalStrategy(strategyOptions, login);
const signupFunc=new LocalStrategy(strategyOptions, signup);

const validarLogin=(req, res, next)=>{
    if (req.isAuthenticated()){
        user=req.session.passport.user;
        next()
    }else{
        res.render('login')
    }
};

passport.serializeUser((user, done)=>{
    logger.info('Ejecutando serializeUser')
    done(null, {_id:user._id, email:user.email, admin:user.admin, carrito:user.carrito});
})

passport.deserializeUser((userId, done)=>{
    logger.info('Ejecutando deserializeUser');
    modeloUser.findById(userId).then((user)=>{
        return done(null, user);
    })
});

module.exports={loginFunc, signupFunc, validarLogin};

