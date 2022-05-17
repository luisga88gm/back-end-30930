const { ModeloProductos } = require('../models/productos');


const verifBodyProducto = async (request , response, next)=>{
    const {nombre, descripcion, foto, precio, stock} = request.body;

    if (!nombre || !descripcion || !foto || !precio || !stock){
        return response.status(400).json({
            msg: 'Faltan datos en el Body',
        });
    }

    next();
};


class Producto{
    productos;


    static async save(item){ //Recibe un objeto y lo guarda en BD
        try{
            await ModeloProductos.create(item);
        }catch (err){
            const respError={
                error: err.message
            }
            return respError
        }
    };

    static async updateItem(producto){
        try{
            const id = producto._id;
            const productoActualizado = await ModeloProductos.findByIdAndUpdate(id, producto, {new: true});
            return productoActualizado
        }catch (err){
            const respError={
                error: err.message
            }
            return respError
        }   
    };

    static async getById(id){ //Recibe un id y devuelve el objeto con ese id o null si no esta
        try{
            const producto = await ModeloProductos.findById(id)
            return producto
        }catch (err){
            const respError={
                error: err.message
            }
            console.log(respError)
            return null
        }   
    };

    static async getAll(){ //Devuelve un array con los objetos presentes en la BD
        try{
            const items = await ModeloProductos.find();
            return items
        }catch (err){
            const respError={
                error: err.message
            }
            return respError
        }   
    };
    
    static async deleteById(id){ // Elimina del archivo el objeto con el id buscado
        try{
            await ModeloProductos.findByIdAndDelete(id);
            const prods= await Producto.getAll()
            return (prods)
        }catch (err){
            const respError={
                error: err.message
            }
            return respError
        }   
    };
};

module.exports= { Producto , verifBodyProducto }