import { api } from './apiHelper.js';
import { cabecalhoAutorizacao } from './authHelper.js';
import { payloadEquipamento } from '../fixtures/equipment.fixture.js';

export async function criarEquipamento(token, corpoRequisicao = payloadEquipamento()) {
  return api()
    .post('/api/equipment')
    .set('Authorization', cabecalhoAutorizacao(token))
    .send(corpoRequisicao);
}
