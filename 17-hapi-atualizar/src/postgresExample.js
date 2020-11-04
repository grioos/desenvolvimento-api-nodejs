const Sequelize = require('sequelize')

async function main() {

    await Herois.create({
        nome: 'Laterna Verde',
        poder: 'Anel'
    })

    const result = await Herois.findAll({
        raw: true
    })

    console.log('result', result)
}

main()