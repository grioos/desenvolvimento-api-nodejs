const assert = require('assert')
const api = require('./../api')
let app = {}
let MOCK_ID = ''

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

    it('Cadastrar POST - /herois', async () => {
        const result = await cadastrar()

        assert.ok(result.statusCode === 200)
        assert.deepStrictEqual(JSON.parse(result.payload).nome, 'Flash')
    })

    it('Atualizar PATCH - /herois/:id', async () => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_ID}`,
            payload: {
                nome: 'Canário Negro',
                poder: 'Grito'
            }
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.nModified, 1)
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
