import express from "express";
import ApiProdsSQL from "./api/productos.js";
import ApiMsj from "./api/mensajes.js";
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import { createServer } from 'http';
import optionsMariaDB from './options/mariaDB.js'

const app = express()
const server = createServer(app); 
const io = new Server(server);


app.use(express.urlencoded({extended: true}));

app.engine(
    "hbs",
    handlebars({
        extname: "*.hbs",
        defaultLayout: "index.hbs",
    })
);

app.set('view engine', "hbs");
app.set("views", "./views");

app.use(express.static('views/layouts'));

const apiProdsSQL = new ApiProdsSQL(optionsMariaDB)

const apiMsjs = new ApiMsj()

let mensajesN = apiMsjs.ListarMsjs()


//BASE DE DATOS
// ----------------------------------------------|

apiProdsSQL.crearTabla()
.then(() => {
    console.log("Tabla creada")

    const articulos = [
        {
        title: "Iphone 14 Pro Max", 
        price: 1650, 
        thumbnail: "https://i.ibb.co/KGKjZBG/i14-Pro-Max.png",
        id: 1
        }
    ]
    return apiProdsSQL.guardarProd(articulos)
})
.then(() => {
   console.log("Articulos insertados con exito");
    return apiProdsSQL.ListarProds();
})
.then(productos => {

    console.log("Articulos listados")
    console.table(productos)

})
.catch((err) => { console.log(err); throw err})
.finally(() => {
    apiProdsSQL.close()
})


//FUNCIONALIDADES
// ----------------------------------------------|


app.get('/', (req, res) => {
    res.render('formulario')
});


// CHAT CLIENTE SERVIDOR
io.on('connection', socket => {
            
    console.log('Nuevo cliente conectado')
    
    socket.emit('mensajes', apiMsjs.ListarMsjs())

    socket.on('nuevo-mensaje', data => {

        apiMsjs.guardarMsj(data)

        io.sockets.emit('mensajes', mensajesN)
    })

    //PRODS

    //VER SI DEVUELVE PROMESA

    socket.emit('productos', )

    socket.on('nuevo-producto', data => {

        //VER SI DEVUELVE PROMESA
        apiProdsSQL.guardarProd(data)

        console.log('Producto Guardado');

        //VER SI DEVUELVE PROMESA
        io.sockets.emit('productos', () => {apiProdsSQL.ListarProds()})

    })

});


//INICIAMOS EL SERVIDOR
// ----------------------------------------------|

const PORT = 8080

const srv = server.listen(PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ srv.address().port }` );
})

server.on( 'error', ( error ) => {
    console.log( `Error en servidor: ${error}` );
} )