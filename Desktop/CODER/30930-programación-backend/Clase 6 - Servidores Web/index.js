const express = require('express')
const app = express()
const Container = require('./container')
const nuevoProducto = new Container('producto.txt')

app.use(express.json())

app.get('/productos', async (req, res) => {
  try {
    const resultado = await nuevoProducto.getAll()
    res.send(resultado)
  } catch (error) {
    res.send(error)
  }
})

app.get('/productoRandom', async (req, res) => {
  const data = await nuevoProducto.getAll()
  const random = Math.floor(Math.random() * data.length)
  res.send(await nuevoProducto.getById(parseInt(random + 1)))
})

app.listen(8080, () => {
  console.log('Servidor corriendo en el puerto http://localhost:8080')
})