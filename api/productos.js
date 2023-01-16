import knexLib from 'knex'
import optionsMariaDB from '../options/mariaDB.js'

class ApiProdsSQL {

    constructor(){
        this.knex = knexLib(optionsMariaDB)
    }


    crearTablaProds(){

        this.knex.schema.hasTable('productos')
        .then((resp)=>{
            Existe(resp)
        })
        
        const Existe = (existe) => {
            if(existe){
                console.log('La tabla productos ya existe');
                return this.knex('productos').select('*')
            }else {
                console.log('La tabla productos no existe y se procede a ser creada');
                this.knex.schema.createTable('productos', table => {
                    table.increments('id').primary();
                    table.string('title', 50).notNullable();
                    table.string('thumbnail', 1000);
                    table.float('price');
                }).then(()=> {
                    console.log('tabla creada');
                    const productos = [
                        {
                            title: "Iphone 14 Pro Max", 
                            price: 1650, 
                            thumbnail: "https://i.ibb.co/KGKjZBG/i14-Pro-Max.png",
                            id: 1
                        }
                    ]
                    return this.knex('productos').insert(productos)
                }).then(()=> {
                    console.log("Productos insertados con exito");
                    return this.knex('productos').select('*')
                }).catch((err) => { console.log(err); throw err})
                .finally(() => {
                    this.knex.destroy()
                })
                
            }
        }  
        
    }
        

    ListarProds(){
        
        this.knex('productos').select('*')
        .then((prods) => { return prods })
        .catch((err) => { console.log(err); throw err})
        .finally(() => {
            this.knex.destroy()
        })
    
    }

    guardarProd( newProd ){
        this.knex('productos').insert(newProd)
        .then(() => {return console.log('Producto Cargado');})
        .catch((err)=> {err})
        .finally(()=> {
            this.knex.destroy();
        })
    }

}

export default ApiProdsSQL