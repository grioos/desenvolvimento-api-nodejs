const assert = require('assert')
const MongoDB = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')
const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laco'
}
const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super Teia'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Velocidade'
}
let MOCK_HEROI_ID = ''
let context = {}

describe('MongoDB Suite de Testes', function () {
    this.timeout(Infinity)

    this.beforeAll(async () => {
        const connection = MongoDB.connect()

        context = new Context(new MongoDB(connection, HeroiSchema))

        const result = await context.create(MOCK_HEROI_DEFAULT)

        MOCK_HEROI_ID = result._id
    })

    it('Verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'

        assert.deepStrictEqual(result, expected)
    })

    it('Cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)

        assert.deepStrictEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('Listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
        const result = { nome, poder }

        assert.deepStrictEqual(result, MOCK_HEROI_DEFAULT)
    })

    it('Atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: MOCK_HEROI_ATUALIZAR.nome,
            poder: MOCK_HEROI_ATUALIZAR.poder
        })

        assert.deepStrictEqual(result.nModified, 1)
    })

    it('Remover', async () => {
        const result = await context.delete(MOCK_HEROI_ID)

        assert.deepStrictEqual(result.n, 1)
    })
})