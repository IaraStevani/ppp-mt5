import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { resetDatabase } from '../../../src/model/database.js';
import {
  particoesCadastroEquipamento,
  particoesIdEquipamento,
  payloadEquipamento,
} from '../fixtures/equipment.fixture.js';
import { api } from '../helpers/apiHelper.js';
import {
  cabecalhoAutorizacao,
  obterTokenAutenticacao,
} from '../helpers/authHelper.js';
import {
  validarEquipamento,
  validarErro,
} from '../helpers/assertions.js';
import { criarEquipamento } from '../helpers/equipmentHelper.js';

describe('Controller Equipamentos', () => {
  let token;

  beforeEach(async () => {
    resetDatabase();
    token = await obterTokenAutenticacao();
  });

  describe('POST /api/equipment', () => {
    particoesCadastroEquipamento.forEach((particao) => {
      it(`deve validar cadastro de equipamento - ${particao.descricao}`, async () => {
        // Arrange
        const corpoRequisicao = particao.corpoRequisicao();

        // Act
        const resposta = await criarEquipamento(token, corpoRequisicao);

        // Assert
        if (particao.corpoResposta.sucesso) {
          validarEquipamento(resposta, particao.statusEsperado, {
            name: corpoRequisicao.name,
            type: corpoRequisicao.type,
            dailyRate: particao.corpoResposta.dailyRate,
            status: 'available',
          });
          return;
        }

        validarErro(resposta, particao.statusEsperado, particao.corpoResposta.mensagem);
      });
    });

    it('deve rejeitar criação de equipamento sem token', async () => {
      // Arrange
      const corpoRequisicao = payloadEquipamento();

      // Act
      const resposta = await api()
        .post('/api/equipment')
        .send(corpoRequisicao);

      // Assert
      validarErro(resposta, 401, 'Token de autenticacao nao informado');
    });
  });

  describe('GET /api/equipment', () => {
    it('deve listar equipamentos cadastrados', async () => {
      // Arrange
      const equipamento = await criarEquipamento(token);

      // Act
      const resposta = await api()
        .get('/api/equipment')
        .set('Authorization', cabecalhoAutorizacao(token));

      // Assert
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.be.an('array').with.length(1);
      expect(resposta.body[0]).to.include({
        id: equipamento.body.id,
        name: equipamento.body.name,
      });
    });
  });

  describe('GET /api/equipment/:id', () => {
    particoesIdEquipamento.forEach((particao) => {
      it(`deve consultar equipamento por ID - ${particao.descricao}`, async () => {
        // Arrange
        const equipamento = (await criarEquipamento(token)).body;
        const id = particao.id({ equipamento });

        // Act
        const resposta = await api()
          .get(`/api/equipment/${id}`)
          .set('Authorization', cabecalhoAutorizacao(token));

        // Assert
        if (particao.statusEsperado === 200) {
          expect(resposta.status).to.equal(200);
          expect(resposta.body).to.include({ id: equipamento.id });
          return;
        }

        validarErro(resposta, particao.statusEsperado, particao.corpoResposta.mensagem);
      });
    });
  });

  describe('PUT /api/equipment/:id', () => {
    it('deve alterar equipamento existente com payload válido', async () => {
      // Arrange
      const equipamento = (await criarEquipamento(token)).body;
      const corpoRequisicao = payloadEquipamento({
        name: 'Escavadeira hidráulica 320',
        dailyRate: 1350,
      });

      // Act
      const resposta = await api()
        .put(`/api/equipment/${equipamento.id}`)
        .set('Authorization', cabecalhoAutorizacao(token))
        .send(corpoRequisicao);

      // Assert
      validarEquipamento(resposta, 200, {
        id: equipamento.id,
        name: corpoRequisicao.name,
        dailyRate: corpoRequisicao.dailyRate,
      });
    });

    it('deve rejeitar alteração com dailyRate inválido', async () => {
      // Arrange
      const equipamento = (await criarEquipamento(token)).body;
      const corpoRequisicao = { dailyRate: 'abc' };

      // Act
      const resposta = await api()
        .put(`/api/equipment/${equipamento.id}`)
        .set('Authorization', cabecalhoAutorizacao(token))
        .send(corpoRequisicao);

      // Assert
      validarErro(resposta, 400, 'Valor diario deve ser maior que zero');
    });
  });

  describe('DELETE /api/equipment/:id', () => {
    it('deve excluir equipamento sem locação ativa', async () => {
      // Arrange
      const equipamento = (await criarEquipamento(token)).body;

      // Act
      const resposta = await api()
        .delete(`/api/equipment/${equipamento.id}`)
        .set('Authorization', cabecalhoAutorizacao(token));

      // Assert
      expect(resposta.status).to.equal(204);
      expect(resposta.body).to.deep.equal({});
    });
  });

  describe('GET /api/equipment/:id/status', () => {
    it('deve consultar status de equipamento existente', async () => {
      // Arrange
      const equipamento = (await criarEquipamento(token)).body;

      // Act
      const resposta = await api()
        .get(`/api/equipment/${equipamento.id}/status`)
        .set('Authorization', cabecalhoAutorizacao(token));

      // Assert
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.deep.equal({
        equipmentId: equipamento.id,
        status: 'available',
      });
    });
  });
});
