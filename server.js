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


// CORROBORA SI EXISTE LA TABLA, SI NO EXISTE, LA CREA.
apiProdsSQL.crearTabla()
apiProdsSQL.ListarProds()
.then((prods)=> {
    console.log('Productos listados con exito');
    console.table(prods)
    SocketConnection(prods)
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

const SocketConnection = (productos) => {
    
    // CHAT CLIENTE SERVIDOR
    io.on('connection', socket => {
                
        console.log('Nuevo cliente conectado')
        
        //MSJ

        socket.emit('mensajes', apiMsjs.ListarMsjs())
    
        socket.on('nuevo-mensaje', data => {
    
            apiMsjs.guardarMsj(data)
    
            io.sockets.emit('mensajes', mensajesN)
        })
    
    
        //PRODS
    
        socket.emit('productos', productos)
    
        socket.on('nuevo-producto', (data) => {
    
           apiProdsSQL.guardarProd(data)

            io.sockets.emit('productos', )
    
        })
    
    });
}



//INICIAMOS EL SERVIDOR
// ----------------------------------------------|

const PORT = 8080

const srv = server.listen(PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ srv.address().port }` );
})

server.on( 'error', ( error ) => {
    console.log( `Error en servidor: ${error}` );
} )