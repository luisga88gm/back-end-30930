const express = require('express')
const app = express()
const apiRouter = require('./routes/productos.routes')
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/static', express.static(__dirname + '/public'))

app.use('/api', apiRouter)

app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Server listening on PORT', PORT)
  }
})