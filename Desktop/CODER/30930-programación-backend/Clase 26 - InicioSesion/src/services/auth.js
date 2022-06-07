const passport= require('passport');
const LocalStrategy=require('passport-local').Strategy;
const {modeloUser}=require('../models/users');

const strategyOptions={
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
};

const login = async(req, username, password, done)=>{
    console.log('intentando login...');
    const user = await modeloUser.findOne({email:username});
    console.log('user...', user);
    if(!user){
        console.log('Login fallo! Usuario inexistente')
        return done(null, false, {message: 'Usuario inexistente'});
    }
    const passOk= await user.isValidPassword(password)
    console.log('pass...', passOk);
    if(!passOk){
    console.log('Login fallo! Password erronea')
    return done(null, false, {message: 'Password Erronea'});
}
    
    console.log('Login exitoso');
    return done(null, user);
};

const signup = async (req, username, password, done)=>{
    try{
        console.log('intentando registro de usuario...');
        const { email, password, admin } = req.body;
        const query={
            email: email
        };
        console.log('query', query)
        const user=await modeloUser.findOne(query);

        if (user){
            console.log('Usuario ya existe', user.email);
            return done (null, false, {message:'Usuario ya existe'});
        }else{
            const datosUser={
                email,
                password
            };
            const nuevoUser= await modeloUser.create(datosUser);
            return done(null,nuevoUser);
        };
    }catch(error){
        done(error);
    } 
};

const loginFunc= new LocalStrategy(strategyOptions, login);
const signupFunc=new LocalStrategy(strategyOptions, signup);

passport.serializeUser((user, done)=>{
    console.log('serializeUser')
    done(null, user._id);
})

passport.deserializeUser((userId, done)=>{
    console.log('deserializeUser');
    modeloUser.findById(userId).then((user)=>{
        return done(null, user);
    })
});

module.exports={loginFunc, signupFunc};