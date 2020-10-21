const util = require('util')
const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            return resolve({
                id: 1,
                nome: 'Aladin',
                dataNascimento: new Date()
            })
        }, 1000)
    })
}

function obterTelefone(idUsuario) {
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            return resolve({
                telefone: '90028922',
                ddd: 11
            })
        }, 2000)
    })
}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'Dos bobos',
            numero: 0
        })
    }, 3000);
}

function resolverUsuario(erro, usuario) {
    console.log('usuario', usuario)
}

const usuarioPromise = obterUsuario()

usuarioPromise
    .then(usuario => {
        return obterTelefone(usuario.id)
            .then(function resolverTelefone(resultaldo) {
                return {
                    usuario: {
                        nome: usuario.nome,
                        id: usuario.id
                    },
                    telefone: resultaldo
                }
            })
    })
    .then(resultado => {
        const endereco = obterEnderecoAsync(resultado.usuario.id)
        return endereco.then(function resolveEndereco(endereco) {
            return {
                usuario: resultado.usuario,
                telefone: resultado.telefone,
                endereco: endereco
            }
        })
    })
    .then(resultado => {
        console.log(`
            Nome: ${resultado.usuario.nome},
            Endereco: ${resultado.endereco.rua}, ${resultado.endereco.numero},
            Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
        `)
    })
    .catch(erro => {
        console.error('Deu ruim', erro)
    })

// obterUsuario(function resolverUsuario(erro, usuario) {
//     if (erro) {
//         console.error('Deu ruim em usuário', erro)
//         return
//     }

//     obterTelefone(usuario.id, function resolverTelefone(erro1, telefone) {
//         if (erro1) {
//             console.error('Deu ruim em telefone', erro1)
//             return
//         }

//         obterEndereco(usuario.id, function resolverEndereco(erro2, endereco) {
//             if (erro2) {
//                 console.error('Deu ruim em endereço', erro2)
//                 return
//             }

//             console.log(`
//                 Nome: ${usuario.nome},
//                 Endereço: ${endereco.rua}, ${endereco.numero},
//                 Telefone: (${telefone.ddd}) ${telefone.telefone}
//             `)
//         })
//     })
// })