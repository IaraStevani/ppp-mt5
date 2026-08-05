import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';

const jwtSecret = process.env.JWT_SECRET || 'road-construction-equipment-api-secret';

export function authenticate(req, _res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Token de autenticacao nao informado'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_error) {
    return next(new HttpError(401, 'Token de autenticacao invalido ou expirado'));
  }
}

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: '1h' },
  );
}
