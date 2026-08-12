import { expect } from 'chai';
import { describe, it } from 'mocha';
import { api } from '../helpers/apiHelper.js';

describe('Controller Health', () => {
  it('deve retornar status ok ao verificar a saúde da API', async () => {
    // Arrange
    const corpoRespostaEsperado = { status: 'ok' };

    // Act
    const resposta = await api().get('/api/health');

    // Assert
    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.deep.equal(corpoRespostaEsperado);
  });

  it('deve ignorar parâmetros extras ao verificar a saúde da API', async () => {
    // Arrange
    const query = { verbose: true };

    // Act
    const resposta = await api()
      .get('/api/health')
      .query(query);

    // Assert
    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.deep.equal({ status: 'ok' });
  });
});
