const express = require('express');
const router = express.Router();
const {faker} = require('@faker-js/faker');

faker.locale = 'es';

const { database, commerce, image } = faker


router.get('/', async (request, response)=>{
    const productos={productos:[]}
    for(let i=0; i<5;i++){
        let nombreProd= commerce.product();
        await productos.productos.push({
            id: database.mongodbObjectId(),
            nombre: nombreProd,
            precio: commerce.price(100, 5000, 2),
            thumbnail: `${image.imageUrl()}/${nombreProd}`
        })
    }
    response.render('productos', productos)
});

module.exports = router;