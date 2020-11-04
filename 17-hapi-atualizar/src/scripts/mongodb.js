docker ps
docker exec - it 394b84fbd66b
mongo - u grios - p password--authenticationDatabase herois

show dbs

use herois

show collections

db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.herois.find()
db.herois.find().pretty()

for (let i = 0; 1 <= 1000; i++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '19-01-01'
    })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({ nome: -1 })
db.herois.find({}, { poder: 1, _id: 0 })

db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.herois.find()

db.herois.update(
    { _id: ObejectId('5f96ef334b4ed29b7fd848f5') },
    { nome: 'Mulher Maravilha' }
)

db.herois.update(
    { poder: 'Velocidade' },
    { $set: { poder: 'super força' } }
)

db.herois.remove({})
db.herois.remove({ nome: 'Mulher Maravilha' })