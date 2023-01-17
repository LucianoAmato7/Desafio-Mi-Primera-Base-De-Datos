let socket = io.connect();

// VISTA DE PRODUCTOS

socket.on('productos', data => {

    if(data) {

        document.getElementById('vistaContainer').innerHTML =`
        <div class="table-responsive">
            <table class="table table-dark">
                <tr class="text-white fw-bold"> 
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                </tr>
                ${data.map( prod =>
                    `<tr>
                        <td class="align-middle">${prod.id}</td>
                        <td class="align-middle">${prod.title}</td>
                        <td class="align-middle">${prod.price}</td>
                        <td class="align-middle">
                            <img src=${prod.thumbnail} style="width: 80px">
                        </td>
                    </tr>`
                )}
            </table>
        </div>`;

    } else {

        document.getElementById('vistaContainer').innerHTML = '<h3 class="alert alert-danger">No se encontraron productos</h3>'

    }

});

function AddProducto(e){
    const productoN = {
        title: document.getElementById('nombre').value,
        price: document.getElementById('Precio').value,
        thumbnail: document.getElementById('URLImagen').value
    }
    socket.emit('nuevo-producto', productoN);
    return false;
}


// CENTRO DE MENSAJES

socket.on('mensajes', data => {
    document.getElementById('contenedorMsj').innerHTML = data.map( msj => 
        `<span class="text-primary"><strong>${msj.email}</strong></span>
        <span class="text-danger">[ ${msj.fyh} ]</span>: 
        <span class="text-success fst-italic">${msj.mensaje}</span>`
    ).join('<br>')
})

function AddMensaje(e) {
    const mensaje = {
        email: document.getElementById('enviarEmail').value,
        fyh: new Date().toLocaleString(),
        mensaje: document.getElementById('enviarMsj').value
    }
    socket.emit('nuevo-mensaje', mensaje);
    return false;
}