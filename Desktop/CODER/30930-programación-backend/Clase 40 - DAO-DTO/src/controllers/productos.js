// const {guardarProducto, actualizarProducto,buscarProductoPorId,buscarProductos,borrarProductoPorId} = require("../dao/productos.mySql.dao");
const ProductosAPI = require('../api/productos');
const {logger} = require('../services/logger');

let productosDao;

ProductosAPI.getInstance().then((instance)=>{
    productosDao = instance;
});

const validaItem=(item)=>{
    let itemOK
    if (item.nombre!=undefined && parseInt(item.precio)>0){
        itemOK=true
    }else{
        itemOK=false
    }
    return itemOK
};

const save= async (item)=>{ //Recibe un objeto y lo guarda en la BD
    return await productosDao.guardarProducto(item);
};

const updateItem= async (id, producto)=>{
    await productosDao.actualizarProducto(id, producto);
    return 
};

  const generaId=()=>{
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

const getById=async(id)=>{ //Recibe en id y devuelve el objeto con ese id o null si no es
    return await productosDao.buscarProductoPorId(id);
};

const getAll= async ()=>{ //Devuelve un array con los objetos presentes en el archivo 
      //const options = optionsMySQL;
      //this.connection = knex(options);
    const listaProductos= {productos: await productosDao.buscarProductos()}
    return listaProductos
};

const deleteById=async (id)=>{ // Elimina del archivo el objeto con el id buscado
    const prod= await productosDao.buscarProductoPorId(id)
    if (prod){
        await productosDao.borrarProductoPorId(id);
        const listaProductos= await productosDao.buscarProductos()
        return (listaProductos);
    }else{
        return null
    }
};

const getProducts = async (req,resp, next)=>{
    try{
        // const prodDB= await Contenedor.init();
        // let prods = await Contenedor.getAll();
        listaProductos= {productos: await productosDao.buscarProductos()}//new Producto(prods);
        logger.info(`Productos recuperados`)
        next()
    }
    catch(err){
        logger.error(`Error al recuperar los productos - ${err}`)
        resp.json({msg: `${err}`})
    }
}
const Contenedor = {validaItem, save, updateItem, generaId, getById, getAll, deleteById}
module.exports= {Contenedor, getProducts, validaItem, save, updateItem, generaId, getById, getAll, deleteById}