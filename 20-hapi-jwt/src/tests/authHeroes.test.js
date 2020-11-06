const assert = require('assert')
const api = require('../api')
let app = {}

describe.only('Auth test suite', () => {
    before(async () => {
        app = await api
    })

    it('Deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'Xuxadasilva',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })
})