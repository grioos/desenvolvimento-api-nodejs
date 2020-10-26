const Mongoose = require('mongoose')

connection.once('open', () => console.log('Database rodando!'))

const state = connection.readyState

console.log('state', state)


async function main() {

    const listItens = await model.find()

    console.log('Items', listItens)
}

main()