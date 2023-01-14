import knexLib from 'knex'

class ApiProdsSQL {

    constructor(config){
        this.knex = knexLib(config)
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists('productos')
            .finally(() => {
                return this.knex.schema.createTable('productos', table => {
                    table.increments('id').primary();
                    table.string('title', 50).notNullable();
                    table.string('thumbnail', 1000).notNullable();
                    table.float('price');
                })
            })
    }

    ListarProds(){
        return this.knex('productos').select('*');
    }

    guardarProd( newProd ){
        return this.knex('productos').insert(newProd)
    }

    close() {
        this.knex.destroy();
    }

}

export default ApiProdsSQL