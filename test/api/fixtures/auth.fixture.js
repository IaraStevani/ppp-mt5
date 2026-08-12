import { gerarEmailUnico } from '../utils/dadosDinamicos.js';

export const usuarioPadrao = {
  corpoRequisicao: {
    name: 'Usuário Teste',
    email: 'teste@email.com',
    password: '123456',
  },
  corpoResposta: {
    name: 'Usuário Teste',
    email: 'teste@email.com',
  },
};

export function usuarioValido(sobrescritas = {}) {
  return {
    name: 'Maria Oliveira',
    email: gerarEmailUnico('maria'),
    password: 'senha123',
    ...sobrescritas,
  };
}

export const particoesCadastroUsuario = [
  {
    descricao: 'partição válida: nome, email e senha preenchidos',
    corpoRequisicao: () => usuarioValido(),
    statusEsperado: 201,
    corpoResposta: { sucesso: true },
  },
  {
    descricao: 'partição inválida: nome ausente',
    corpoRequisicao: () => {
      const { name: _name, ...payload } = usuarioValido();
      return payload;
    },
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Nome, email e senha sao obrigatorios' },
  },
  {
    descricao: 'partição inválida: email ausente',
    corpoRequisicao: () => {
      const { email: _email, ...payload } = usuarioValido();
      return payload;
    },
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Nome, email e senha sao obrigatorios' },
  },
  {
    descricao: 'partição inválida: senha ausente',
    corpoRequisicao: () => {
      const { password: _password, ...payload } = usuarioValido();
      return payload;
    },
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Nome, email e senha sao obrigatorios' },
  },
];

export const particoesLoginUsuario = [
  {
    descricao: 'partição válida: email cadastrado e senha correta',
    corpoRequisicao: () => ({
      email: usuarioPadrao.corpoRequisicao.email,
      password: usuarioPadrao.corpoRequisicao.password,
    }),
    statusEsperado: 200,
    corpoResposta: { sucesso: true },
  },
  {
    descricao: 'partição inválida: email ausente',
    corpoRequisicao: () => ({ password: usuarioPadrao.corpoRequisicao.password }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Email e senha sao obrigatorios' },
  },
  {
    descricao: 'partição inválida: senha ausente',
    corpoRequisicao: () => ({ email: usuarioPadrao.corpoRequisicao.email }),
    statusEsperado: 400,
    corpoResposta: { mensagem: 'Email e senha sao obrigatorios' },
  },
  {
    descricao: 'partição inválida: email não cadastrado',
    corpoRequisicao: () => ({
      email: gerarEmailUnico('inexistente'),
      password: usuarioPadrao.corpoRequisicao.password,
    }),
    statusEsperado: 401,
    corpoResposta: { mensagem: 'Credenciais invalidas' },
  },
  {
    descricao: 'partição inválida: senha incorreta',
    corpoRequisicao: () => ({
      email: usuarioPadrao.corpoRequisicao.email,
      password: 'senha-incorreta',
    }),
    statusEsperado: 401,
    corpoResposta: { mensagem: 'Credenciais invalidas' },
  },
];
