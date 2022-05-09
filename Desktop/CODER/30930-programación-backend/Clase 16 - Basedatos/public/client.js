const socket = io.connect();

console.log('Cliente ok');

socket.on('nuevoProducto', (productos) => {
//   alert('se agrego un producto')
    const html=generarHtml(productos)
    const listaProductos = document.getElementById('listaProd');
    listaProductos.innerHTML= "";
    listaProductos.innerHTML= html;
});


const formProd = document.getElementById('form');
const nombre = document.getElementById('name');
const precio = document.getElementById('precio');
const thumbnail = document.getElementById('thumbnail');
const fromChat = document.getElementById('formChat');
const email = document.getElementById('email');
const mensaje = document.getElementById('mensaje');
const listaMensajes = document.getElementById('listaMensajes');
const botonEnviar = document.getElementById('enviarMensaje');

const generarHtml = (productos) => {
    console.log(productos)
    if (productos.length==0){ 
        return('<H3 class="ms-4 mt-5">No hay productos</H3>')
    }else{
        let htmlProds=''
        productos.productos.forEach((prod) => {
            htmlProds=htmlProds+(
                `<tr>
                    <td class="fs-5">${prod.id}</td> 
                    <td class="fs-5">${prod.nombre}</td> 
                    <td class="fs-5">$${prod.precio}</td> 
                    <td>
                        <img class="img-thumbnail" src=${prod.thumbnail} alt="${prod.nombre}">
                    </td>
                </tr>`
            )
            return htmlProds
        })
        return(`
            <table class="table table-dark table-striped ms-5 px-2 mt-5 align-middle" style="width:40%;">
                <tbody>
                    <tr>
                        <th class="fs-4" id="title">TITULO</th>
                        <th class="fs-4" id="precio">PRECIO</th>  
                        <th class="fs-4" id="thumbnail">TAPA</th>
                    </tr>
                        ${htmlProds}
                </tbody>
            </table>`
        );
    };
};



fromChat.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (email.value=="" || mensaje.value==""){
        alert("DEBE INGRESAR UN EMAIL VALIDO Y UN MENSAJE PARA CONTINUAR")
    }else{
        const objMensaje={
            email: email.value,
            mensaje: mensaje.value,
            fecha: `[${luxon.DateTime.now().toFormat('dd/MM/yyyy HH:mm:ss')}]`
        }
        mensaje.value='';
        socket.emit('nuevoMensaje', objMensaje);
    }
})


formProd.addEventListener('submit', async (e) => {
    try{
        e.preventDefault();
        const response = await fetch('/api/productos', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                nombre: nombre.value,
                precio: precio.value,
                thumbnail: thumbnail.value
            })
        })
 
        nombre.value='';
        precio.value='';
        thumbnail.value='';
        socket.emit('altaProducto');

    }
    catch(err){
        console.log(err);
    }
    console.log('altaProducto')
});

const renderChat= (data)=> {
    console.log('datachat', data);
    const html = data
      .map((elem, index)=>{
        return `<p style="color: brown">
                   <strong style="color: blue"> ${elem.email} </strong> ${elem.fecha} <em style="fontstyle: italyc; color: green">${elem.mensaje}</em>
          </p>`;
      })
      ; 
    listaMensajes.innerHTML = html;
    listaMensajes.scrollTop = listaMensajes.scrollHeight;
}

socket.on('listaMensajes', (data)=>{
  console.log('RECIBI MENSAJE');
  renderChat(data);
});

const formProdVacio= document.getElementById('formProdVacio');

formProdVacio.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('importProductos');
});