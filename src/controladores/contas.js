let { 
  contas, 
  depositos, 
  saques, 
  transferencias 
} = require("../bancodedados");

let id = 3;

function validacaoCorpo(nome, cpf, data_nascimento, telefone, email,senha) {

  if (!nome) {
    return res.status(400).json({ mensagem: "O Nome é obrigátorio" });
  }

  if (!cpf) {
    return res.status(400).json({ mensagem: " O CPF é obrigátorio" });
  }

  if (!data_nascimento) {
    return res
      .status(400)
      .json({ mensagem: "A data de nascimento é obrigátorio" });
  }

  if (!telefone) {
    return res.status(400).json({ mensagem: "O telefone é obrigátorio" });
  }

  if (!email) {
    return res.status(400).json({ mensagem: "O e-mail é obrigátorio" });
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "A senha é obrigátorio" });
  };
};

function validacaoParametro(numeroConta){
  if(isNaN(numeroConta) || Number(numeroConta) <= 0){
    return res
    .status(400)
    .json({
      mensagem: 'Número da conta informado é inválido!'
    })
  };
};

const listarContasBancarias = (req, res) => {
  res.json(contas);
};

const criarContasBancarias = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  validacaoCorpo(nome,cpf, data_nascimento, telefone, email, senha);

  for(let conta of contas){
    if(conta.usuario.cpf === cpf){
      return res
      .status(400)
      .json({
        mensagem: 'Já existe uma conta com o CPF informado!'
      })
    }

    if(conta.usuario.email === email){
      return res
      .status(400)
      .json({
        mensagem: 'Já existe uma conta com o E-mail informado!'
      })
    }
      
  }
  
  let novaConta = {
    numero: String(id++),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha
    }    
  };  

  contas.push(novaConta);
  res.status(201).send();

};

const atualizarUsuarioContaBancaria = (req, res) => {
  const {numeroConta} = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  

  const conta = contas.find((conta) => {
    return conta.numero === numeroConta
  });
  
  if(!conta){
    return res
    .status(404)
    .json({
      mensagem: 'Conta não encontrada'
    })
  };

 
  validacaoCorpo(nome, cpf, data_nascimento, telefone, email,senha);
  validacaoParametro(numeroConta);

  for(let conta of contas){
    if(conta.usuario.cpf === cpf){
      return res
      .status(400)
      .json({
        mensagem: 'O CPF informado já existe cadastrado!'
      })
    }

    if(conta.usuario.email === email){
      return res
      .status(400)
      .json({
        mensagem: 'O E-mail informado já existe cadastrado!'
      })
    }      
  };

  conta.usuario.nome = nome;
  conta.usuario.cpf = cpf;
  conta.usuario.data_nascimento = data_nascimento;
  conta.usuario.telefone = telefone;
  conta.usuario.email = email;
  conta.usuario.senha = senha;

  res.status(204).send();
};

const excluirConta = (req, res) => {
  const {numeroConta} = req.params;
 
  const encontrarConta = contas.find((conta) => {
    return conta.numero === numeroConta
  });


  if(!numeroConta){
    return res
    .status(400)
    .json({
      mensagem: 'Número da conta é obrigatório!'
    })
  }

  if(!encontrarConta){
    return res
    .status(404)
    .json({
      mensagem: 'Conta não encontrada!'
    })
  };

  if(encontrarConta.saldo !== 0 ){
    return res
    .status(404)
    .json({
      mensagem: 'A conta só pode ser removida se o saldo for zero'
    })
  }
  ;
  contas = contas.filter((conta) => {
    return conta.numero !== numeroConta
  });

  return res.status(204).send()

};

const saldo = (req, res) => {
  const {numero_conta, senha} = req.query;

  if(!numero_conta){
    return res
    .status(400)
    .json({
      mensagem: 'Número da conta é obrigatório!'
    })
  };

  if(!senha){
    return res
    .status(400)
    .json({
      mensagem: 'Senha é obrigatório!'
    })
  };

  const verficarConta = contas.find((conta) => {
    return conta.numero === numero_conta
  });


  if(!verficarConta){
    return res
    .status(404)
    .json({
      mensagem: 'Conta bancária não encontrada!'
    })
  };

  if(verficarConta.usuario.senha !== senha){
    return res
    .status(404)
    .json({
      mensagem: 'Senha informada é inválida!'
    })
  };

  res.status(200).json({saldo:Number(verficarConta.saldo)})
};

const extrato = (req, res) => {
  const {numero_conta, senha} = req.query;

  if(!numero_conta){
    return res
    .status(400)
    .json({
      mensagem: 'Número da conta é obrigatório!'
    })
  };

  if(!senha){
    return res
    .status(400)
    .json({
      mensagem: 'Senha é obrigatório!'
    })
  };

  const verficarConta = contas.find((conta) => {
    return conta.numero === numero_conta
  });


  if(!verficarConta){
    return res
    .status(404)
    .json({
      mensagem: 'Conta bancária não encontrada!'
    })
  };

  if(verficarConta.usuario.senha !== senha){
    return res
    .status(404)
    .json({
      mensagem: 'Senha informada é inválida!'
    })
  };

  const extratoDepositos =  depositos.filter((deposito) => {
    return deposito.numero_conta === numero_conta
  });

  const extratoSaques =  saques.filter((saque) => {
    return saque.numero_conta === numero_conta
  });

  const extratoTransferencias =  transferencias.filter((transferencia) => {
    return transferencia.numero_conta_origem === numero_conta || transferencia.numero_conta_destino === numero_conta
  });

  res.status(200).json({
    depositos: extratoDepositos,
    saques: extratoSaques,
    transferencia: extratoTransferencias,
    saldo: Number(verficarConta.saldo)
  });
};



module.exports = {
  listarContasBancarias,
  criarContasBancarias,
  atualizarUsuarioContaBancaria,
  excluirConta,
  saldo,
  extrato
};
