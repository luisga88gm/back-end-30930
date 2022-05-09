Clase 16 - Nuestra primera base de datos

El proyecto usa 2 bases de datos:

SQLite para los chats ubicada en la carpeta '/src/db'. nombre del archivo 'ecommerce.sqlite'. En caso de no existir la aplicacion la crea.

MariaDB para los productos. La BD se debe llamar ecommerce y comunicarse por el puerto 3306. Para mas detalles ver archivo '/options/mariaDB'
En todos los casos en caso de no existir las tablas correspondientes a chats y productos se crean en el inicio del proyecto.

Para el caso de los productos, en el caso de no haber ninguno, se habilita en el front un "boton" para importar datos y crear registros por script.

Rutas
GET ('localhost:8080/' - 'localhost:8080/api/') - Renderiza el formulario de alta de productos, con todos los productos existentes y el chat

GET ('localhost:8080/api/productos/') - Renderiza lista de todos los productos existentes.

GET ('localhost:8080/api/productos/:id') - Retorna el producto con el id indicado. Si no existe devuelve mensaje del estado.

POST ('localhost:8080/api/productos/') - Inserta producto en la BD: se deben pasar por Body los siguientes campos: 'nombre' (obligatorio), 'precio' y 'thumbnail' (link con la foto del producto).

DELETE ('localhost:8080/api/productos/:id') - Borra de la BD el elemento con el id indicado. Devuelve lista actualizada de los productos disponibles.

PUT ('localhost:8080/api/productos/:id?nombre=dato&precio=dato2&thumbnail=dato3') - Permite modificar el registro con el id indicado. Se debe pasar por query params los datos a modificar (nombre, precio y/o thumbnail)