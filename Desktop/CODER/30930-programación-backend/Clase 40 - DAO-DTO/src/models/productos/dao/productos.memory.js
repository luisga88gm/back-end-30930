const { logger } = require('../../../services/logger');
const ProductosDTO= require('../dto/productos');

const productos = [
    {
		"nombre": "Cuchara",
		"precio": 299,
		"thumbnail": "data:image/jpeg;base64,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",
        "id": 1
    },
	{
		"nombre": "Tenedor",
		"precio": 150,
		"thumbnail": "https://http2.mlstatic.com/D_NQ_NP_638354-MLA46092568083_052021-O.jpg",
        "id": 2
	},
	{
		"nombre": "Cuchillo",
		"precio": 650,
		"thumbnail": "data:image/jpeg;base64,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",
        "id": 3
	}
]

class DaoProductos{
    static instance;
    productos;

    constructor (){
        this.productos = productos;
    }

    static async getInstance(){
        if (!DaoProductos.instance){
            logger.info('Inicializando DAO Productos- MEM');
            DaoProductos.instance= new DaoProductos();
        }
        return DaoProductos.instance;
    }

    async guardarProducto(item){ //Recibe un objeto, lo guarda en el archivo, devuelve el ids asignado
        const cantProd=this.productos.length;
        let ultimoId
        if (cantProd==0){
            ultimoId=0
        }else{
            ultimoId= this.productos[cantProd -1].id;
        }
        const idAsignado=ultimoId+1;
        item.id= idAsignado
        this.productos.push(item)
        return idAsignado
    };

    async actualizarProducto(id, producto){
        const indice = this.productos.findIndex(e=>e.id==id);
        Object.assign(this.productos[indice], producto)
    };

    buscarProductoPorId(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
        const producto = this.productos.find(e=>e.id==id)
        if (producto){
            return new ProductosDTO(producto)
        }else{
            return null
        }
    };
    

    buscarProductos(){ //Devuelve un arrayon los objetos presentes en el archivo 
        return this.productos.map((prod)=> new ProductosDTO(prod));
    };
    
    async borrarProductoPorId(id){ // Elimina del archivo el objeto con el id buscado
        const idIndex = this.productos.findIndex((e)=>e.id==id)
        if (idIndex > -1){
            this.productos.splice(idIndex,1)
        }else{
            logger.info(`No se encontro el id solicitado: ${id}`)
        };

    };
}


module.exports= DaoProductos

