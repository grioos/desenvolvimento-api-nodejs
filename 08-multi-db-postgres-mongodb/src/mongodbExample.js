const Mongoose = require('mongoose')

connection.once('open', () => console.log('Database rodando!'))

const state = connection.readyState

console.log('state', state)

const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },

    poder: {
        type: String,
        required: true
    },

    insertedAt: {
        type: Date,
        dafault: new Date()
    }
})

const model = Mongoose.model('herois', heroiSchema)

async function main() {
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })

    console.log('Result cadastrar', resultCadastrar)

    const listItens = await model.find()

    console.log('Items', listItens)
}

main()