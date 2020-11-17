const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const Jwt = require('jsonwebtoken')
const BaseRoute = require('./base/baseRoutes')
const PasswordHelper = require('./../helpers/passwordHelper')
const failAction = (request, headers, error) => {
    throw error
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.db = db
        this.secret = secret
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com user e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },

            handler: async (request, headers) => {
                const { username, password } = request.payload
                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })

                if (!usuario) {
                    return Boom.unauthorized('O usuario informado não existe')
                }

                const match = await PasswordHelper.comparePassword(password, usuario.password)

                if (!match) {
                    return Boom.unauthorized('O usuario ou senha invalidos')
                }

                const token = Jwt.sign({
                    username: username,
                    id: usuario.id
                }, this.secret)

                return {
                    token
                }
            }
        }
    }
}

module.exports = AuthRoutes