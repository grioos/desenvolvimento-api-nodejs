const Mongoose = require('mongoose')
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

module.exports = Mongoose.model('herois', heroiSchema)