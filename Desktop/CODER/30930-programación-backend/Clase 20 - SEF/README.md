Proyecto Final - 2do Entregable


El proyecto usa Mongo Atlas como Base de datos.

El string de conexion se debe cargar en la variable de entorno MONGO_ATLAS_SRV con el siguiente formato:

mongodb+srv://:@/?retryWrites=true&w=majority

En caso de no existir se debe usar una BD local 'mongodb://localhost:27017/luisgagm'

Se agregan datos de prueba en la carpeta public para importar en caso de crear una nueva BD

Rutas
Productos:

GET ('/api/productos/') - lista de todos los productos existentes.

GET ('/api/productos/:id') - Retorna el producto con el id indicado. Si no existe devuelve mensaje del estado.

POST ('/api/productos/') - Inserta producto en la BD: se deben pasar por Body los siguientes campos: 'nombre' (obligatorio), 'precio' y 'thumbnail' (link con la foto del producto).(Disponible solo para perfil Administrador)

DELETE ('/api/productos/:id') - Borra de la BD el elemento con el id indicado. Devuelve lista actualizada de los productos disponibles.(Disponible solo para perfil Administrador)

PUT ('/api/productos/:id?nombre=dato&precio=dato2&thumbnail=dato3') - Permite modificar el registro con el id indicado. Se debe pasar por query params los datos a modificar (nombre, precio y/o thumbnail).(Disponible solo para perfil Administrador)

Carritos:

POST ('/api/carrito/') - Crea un carrito y devuelve su id

DELETE ('/api/carrito/:id') - Vacia el carrito y lo elimina

GET ('/api/carrito/:id/productos') - Permite listar todos los productos guardados en el carrito con el id indicado

POST ('/api/carrito/:id/productos') - Permite incorporar productos al carrito por id de producto

DELETE ('/api/carrito/:id/productos/:id_prod') - Elimina un producto del carrito por su id de carrito y de producto