const express =require('express');
const fs = require('fs/promises');

const leerArchivo=(ruta)=>{
    return fs.readFile(ruta, 'utf-8')
}

const grabarDatos=(ruta, datos)=>{
    fs.writeFile(ruta, datos)
}

module.exports= {leerArchivo, grabarDatos}

