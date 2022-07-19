const {guardarProducto, actualizarProducto,buscarProductoPorId,buscarProductos,borrarProductoPorId} = require("../api/productos");
const {logger} = require('../services/logger')

class Producto{
    productos;


    validaItem(item){
        let itemOK
        if (item.nombre!=undefined && parseInt(item.precio)>0){
            itemOK=true
        }else{
            itemOK=false
        }
        return itemOK
    };
    

    async save(item){ //Recibe un objeto y lo guarda en la BD
        return await guardarProducto(item);
    };

    async updateItem(id, producto){
        await await actualizarProducto(id, producto);
        return 
    };

    generaId(){
        const cantProd=this.productos.length;
        let ultimoId
        if (cantProd==0){
            ultimoId=0
        }else{
            ultimoId= this.productos[cantProd -1].id;
        }
        const idAsignado=ultimoId+1;
        return idAsignado
    };

    async getById(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
        return await buscarProductoPorId(id);
    };

    async getAll(){ //Devuelve un array con los objetos presentes en el archivo 
        // const options = optionsMySQL;
        // this.connection = knex(options);
        const listaProductos= {productos: await buscarProductos()}
        return listaProductos
    };
    
    async deleteById(id){ // Elimina del archivo el objeto con el id buscado
        const prod= await buscarProductoPorId(id)
        if (prod.length){
            await borrarProductoPorId(id);
            const listaProductos= await buscarProductos()
            return (listaProductos);
        }else{
            return null
        }
    };
};

// module.exports = router;

const Contenedor = new Producto();

const getProducts = async (req,resp, next)=>{
    try{
        // const prodDB= await Contenedor.init();
        // let prods = await Contenedor.getAll();
        listaProductos= await Contenedor.getAll()//new Producto(prods);
        logger.info(`Productos recuperados`)
        next()
    }
    catch(err){
        logger.error(`Error al recuperar los productos! - ${err}`)
        resp.json({msg: err})
    }
}

module.exports= {Contenedor, getProducts};