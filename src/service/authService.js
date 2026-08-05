import { createUser, findUserByEmail } from '../model/userModel.js';
import { signToken } from '../middleware/authMiddleware.js';
import { HttpError } from '../utils/httpError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new HttpError(400, 'Nome, email e senha sao obrigatorios');
  }

  if (findUserByEmail(email)) {
    throw new HttpError(409, 'Email ja cadastrado');
  }

  const user = createUser({
    name,
    email,
    passwordHash: hashPassword(password),
  });

  return {
    user: sanitizeUser(user),
    token: signToken(user),
  };
}

export function login({ email, password }) {
  if (!email || !password) {
    throw new HttpError(400, 'Email e senha sao obrigatorios');
  }

  const user = findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new HttpError(401, 'Credenciais invalidas');
  }

  return {
    user: sanitizeUser(user),
    token: signToken(user),
  };
}
