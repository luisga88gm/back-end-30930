const express = require("express");
const apiRouter = express.Router();

const productController = require("../controllers/product.controller.js");

apiRouter.get("/", productController.MostrarFormulario);

apiRouter.get("/productos", productController.listaProducto);

apiRouter.get("/productos/:id", productController.mostrarProducto);

apiRouter.post("/productos", productController.nuevoProducto);

apiRouter.put("/productos/:id", productController.actualizarProducto);

apiRouter.delete("/productos/:id", productController.eliminarProducto);

module.exports = apiRouter;