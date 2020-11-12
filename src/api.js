const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')
const env = process.env.NODE_ENV || 'dev'

ok(env === 'prod' || env == 'dev', 'A env é invalida, ou dev ou prod')

const configPath = join(__dirname, './config', `.env.${env}`)

config({
    path: configPath
})

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const Joi = require('joi')
const HapiJwt = require('hapi-auth-jwt2')
const Jwt = require('jsonwebtoken')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const Postgres = require('./db/strategies/postgres/postgres')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')
const HeroRoutes = require('./routes/heroRoutes')
const AuthRoutes = require('./routes/authRoutes')
const JWT_SECRET = process.env.JWT_KEY
const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))
    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        }
    }

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        validate: async (dados, request) => {

            return {
                isValid: true
            }
        }
    })

    app.validator(Joi)
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
    ])
    await app.start()

    console.log('Servidor rodando na porta', app.info.port)

    return app
}

module.exports = main()