const assert = require('assert')
const api = require('./../api')
let app = {}
let MOCK_ID, MOCK_NOME = ''

function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/herois',
        payload: {
            nome: 'Flash',
            poder: 'Velocidade'
        }
    })
}

describe('Suite de testes da API Heroes', () => {
    before(async () => {
        app = await api

        const result = await cadastrar()

        const dados = JSON.parse(result.payload)

        MOCK_ID = dados._id
        MOCK_NOME = dados.nome
    })

    it('Listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar - /herois - deve retornar somente 3 registros', async () => {
        const TAMANHO_LIMITE = 3
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })

    it('Listar - /herois - deve filtrar pelo nome', async () => {
        const NOME = MOCK_NOME
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=1000&nome=${NOME}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados[0].nome === NOME)
    })

    it('Cadastrar POST - /herois', async () => {
        const result = await cadastrar()

        assert.ok(result.statusCode === 200)
        assert.deepStrictEqual(JSON.parse(result.payload).nome, 'Flash')
    })

    it('Atualizar PATCH - /herois/:id', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Heroi atualizado com sucesso')
    })

    it('Atualizar PATCH - /herois/:id - não deve atualizar com id incorreto', async () => {
        const _id = `5f96f0a64b4ed29b7fd848f3`
        const expected = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Não foi possível atualizar')
    })

    it('Remover DELETE - /herois/:id', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${MOCK_ID}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.n, 1)
    })
})
