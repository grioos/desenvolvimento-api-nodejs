const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const Context = require('../db/strategies/base/contextStrategy')
const context = new Context(new Postgres())
const MOCK_HEROI_CADASTRAR = {
    nome: 'Gavião Negro',
    poder: 'Flexas'
}

describe('Postgres Strategy', () => {
    before(async () => {
        await context.connect()
    })

    it('PostgresSQL Connection', async () => {
        const result = await context.isConnected()

        assert.strictEqual(result, true)
    })

    it('cadastrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)

        delete result.id

        assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR)
    })
})
