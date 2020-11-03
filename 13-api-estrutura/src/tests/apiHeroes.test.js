const assert = require('assert')
const api = require('./../api')
let app = {}

describe.only('SUite de testes da API Heroes', () => {
    before(async () => {
        app = await api
    })

    it('Listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        console.log('Result', result)

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
})