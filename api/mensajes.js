import knexLib from 'knex'
import optionsSQLite3 from '../options/SQLite3.js'

class ApiMsjSQL {

    constructor() {
        this.knex = knexLib(optionsSQLite3)
    }
    

    crearTablaMsj(){

        this.knex.schema.hasTable('mensajes')
        .then((resp)=>{
            Existe(resp)
        })
        
        const Existe = (existe) => {
            if(existe){
                console.log('La tabla mensajes ya existe');
                return this.knex('mensajes').select('*')
            }else {
                console.log('La tabla mensajes no existe y se procede a ser creada');
                this.knex.schema.createTable('mensajes', table => {
                    table.string('email', 100);
                    table.string('fyh', 50);
                    table.string('mensaje', 500);
                })
                .then(()=> {
                    console.log('tabla creada con exito');
                    return this.knex('mensajes').select('*')
                }).catch((err) => { console.log(err); throw err})
                .finally(() => {
                    this.knex.destroy()
                })
                
            }
        }  
        
    }
    
    ListarMsjs(){

        return this.knex('mensajes').select('*')
        
    }
    
    guardarMsj( data ) {

        this.knex('mensajes').insert(data)
        .then(()=>{
            console.log('msj guardado');
        })
    
    }

    close() {
        return this.knex.destroy();
    }
}


export default ApiMsjSQL