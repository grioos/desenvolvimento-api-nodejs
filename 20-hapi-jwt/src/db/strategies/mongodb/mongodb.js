const ICrud = require('./../interfaces/interfaceCrud')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando'
}

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._schema = schema
        this._connection = connection
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]

        if (state === 'Conectado') return state

        if (state === 'Connectando') return state

        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]
    }

    static connect() {
        Mongoose.connect('mongodb://grios:secreta@localhost:27017/herois',
            { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
                if (!error) return

                console.log('Falha na conexão', error)
            })

        const connection = Mongoose.connection
        connection.once('open', () => console.log('Database rodando'))

        return connection
    }

    create(item) {
        return this._schema.create(item)
    }

    read(item) {
        return this._schema.find(item)
    }

    update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item })
    }

    delete(id) {
        return this._schema.deleteOne({ _id: id })
    }
}

module.exports = MongoDB