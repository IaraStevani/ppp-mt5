import { api } from './apiHelper.js';
import { cabecalhoAutorizacao } from './authHelper.js';
import { payloadDevolucao, payloadLocacao } from '../fixtures/rentals.fixture.js';

export async function criarLocacao(token, equipmentId, corpoRequisicao = payloadLocacao(equipmentId)) {
  return api()
    .post('/api/rentals')
    .set('Authorization', cabecalhoAutorizacao(token))
    .send(corpoRequisicao);
}

export async function registrarDevolucao(token, rentalId, corpoRequisicao = payloadDevolucao(rentalId)) {
  return api()
    .post('/api/rentals/returns')
    .set('Authorization', cabecalhoAutorizacao(token))
    .send(corpoRequisicao);
}
