import { expect } from 'chai';

export function validarErro(resposta, statusEsperado, mensagemEsperada) {
  expect(resposta.status).to.equal(statusEsperado);
  expect(resposta.body).to.have.property('error');
  expect(resposta.body.error).to.have.property('message', mensagemEsperada);
}

export function validarRespostaAutenticacao(resposta, statusEsperado, emailEsperado) {
  expect(resposta.status).to.equal(statusEsperado);
  expect(resposta.body).to.have.property('token').that.is.a('string').and.is.not.empty;
  expect(resposta.body.user).to.include({ email: emailEsperado });
  expect(resposta.body.user).to.not.have.property('password');
  expect(resposta.body.user).to.not.have.property('passwordHash');
}

export function validarEquipamento(resposta, statusEsperado, corpoEsperado) {
  expect(resposta.status).to.equal(statusEsperado);
  expect(resposta.body).to.include(corpoEsperado);
  expect(resposta.body).to.have.property('id').that.is.a('number');
  expect(resposta.body).to.have.property('createdAt').that.is.a('string');
  expect(resposta.body).to.have.property('updatedAt').that.is.a('string');
}

export function validarLocacao(resposta, statusEsperado, corpoEsperado) {
  expect(resposta.status).to.equal(statusEsperado);
  expect(resposta.body).to.include(corpoEsperado);
  expect(resposta.body).to.have.property('id').that.is.a('number');
  expect(resposta.body).to.have.property('userId').that.is.a('number');
}

export function validarDevolucao(resposta, statusEsperado, corpoEsperado) {
  expect(resposta.status).to.equal(statusEsperado);
  expect(resposta.body).to.include(corpoEsperado);
  expect(resposta.body).to.have.property('id').that.is.a('number');
  expect(resposta.body).to.have.property('userId').that.is.a('number');
}
