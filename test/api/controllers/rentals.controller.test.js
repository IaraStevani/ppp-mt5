import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { resetDatabase } from '../../../src/model/database.js';
import {
  particoesDevolucao,
  particoesLocacao,
  payloadDevolucao,
  payloadLocacao,
} from '../fixtures/rentals.fixture.js';
import { api } from '../helpers/apiHelper.js';
import {
  cabecalhoAutorizacao,
  obterTokenAutenticacao,
} from '../helpers/authHelper.js';
import {
  validarDevolucao,
  validarErro,
  validarLocacao,
} from '../helpers/assertions.js';
import { criarEquipamento } from '../helpers/equipmentHelper.js';
import { criarLocacao, registrarDevolucao } from '../helpers/rentalHelper.js';

describe('Controller Locações e Devoluções', () => {
  let token;

  beforeEach(async () => {
    resetDatabase();
    token = await obterTokenAutenticacao();
  });

  describe('POST /api/rentals', () => {
    particoesLocacao.forEach((particao) => {
      it(`deve validar registro de locação - ${particao.descricao}`, async () => {
        // Arrange
        const equipamento = (await criarEquipamento(token)).body;
        const corpoRequisicao = particao.corpoRequisicao({ equipamento });

        // Act
        const resposta = await api()
          .post('/api/rentals')
          .set('Authorization', cabecalhoAutorizacao(token))
          .send(corpoRequisicao);

        // Assert
        if (particao.corpoResposta.sucesso) {
          validarLocacao(resposta, particao.statusEsperado, {
            equipmentId: equipamento.id,
            status: particao.corpoResposta.status,
          });
          return;
        }

        validarErro(resposta, particao.statusEsperado, particao.corpoResposta.mensagem);
      });
    });

    it('deve rejeitar locação para equipamento indisponível', async () => {
      // Arrange
      const equipamento = (await criarEquipamento(token)).body;
      await criarLocacao(token, equipamento.id);
      const corpoRequisicao = payloadLocacao(equipamento.id);

      // Act
      const resposta = await api()
        .post('/api/rentals')
        .set('Authorization', cabecalhoAutorizacao(token))
        .send(corpoRequisicao);

      // Assert
      validarErro(resposta, 409, 'Equipamento indisponivel para locacao');
    });

    it('deve rejeitar criação de locação sem token', async () => {
      // Arrange
      const corpoRequisicao = payloadLocacao(1);

      // Act
      const resposta = await api()
        .post('/api/rentals')
        .send(corpoRequisicao);

      // Assert
      validarErro(resposta, 401, 'Token de autenticacao nao informado');
    });
  });

  describe('GET /api/rentals', () => {
    it('deve listar locações cadastradas', async () => {
      // Arrange
      const equipamento = (await criarEquipamento(token)).body;
      const locacao = (await criarLocacao(token, equipamento.id)).body;

      // Act
      const resposta = await api()
        .get('/api/rentals')
        .set('Authorization', cabecalhoAutorizacao(token));

      // Assert
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.be.an('array').with.length(1);
      expect(resposta.body[0]).to.include({
        id: locacao.id,
        equipmentId: equipamento.id,
        status: 'active',
      });
    });
  });

  describe('POST /api/rentals/returns', () => {
    particoesDevolucao.forEach((particao) => {
      it(`deve validar registro de devolução - ${particao.descricao}`, async () => {
        // Arrange
        const equipamento = (await criarEquipamento(token)).body;
        const locacao = (await criarLocacao(token, equipamento.id)).body;
        const corpoRequisicao = particao.corpoRequisicao({ locacao });

        // Act
        const resposta = await api()
          .post('/api/rentals/returns')
          .set('Authorization', cabecalhoAutorizacao(token))
          .send(corpoRequisicao);

        // Assert
        if (particao.corpoResposta.sucesso) {
          validarDevolucao(resposta, particao.statusEsperado, {
            rentalId: locacao.id,
            equipmentId: equipamento.id,
            returnDate: corpoRequisicao.returnDate,
            condition: corpoRequisicao.condition,
          });
          return;
        }

        validarErro(resposta, particao.statusEsperado, particao.corpoResposta.mensagem);
      });
    });

    it('deve rejeitar devolução duplicada para a mesma locação', async () => {
      // Arrange
      const equipamento = (await criarEquipamento(token)).body;
      const locacao = (await criarLocacao(token, equipamento.id)).body;
      const corpoRequisicao = payloadDevolucao(locacao.id);
      await registrarDevolucao(token, locacao.id, corpoRequisicao);

      // Act
      const resposta = await registrarDevolucao(token, locacao.id, corpoRequisicao);

      // Assert
      validarErro(resposta, 409, 'Locacao ja foi devolvida');
    });

    it('deve rejeitar devolução sem token', async () => {
      // Arrange
      const corpoRequisicao = payloadDevolucao(1);

      // Act
      const resposta = await api()
        .post('/api/rentals/returns')
        .send(corpoRequisicao);

      // Assert
      validarErro(resposta, 401, 'Token de autenticacao nao informado');
    });
  });

  describe('GET /api/rentals/returns', () => {
    it('deve listar devoluções cadastradas', async () => {
      // Arrange
      const equipamento = (await criarEquipamento(token)).body;
      const locacao = (await criarLocacao(token, equipamento.id)).body;
      const devolucao = (await registrarDevolucao(token, locacao.id)).body;

      // Act
      const resposta = await api()
        .get('/api/rentals/returns')
        .set('Authorization', cabecalhoAutorizacao(token));

      // Assert
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.be.an('array').with.length(1);
      expect(resposta.body[0]).to.include({
        id: devolucao.id,
        rentalId: locacao.id,
        equipmentId: equipamento.id,
      });
    });
  });
});
