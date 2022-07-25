const config= require('../../../config/index')

class ProductosDTO{
    id;
    nombre;
    precio;
    precioUSD;
    precioFinalARS;
    thumbnail;

    constructor(data){
        this.id=data.id;
        this.nombre=data.nombre;
        this.precio=data.precio;
        this.precioUSD= (data.precio / config.TIPOCAMBIO_USD).toFixed(2)
        this.precioFinalARS= data.precio * config.IMPUESTOS_USD
        this.thumbnail=data.thumbnail;
    }
}

module.exports=ProductosDTO