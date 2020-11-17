const { deepStrictEqual } = require('assert')
const Database = require('./database')
const DEFAULT_ITEM_CADASTRAR = {
    nome: 'Flash',
    poder: 'Speed',
    id: 1
}
const DEFAULT_ITEM_ATUALIZAR = {
    nome: 'Laterna Verde',
    poder: 'Energia do Anel',
    id: 2
}

describe('Suite de manipulação de Herois', () => {
    before(async () => {
        await Database.remover()
        await Database.cadastrar(DEFAULT_ITEM_CADASTRAR)
        await Database.cadastrar(DEFAULT_ITEM_ATUALIZAR)
    })

    it('Deve pesquisar um heroi usando arquivos', async () => {
        const expected = DEFAULT_ITEM_CADASTRAR
        const [resultado] = await Database.listar(expected.id)

        deepStrictEqual(resultado, expected)
    })

    it('Deve cadastrar um heroi, usando arquivos', async () => {
        const expected = DEFAULT_ITEM_CADASTRAR

        await Database.cadastrar(DEFAULT_ITEM_CADASTRAR)

        const [atual] = await Database.listar(expected.id)

        deepStrictEqual(atual, expected)
    })

    it('Deve remover um heroi pelo id', async () => {
        const expected = true
        const resultado = await Database.remover(DEFAULT_ITEM_CADASTRAR.id)

        deepStrictEqual(resultado, expected)
    })

    it('Deve atualizar um heroi pelo id', async () => {
        const expected = {
            ...DEFAULT_ITEM_ATUALIZAR,
            nome: 'Batman',
            poder: 'Dinheiro'
        }

        const novoDado = {
            nome: 'Batman',
            poder: 'Dinheiro'
        }

        await Database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado)

        const [resultado] = await Database.listar(DEFAULT_ITEM_ATUALIZAR.id)

        deepStrictEqual(resultado, expected)
    })
})