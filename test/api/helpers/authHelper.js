import { api } from './apiHelper.js';
import { usuarioPadrao } from '../fixtures/auth.fixture.js';

export async function cadastrarUsuario(corpoRequisicao = usuarioPadrao.corpoRequisicao) {
  return api()
    .post('/api/auth/register')
    .send(corpoRequisicao);
}

export async function loginUsuario(corpoRequisicao = {
  email: usuarioPadrao.corpoRequisicao.email,
  password: usuarioPadrao.corpoRequisicao.password,
}) {
  return api()
    .post('/api/auth/login')
    .send(corpoRequisicao);
}

export function cabecalhoAutorizacao(token) {
  return `Bearer ${token}`;
}

export async function obterTokenAutenticacao() {
  await cadastrarUsuario(usuarioPadrao.corpoRequisicao);
  const resposta = await loginUsuario();
  return resposta.body.token;
}
