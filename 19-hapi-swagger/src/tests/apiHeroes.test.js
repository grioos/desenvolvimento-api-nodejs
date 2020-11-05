const assert = require('assert')
const api = require('./../api')
let app = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'A mira'
}
let MOCK_ID = ''

describe('Suite de testes da API Heroes', () => {
    beforeEach(async () => {
        app = await api

        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)

        MOCK_ID = dados._id
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

    it('Listar /herois - deve retornar somente 3 registros', async () => {
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

    it('Listar /herois - deve filtrar pelo item', async () => {
        const NAME = MOCK_HEROI_INICIAL.nome
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=1000&nome=${NAME}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.deepStrictEqual(dados[0].nome === NAME)
    })

    it('Cadastrar POST - /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
        })
        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepStrictEqual(message, 'Heroi cadastrado com sucesso')
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

    it('Atualizar PATCH - /herois/:id - não deve atualizar com ID incorreto', async () => {
        const _id = `${MOCK_ID}01`
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
        assert.deepStrictEqual(dados.message, 'Não foi possivel atualizar')
    })

    it('Remover DELETE - /herois/:id', async () => {
        const _id = `${MOCK_ID}`
        const result = {
            method: 'DELETE',
            url: `/herois/${_id}`
        }
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Heroi removido com sucesso')
    })
})
