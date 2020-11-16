const assert = require('assert')
const api = require('../api')
const Context = require('./../db/strategies/base/contextStrategy')
const PostGres = require('./../db/strategies/postgres/postgres')
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema')
const USER = {
    username: 'Xuxadasilva',
    password: '123'
}
const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$vE.8CM6KSMjepYZFLXxdU.f75JLucNvaXhYb8qWJ06Awl.OLHi0vG'
}
let app = {}

describe('Auth test suite', function () {
    this.timeout(Infinity)

    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await PostGres.connect()
        const model = await PostGres.defineModel(connectionPostgres, UsuarioSchema)
        const postgres = new Context(new PostGres(connectionPostgres, model))

        await postgres.update(null, USER_DB, true)
    })

    it('Deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })

    it('Deve retornar não autorizado ao tentar obter um login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'rios',
                password: '123'
            }
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepStrictEqual(statusCode, 401)
        assert.deepStrictEqual(dados.error, 'Unauthorized')
    })
})