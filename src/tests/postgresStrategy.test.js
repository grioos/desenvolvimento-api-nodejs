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
        const [result] = await context.read()
        const novoItem = {
            ...MOCK_HEROI_CADASTRAR,
            nome: 'Mulher Maravilha',
        }
        const [update] = await context.update(result.id, novoItem);

        assert.deepStrictEqual(update, 1)
    })

    it('Remover por id', async () => {
        const [item] = await context.read({})
        const result = await context.delete(item.id)

        assert.deepStrictEqual(result, 1)
    })
})
