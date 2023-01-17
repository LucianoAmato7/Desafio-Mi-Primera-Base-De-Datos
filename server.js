import express from "express";
import ApiProdsSQL from "./api/productos.js";
import ApiMsjSQL from './api/mensajes.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import { createServer } from 'http';


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

const apiProdsSQL = new ApiProdsSQL()

const apiMsjSQL = new ApiMsjSQL()



//BASE DE DATOS
// ----------------------------------------------|

//PRODUCTOS - MariaDB
// CORROBORA SI EXISTE LA TABLA "PRODUCTOS", SI NO EXISTE, LA CREA.
apiProdsSQL.crearTablaProds()


//MENSAJES - SQLite3
// CORROBORA SI EXISTE LA TABLA "MENSAJES", SI NO EXISTE, LA CREA.
apiMsjSQL.crearTablaMsj()


//FUNCIONALIDADES
// ----------------------------------------------|


app.get('/', (req, res) => {
    res.render('formulario')
});

    
        
io.on('connection', socket => {
            
    console.log('Nuevo cliente conectado')
    
    //MSJS

    apiMsjSQL.ListarMsjs().then((msjs)=>{

        socket.emit('mensajes', msjs)

    })


    socket.on('nuevo-mensaje', data => {

        apiMsjSQL.guardarMsj(data)
        .then(()=>{

            console.log('Mensaje cargado en la base de datos');
            return apiMsjSQL.ListarMsjs()

        }).then((prods)=>{

            io.sockets.emit('mensajes', prods)
            console.log('Vista de mensajes actualizada');

        })

    })



    //PRODS

    apiProdsSQL.ListarProds().then((prods)=>{

        socket.emit( 'productos', prods)
        
    })

    socket.on('nuevo-producto', (data) => {

        
        apiProdsSQL.guardarProd(data)
        .then(()=>{

            console.log('Producto cargado en la base de datos');
            return apiProdsSQL.ListarProds()

        }).then((prods)=>{

            io.sockets.emit('productos', prods)
            console.log('Vista de productos actualizada');

        })

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