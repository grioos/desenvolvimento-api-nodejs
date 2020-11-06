const ContextSrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb')
const Postgres = require('./db/strategies/postgres')

const contextMongo = new ContextSrategy(new MongoDB())
contextMongo.create()

const contextPostgres = new ContextSrategy(new Postgres())
contextPostgres.create()
