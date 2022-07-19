const passport= require('passport');
const {buscaUsuario, altaUsuario, buscaUsuarioPorId} = require('../api/auth');
const LocalStrategy=require('passport-local').Strategy;
const {logger} = require('../services/logger');

const strategyOptions={
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
};

const validarLogin=(req, res, next)=>{
    if (req.isAuthenticated()){
        user=req.session.user;
        next()
    }else{
        res.render('login')
    }
};

const login = async(req, username, password, done)=>{
    logger.info(`intentando login de usuario ${username}...`);
    const user = await buscaUsuario(username);
    if(!user){
        logger.info('Login fallo! Usuario inexistente')
        return done(null, false, {message: 'Usuario inexitente'});
    }
    const passOk= await user.isValidPassword(password)
    if(!passOk){
    logger.info('Login fallo! Password erronea')
    return done(null, false, {message: 'Password Erronea'});
}
    
    logger.info('Login exitoso');
    return done(null, user);
};

const signup = async (req, username, password, done)=>{
    try{
        logger.info('intentando registro de usuario...');
        const { email, password, admin } = req.body;
        const user=await buscaUsuario(email);
        if (user){
            logger.info(`Usuario ya existe ${user.email}`);
            return done (null, false, {message:'Usuario ya existe'});
        }else{
            const datosUser={
                email,
                password
            };
            const nuevoUser= await altaUsuario(datosUser);
            return done(null,nuevoUser);
        };
    }catch(error){
        logger.error(error)
        done(error);
    } 
};

const loginFunc= new LocalStrategy(strategyOptions, login);
const signupFunc=new LocalStrategy(strategyOptions, signup);

passport.serializeUser((user, done)=>{
    logger.info('serializeUser')
    done(null, user._id);
})

passport.deserializeUser((userId, done)=>{
    logger.info('deserializeUser');
    buscaUsuarioPorId(userId).then((user)=>{
        return done(null, user);
    })
});

module.exports={loginFunc, signupFunc, validarLogin};

