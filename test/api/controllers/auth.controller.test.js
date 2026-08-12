import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { resetDatabase } from '../../../src/model/database.js';
import {
  particoesCadastroUsuario,
  particoesLoginUsuario,
  usuarioPadrao,
} from '../fixtures/auth.fixture.js';
import { cadastrarUsuario, loginUsuario } from '../helpers/authHelper.js';
import { validarErro, validarRespostaAutenticacao } from '../helpers/assertions.js';

describe('Controller Auth', () => {
  beforeEach(async () => {
    resetDatabase();
    await cadastrarUsuario(usuarioPadrao.corpoRequisicao);
  });

  describe('POST /api/auth/register', () => {
    particoesCadastroUsuario.forEach((particao) => {
      it(`deve validar cadastro de usuário - ${particao.descricao}`, async () => {
        // Arrange
        const corpoRequisicao = particao.corpoRequisicao();

        // Act
        const resposta = await cadastrarUsuario(corpoRequisicao);

        // Assert
        if (particao.corpoResposta.sucesso) {
          validarRespostaAutenticacao(resposta, particao.statusEsperado, corpoRequisicao.email);
          expect(resposta.body.user).to.include({
            name: corpoRequisicao.name,
            email: corpoRequisicao.email,
          });
          return;
        }

        validarErro(resposta, particao.statusEsperado, particao.corpoResposta.mensagem);
      });
    });

    it('deve rejeitar cadastro com email já cadastrado', async () => {
      // Arrange
      const corpoRequisicao = usuarioPadrao.corpoRequisicao;

      // Act
      const resposta = await cadastrarUsuario(corpoRequisicao);

      // Assert
      validarErro(resposta, 409, 'Email ja cadastrado');
    });
  });

  describe('POST /api/auth/login', () => {
    particoesLoginUsuario.forEach((particao) => {
      it(`deve validar login de usuário - ${particao.descricao}`, async () => {
        // Arrange
        const corpoRequisicao = particao.corpoRequisicao();

        // Act
        const resposta = await loginUsuario(corpoRequisicao);

        // Assert
        if (particao.corpoResposta.sucesso) {
          validarRespostaAutenticacao(resposta, particao.statusEsperado, corpoRequisicao.email);
          return;
        }

        validarErro(resposta, particao.statusEsperado, particao.corpoResposta.mensagem);
      });
    });
  });
});
