const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const app = new Hapi.Server({
    port: 5000
})

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroSchema))

    app.route([{
        path: '/herois',
        method: 'GET',
        handler: (request, head) => {
            return context.read()
        }
    }])

    await app.start()
    console.log('Servidor rodando na porta', app.info.port)
}

main()