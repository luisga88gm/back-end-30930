class Producto {
    productos = []
    id = 0
  
    nuevoProducto(producto) {
      this.productos.push({
        title: producto.title,
        price: producto.price,
        thumbnail: producto.thumbnail,
        id: ++this.id
      })
  
      return this.productos[this.id - 1]
    }
  
    mostrarProducto(id) {
      let prod = this.productos.find((producto) => {
        return producto.id == id
      })
      if (prod == undefined) {
        return '{error: "Producto no encontrado."}'
      }
  
      return prod
    }
  
    get listarProducto() {
      if (this.productos.length == 0) {
        return '{error: "No hay productos cargados."}'
      }
  
      return this.productos
    }
  
    actualizarProducto(cambios, id) {
      let indiceProd = this.productos.findIndex((prod) => {
        return prod.id == id
      })
      let prodActualizado = { ...cambios, id: id }
      return (this.productos[indiceProd] = prodActualizado)
    }
  
    eliminarProducto(id) {
      let indiceProd = this.productos.findIndex((prod) => {
        if (prod.id == id) {
          return prod
        }
      })
      if (indiceProd == -1) {
        return '{error: "Producto no encontrado."}'
      }
      return this.productos.splice(indiceProd, 1)[0]
    }
  }
  
  module.exports = new Producto()