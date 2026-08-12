import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import {
  baseUrl,
  devolucao,
  equipamento,
  locacao,
} from './fixtures/api.fixture.js';
import {
  cabecalhoAutenticado,
  loginEObterToken,
} from './helpers/auth.helper.js';

export const errosFuncionais = new Rate('erros_funcionais');

export const options = {
  scenarios: {
    fluxo_api: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 5 },
        { duration: '10s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.0001'],
    erros_funcionais: ['rate<0.0001'],
  },
};

export function setup() {
  const token = loginEObterToken();
  if (!token) {
    throw new Error('Não foi possível obter token de autenticação para o teste de performance.');
  }

  return { token };
}

function validar(nome, resposta, validacoes) {
  const sucesso = check(resposta, validacoes);
  errosFuncionais.add(!sucesso, { check: nome });
  return sucesso;
}

export default function (dados) {
  const indice = `${__VU}-${__ITER}-${Date.now()}`;
  const params = cabecalhoAutenticado(dados.token);
  let equipamentoCriado;
  let locacaoCriada;

  group('Health', () => {
    // Arrange
    const endpoint = `${baseUrl}/api/health`;

    // Act
    const resposta = http.get(endpoint, {
      tags: { endpoint: 'GET /api/health' },
    });

    // Assert
    validar('health ok', resposta, {
      'health retorna 200': (res) => res.status === 200,
      'health retorna status ok': (res) => res.json('status') === 'ok',
    });
  });

  group('Equipamentos', () => {
    // Arrange
    const corpoEquipamento = JSON.stringify(equipamento(indice));

    // Act
    const criacao = http.post(`${baseUrl}/api/equipment`, corpoEquipamento, {
      ...params,
      tags: { endpoint: 'POST /api/equipment' },
    });

    // Assert
    const equipamentoValido = validar('criação de equipamento', criacao, {
      'criação de equipamento retorna 201': (res) => res.status === 201,
      'equipamento inicia disponível': (res) => res.json('status') === 'available',
      'equipamento retorna id': (res) => Number.isInteger(res.json('id')),
    });

    if (!equipamentoValido) {
      return;
    }

    equipamentoCriado = criacao.json();

    // Arrange
    const equipamentoId = equipamentoCriado.id;

    // Act
    const consulta = http.get(`${baseUrl}/api/equipment/${equipamentoId}`, {
      ...params,
      tags: { endpoint: 'GET /api/equipment/{id}' },
    });

    const status = http.get(`${baseUrl}/api/equipment/${equipamentoId}/status`, {
      ...params,
      tags: { endpoint: 'GET /api/equipment/{id}/status' },
    });

    const listagem = http.get(`${baseUrl}/api/equipment`, {
      ...params,
      tags: { endpoint: 'GET /api/equipment' },
    });

    // Assert
    validar('consulta de equipamento', consulta, {
      'consulta de equipamento retorna 200': (res) => res.status === 200,
      'consulta retorna o equipamento criado': (res) => res.json('id') === equipamentoId,
    });

    validar('status de equipamento', status, {
      'status de equipamento retorna 200': (res) => res.status === 200,
      'status inicial é available': (res) => res.json('status') === 'available',
    });

    validar('listagem de equipamentos', listagem, {
      'listagem de equipamentos retorna 200': (res) => res.status === 200,
      'listagem de equipamentos retorna array': (res) => Array.isArray(res.json()),
    });
  });

  if (!equipamentoCriado) {
    sleep(1);
    return;
  }

  group('Locações', () => {
    // Arrange
    const corpoLocacao = JSON.stringify(locacao(equipamentoCriado.id));

    // Act
    const criacao = http.post(`${baseUrl}/api/rentals`, corpoLocacao, {
      ...params,
      tags: { endpoint: 'POST /api/rentals' },
    });

    // Assert
    const locacaoValida = validar('criação de locação', criacao, {
      'criação de locação retorna 201': (res) => res.status === 201,
      'locação inicia ativa': (res) => res.json('status') === 'active',
      'locação retorna id': (res) => Number.isInteger(res.json('id')),
    });

    if (!locacaoValida) {
      return;
    }

    locacaoCriada = criacao.json();

    // Arrange
    const equipamentoId = equipamentoCriado.id;

    // Act
    const statusAlugado = http.get(`${baseUrl}/api/equipment/${equipamentoId}/status`, {
      ...params,
      tags: { endpoint: 'GET /api/equipment/{id}/status' },
    });

    const listagem = http.get(`${baseUrl}/api/rentals`, {
      ...params,
      tags: { endpoint: 'GET /api/rentals' },
    });

    // Assert
    validar('status alugado', statusAlugado, {
      'status alugado retorna 200': (res) => res.status === 200,
      'status após locação é rented': (res) => res.json('status') === 'rented',
    });

    validar('listagem de locações', listagem, {
      'listagem de locações retorna 200': (res) => res.status === 200,
      'listagem de locações retorna array': (res) => Array.isArray(res.json()),
    });
  });

  if (!locacaoCriada) {
    sleep(1);
    return;
  }

  group('Devoluções', () => {
    // Arrange
    const corpoDevolucao = JSON.stringify(devolucao(locacaoCriada.id));

    // Act
    const criacao = http.post(`${baseUrl}/api/rentals/returns`, corpoDevolucao, {
      ...params,
      tags: { endpoint: 'POST /api/rentals/returns' },
    });

    // Assert
    validar('registro de devolução', criacao, {
      'devolução retorna 201': (res) => res.status === 201,
      'devolução retorna rentalId correto': (res) => res.json('rentalId') === locacaoCriada.id,
    });

    // Arrange
    const equipamentoId = equipamentoCriado.id;

    // Act
    const statusDisponivel = http.get(`${baseUrl}/api/equipment/${equipamentoId}/status`, {
      ...params,
      tags: { endpoint: 'GET /api/equipment/{id}/status' },
    });

    const listagem = http.get(`${baseUrl}/api/rentals/returns`, {
      ...params,
      tags: { endpoint: 'GET /api/rentals/returns' },
    });

    // Assert
    validar('status disponível', statusDisponivel, {
      'status disponível retorna 200': (res) => res.status === 200,
      'status após devolução é available': (res) => res.json('status') === 'available',
    });

    validar('listagem de devoluções', listagem, {
      'listagem de devoluções retorna 200': (res) => res.status === 200,
      'listagem de devoluções retorna array': (res) => Array.isArray(res.json()),
    });
  });

  sleep(1);
}
