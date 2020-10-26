const assert = require('assert')
const MongoDb = require('./../db/strategies/mongodb')
const Context = require('./../db/strategies/base/contextStrategy')
const { read } = require('fs')
const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}
const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super Teia'
}
const context = new Context(new MongoDb())

describe('MongoDB Suite de Testes', function () {
    before(async () => {
        await context.connect()
    })

    it('verificar conexao', async () => {
        const result = await context.isConnected()

        assert.deepStrictEqual(result, expected)
    })

    it('cadastrar', async () => {
        const { nome, poder } = await context.create()

        assert.deepStrictEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
        const result = { nome, poder }

        assert.deepStrictEqual(result, MOCK_HEROI_DEFAULT)
    })
})