const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const BaseRoute = require('./base/baseRoutes')
const failAction = (request, headers, error) => {
    throw error
}
const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

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
                    headers,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                }
            },

            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    const query = {
                        nome: {
                            $regex: `.*${nome}.*`
                        }
                    }

                    return this.db.read(nome ? query : {}, skip, limit)
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
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }
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
                    params: {
                        id: Joi.string().required()
                    },
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            },

            handler: async (request, headers) => {
                try {
                    const { id } = request.params;
                    const { payload } = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this.db.update(id, dados)

                    if (result.nModified !== 1) return {
                        message: 'Não foi possível atualizar'
                    }

                    return {
                        message: 'Heroi atualizado com sucesso'
                    }
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
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
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