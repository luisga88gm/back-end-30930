const connection = require('../services/dbProductos')
const tableName = 'productos'


        
const guardarProducto= async (item)=>{ //Recibe un objeto y lo guarda en la BD
        return connection(tableName).insert(item);
};

const actualizarProducto= async (id, producto)=>{
        await connection(tableName).where('id', id).update(producto);
        return 
};

const buscarProductoPorId=async(id)=>{ //Recibe en id y devuelve el objeto con ese id o null si no esta
        return await connection(tableName).where('id', id);
};

const buscarProductos=async()=>{ //Devuelve un array con los objetos presentes en el archivo 
        const listaProductos= await connection(tableName)
        return listaProductos
};
    
const borrarProductoPorId=async (id)=>{ // Elimina del archivo el objeto con el id buscado
            await connection(tableName).where('id',id).del();
            return {msg: 'Elemento borrado'}
};


module.exports={guardarProducto, actualizarProducto,buscarProductoPorId,buscarProductos,borrarProductoPorId}