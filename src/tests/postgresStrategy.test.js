const assert = require('assert')
const Postgres = require('./../db/strategies/postgres/postgres')
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroiSchema')
const Context = require('../db/strategies/base/contextStrategy')
const MOCK_HEROI_CADASTRAR = {
    nome: 'Gavião Negro',
    poder: 'Flexas'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}
let context = {}

describe('Postgres Strategy', () => {
    before(async () => {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroiSchema)

        context = new Context(new Postgres(connection, model))
    })

    it('PostgresSQL Connection', async () => {
        const result = await context.isConnected()

        assert.strictEqual(result, true)
    })

    it('Cadastrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)

        delete result.id

        assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('Listar', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })

        delete result.id

        assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('Atualizar', async () => {
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })
        const [result] = await context.update(itemAtualizar.id, MOCK_HEROI_ATUALIZAR)
        const [itemAtualizado] = result === 1 ? await context.read({ id: itemAtualizar.id }) : null

        if (itemAtualizado) delete itemAtualizado.id

        assert.deepStrictEqual(itemAtualizado, MOCK_HEROI_ATUALIZAR)
    })

    it('Remover por id', async () => {
        const [item] = await context.read({})
        const result = await context.delete(item.id)

        assert.deepStrictEqual(result, 1)
    })
})
