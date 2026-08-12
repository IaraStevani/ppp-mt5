import http from 'k6/http';
import { check } from 'k6';
import { baseUrl, usuario } from '../fixtures/api.fixture.js';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export function loginEObterToken() {
  // Arrange
  const cadastroPayload = JSON.stringify(usuario);
  const loginPayload = JSON.stringify({
    email: usuario.email,
    password: usuario.password,
  });

  // Act
  const cadastro = http.post(`${baseUrl}/api/auth/register`, cadastroPayload, {
    headers: jsonHeaders,
    responseCallback: http.expectedStatuses(201, 409),
    tags: { endpoint: 'POST /api/auth/register' },
  });

  const login = http.post(`${baseUrl}/api/auth/login`, loginPayload, {
    headers: jsonHeaders,
    tags: { endpoint: 'POST /api/auth/login' },
  });

  // Assert
  check(cadastro, {
    'cadastro retorna 201 ou usuário já cadastrado': (res) => res.status === 201 || res.status === 409,
  });

  check(login, {
    'login retorna 200': (res) => res.status === 200,
    'login retorna token': (res) => Boolean(res.json('token')),
  });

  return login.json('token');
}

export function cabecalhoAutenticado(token) {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}
