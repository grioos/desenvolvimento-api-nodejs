const { obterPessoas } = require('./service')

Array.prototype.meuFilter = function (callback) {
    const lista = []

    for (indice in this) {
        const item = this[indice]
        const resultado = callback(item, indice, this)

        if (!resultado) continue

        lista.push(item)
    }

    return lista
}

async function main() {
    try {
        const { results } = await obterPessoas(`a`)

        const familiaLars = results.meuFilter((item, indice, lista) => {
            console.log(`Índice: ${indice}`, lista.length)

            return item.name.toLowerCase().indexOf('lars') !== -1
        })

        const names = familiaLars.map(pessoa => pessoa.name)
        console.log(names)
    } catch (erro) {
        console.error('Deu ruim', erro)
    }
}

main()