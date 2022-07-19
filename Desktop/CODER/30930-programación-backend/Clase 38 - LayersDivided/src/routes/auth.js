const passport = require('passport');
const express =require('express');
const router = express.Router();
const {logger, loggeoPeticiones} = require('../services/logger');



router.get('/login', loggeoPeticiones,(req, res)=>{
    res.render('login');
});

router.get('/signup', loggeoPeticiones, (req, res)=>{
    res.render('signup');
});

router.post('/login', loggeoPeticiones, passport.authenticate('login', {failureRedirect:'/auth/loginFailed'}), (req, res)=>{
    res.redirect('/');
});

router.get('/loginFailed', loggeoPeticiones,(req, res)=>{
    res.render('loginFailed');
});

router.get('/signupFailed', loggeoPeticiones,(req, res)=>{
    res.render('signupFailed');
});


router.post('/signup', loggeoPeticiones,passport.authenticate('signup', {failureRedirect:'/auth/signupFailed'}), (req, res)=>{
        res.render('login')
});


router.post('/logout', loggeoPeticiones,function (req, res) {
    logger.info('user logout...', req.user.email)
    const user = req.user.email
    req.logOut(function(err){
        if(err){
            logger.error(`error en logout - ${err}`);
            return next(err)
        }
    });
    res.render('logout', {user: user})
})


module.exports=router