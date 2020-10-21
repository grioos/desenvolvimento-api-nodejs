const { obterPessoas } = require('./service')

Array.prototype.meuReduce = function (callback, valorInicial) {
    let valorFinal = typeof valorInicial !== undefined ? valorInicial : this[0]

    for (let indice = 0; indice <= this.length - 1; indice++) {
        valorFinal = callback(valorFinal, this[indice], this)
    }

    return valorFinal
}
async function main() {
    try {
        const { results } = await obterPessoas(`a`)
        const pesos = results.map(item => parseInt(item.height))

        console.log('Pesos', pesos)

        // const total = pesos.reduce((anterior, proximo) => {
        //     return anterior + proximo
        // })

        const minhaLista = [
            ['Erick', 'Wendel'],
            ['NodeBR', 'Nerdzão']
        ]
        const total = minhaLista.meuReduce((anterior, proximo) => {
            return anterior.concat(proximo)
        }, [])
            .join(', ')

        console.log('Total', total)
    } catch (erro) {
        console.error('Deu ruim', erro)
    }
}

main()