import * as authService from '../service/authService.js';

export function register(req, res, next) {
  try {
    res.status(201).json(authService.register(req.body));
  } catch (error) {
    next(error);
  }
}

export function login(req, res, next) {
  try {
    res.status(200).json(authService.login(req.body));
  } catch (error) {
    next(error);
  }
}
