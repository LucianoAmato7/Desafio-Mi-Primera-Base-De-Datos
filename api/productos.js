import knexLib from 'knex'

class ApiProdsSQL {

    constructor(config){
        this.knex = knexLib(config)
    }



    crearTabla(){

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
                })
                
            }
        }  
        
    }
        

    ListarProds(){
        return this.knex('productos').select('*');
    }

    guardarProd( newProd ){
        return this.knex('productos').insert(newProd)
    }

    close() {
        return this.knex.destroy();
    }

}

export default ApiProdsSQL