const express = require('express');
const validacao = require('./intermediarios');
const { 
    listarContasBancarias, 
    criarContasBancarias, 
    atualizarUsuarioContaBancaria,
    excluirConta,
    saldo,
    extrato
} = require('./controladores/contas');

const { 
    depositar, 
    sacar, 
    transferir
} = require('./controladores/transacoes');

const rota = express();

rota.get('/contas', validacao, listarContasBancarias);
rota.post('/contas', criarContasBancarias);
rota.put('/contas/:numeroConta/usuario', atualizarUsuarioContaBancaria);
rota.delete('/contas/:numeroConta', excluirConta);
rota.get('/contas/saldo', saldo);
rota.get('/contas/extrato', extrato);

rota.post('/transacoes/depositar', depositar);
rota.post('/transacoes/sacar', sacar);
rota.post('/transacoes/transferir', transferir);

module.exports = rota;