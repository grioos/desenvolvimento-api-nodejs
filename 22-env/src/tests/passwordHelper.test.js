const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')
const SENHA = 'Rios@321321321'
const HASH = '$2b$04$KouRVm4KJVzdIxbwblft1eNyd.zX3HFbkVKcppcZnkFSSu7X03BBy'

describe('Suite de testes UserHelper', () => {
    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)

        assert.ok(result.length > 10)
    })

    it('Deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)

        assert.ok(result)
    })
})