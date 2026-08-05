import * as rentalService from '../service/rentalService.js';

export function rent(req, res, next) {
  try {
    res.status(201).json(rentalService.rent(req.body, req.user));
  } catch (error) {
    next(error);
  }
}

export function list(_req, res, next) {
  try {
    res.status(200).json(rentalService.list());
  } catch (error) {
    next(error);
  }
}

export function returnEquipment(req, res, next) {
  try {
    res.status(201).json(rentalService.returnEquipment(req.body, req.user));
  } catch (error) {
    next(error);
  }
}

export function returns(_req, res, next) {
  try {
    res.status(200).json(rentalService.returns());
  } catch (error) {
    next(error);
  }
}
