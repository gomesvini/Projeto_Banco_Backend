let { contas, depositos, saques, transferencias } = require("../bancodedados");
const { format } = require("date-fns");

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta) {
    return res.status(400).json({
      mensagem: "O número da conta é obrigatório!",
    });
  }

  if (!valor) {
    return res.status(400).json({
      mensagem: "O valor é obrigatório!",
    });
  }

  if (Number(valor) <= 0) {
    return res.status(400).json({
      mensagem: "O valor não pode ser igual ou inferior a zero!",
    });
  }

  const encontrarConta = contas.find((conta) => {
    return conta.numero === numero_conta;
  });

  if (!encontrarConta) {
    return res.status(404).json({
      mensagem: "Conta não encontrada!",
    });
  }

  encontrarConta.saldo += Number(valor);

  const registroDeposito = {
    data: format(new Date , 'dd-MM-yyyy HH:mm:ss'),
    numero_conta,
    valor: Number(valor)
  };

  depositos.push(registroDeposito);

  res.status(204).send();
};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta) {
    return res.status(400).json({
      mensagem: "O número da conta é obrigatório!",
    });
  };

  if (!valor) {
    return res.status(400).json({
      mensagem: "O valor é obrigatório!",
    });
  };

  if (!senha) {
    return res.status(400).json({
      mensagem: "A senha é obrigatório!",
    });
  };

  const encontrarConta = contas.find((conta) => {
    return conta.numero === numero_conta;
  });

  if (!encontrarConta) {
    return res.status(404).json({
      mensagem: "Conta não encontrada!",
    });
  };

  if(encontrarConta.usuario.senha !== senha){
    return res
    .status(400)
    .json({
        mensagem: 'Senha informada é inválida!'
    })
  };

  if(encontrarConta.saldo < Number(valor)){
    return res
    .status(400)
    .json({
        mensagem: 'Saldo insuficiente para o saque!'
    })
  };

  if(Number(valor) <= 0){
    return res
    .status(400)
    .json({
        mensagem: 'O valor não pode ser igual ou inferior a zero!'
    })
  };

  encontrarConta.saldo -= valor;

  const registroSaque = {
    data: format(new Date , 'dd-MM-yyyy HH:mm:ss'),
    numero_conta,
    valor: Number(valor)
  };

  saques.push(registroSaque);

  res.status(204).send();

};

const transferir = (req, res) => {
    const {
        numero_conta_origem, 
        numero_conta_destino,
        valor,
        senha
    } = req.body;

    if(!numero_conta_origem){
        return res
        .status(400)
        .json({
            mensagem: 'O número da conta de origem é obrigatório!'
        })
    };

    if(!numero_conta_destino){
        return res
        .status(400)
        .json({
            mensagem: 'O número da conta de destino é obrigatório!'
        })
    };

    if(!valor){
        return res
        .status(400)
        .json({
            mensagem: 'O valor é obrigatório!'
        })
    };

    if(!senha){
        return res
        .status(400)
        .json({
            mensagem: 'A senha é obrigatório!'
        })
    };

    const verificarContaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem
    });

    const verificarContaDestino = contas.find((conta) => {
        return conta.numero === numero_conta_destino
    });

    if(!verificarContaDestino || !verificarContaOrigem){
        return res
        .status(400)
        .json({
            mensagem: 'Conta não encontrada!'
        })
    };

    if(verificarContaOrigem.usuario.senha !== senha){
        return res
        .status(400)
        .json({
            mensagem: 'Senha informada é inválida!'
        })
    };

    if(verificarContaOrigem === verificarContaDestino){
      return res
      .status(400)
      .json({
        mensagem: 'Não é permitido transferência entre a mesma conta!'
      })
    };

    if(verificarContaOrigem.saldo < Number(valor)){
        return res
        .status(400)
        .json({
            mensagem: 'Saldo insuficiente!'
        })
    };


    verificarContaOrigem.saldo -= Number(valor);
    verificarContaDestino.saldo += Number(valor);

    const registroTransferencia = {
      data: format(new Date , 'dd-MM-yyyy HH:mm:ss'),
      numero_conta_origem,
      numero_conta_destino,
      valor: Number(valor)
    };
  
    transferencias.push(registroTransferencia);

    res.status(204).send();
};

module.exports = {
  depositar,
  sacar,
  transferir
};
