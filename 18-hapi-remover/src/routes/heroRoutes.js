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
                validate: {
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },

            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    const query = {
                        nome: {
                            $regex: `.*${nome}*.`
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
                validate: {
                    failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }
                }
            },

            handler: async request => {
                try {
                    const { nome, poder } = require.payload
                    const result = await this.db.create({ nome, poder })

                    return {
                        message: 'Heroi cadastrado com sucesso',
                        id: result.id
                    }
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
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            },

            handler: async request => {
                try {
                    const { id } = request.params
                    const { payload } = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this.db.update(id, dados)

                    if (result.nModified !== 1) {
                        return Boom.preconditionFailed('Id não foi encontrado no banco')
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
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },

            handler: async request => {
                try {
                    const { id } = request.params
                    const result = await this.db.delete(id)

                    if (result.n !== 1)
                        return {
                            message: Boom.preconditionFailed('Id não foi encontrado no banco')
                        }

                    return {
                        message: 'Heroi removido com sucesso'
                    }
                } catch (error) {
                    console.log('Deu ruim', error)

                    return Boom.internal()
                }
            }
        }

    }
}

module.exports = HeroRoutes