const Joi = require('joi')
const Boom = require('boom')
const BaseRoute = require('./base/baseRoutes')
const failAction = (request, headers, error) => {
    throw error
}

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Deve listar herois',
                notes: 'Pode paginar resultados e filtrar por nome',
                validate: {
                    failAction,
                }
            },

            handler: (request, headers) => {
                try {
                    return this.db.read()
                } catch (error) {
                    console.log('Deu ruim', error)

                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar heroi',
                notes: 'Deve cadastrar heroi por nome e poder',
                validate: {
                    failAction,
                }
            },

            handler: (request, headers) => {
                try {
                    const result = request.payload

                    return this.db.create(result)
                } catch (error) {
                    console.log('Deu ruim', error)

                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar heroi',
                notes: 'Pode atualizar qualquer campo',
                validate: {
                    failAction,
                }
            },

            handler: (request, headers) => {
                try {
                    const payload = request.payload
                    const id = request.params.id

                    return this.db.update(id, payload)
                } catch (error) {
                    console.error('Deu ruim', error)

                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve remover heroi',
                notes: 'O id tem que ser valido',
                validate: {
                    failAction,
                }
            },

            handler: async request => {
                try {
                    const { id } = request.params

                    return this.db.delete(id)
                } catch (error) {
                    console.log('Deu ruim', error)

                    return Boom.internal()
                }
            }
        }

    }
}

module.exports = HeroRoutes