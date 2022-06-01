const express = require('express');
const router = express.Router();
const {faker} = require('@faker-js/faker');
const session = require('express-session')
faker.locale = 'es';

const { database, commerce, image } = faker

// const sesionactual= req.session.reload();

const validarLogin=(req, res, next)=>{
    if (req.session.loggedIn===true){
        next()
    }else{
        res.render('login')
    }
};

router.get('/', validarLogin, async (request, response)=>{
    const usr= request.session.user
    const productos={user: usr ,productos:[]}
    for(let i=0; i<5;i++){
        let nombreProd= commerce.product();
        await productos.productos.push({
            id: database.mongodbObjectId(),
            nombre: nombreProd,
            precio: commerce.price(100, 5000, 2),
            thumbnail: `${image.imageUrl()}/${nombreProd}`
        })
    }
    // const user=request.session.user
    response.render('productos', productos)
});

module.exports = router;