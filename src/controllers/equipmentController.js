import * as equipmentService from '../service/equipmentService.js';

export function create(req, res, next) {
  try {
    res.status(201).json(equipmentService.create(req.body));
  } catch (error) {
    next(error);
  }
}

export function list(_req, res, next) {
  try {
    res.status(200).json(equipmentService.list());
  } catch (error) {
    next(error);
  }
}

export function getById(req, res, next) {
  try {
    res.status(200).json(equipmentService.getById(req.params.id));
  } catch (error) {
    next(error);
  }
}

export function update(req, res, next) {
  try {
    res.status(200).json(equipmentService.update(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

export function remove(req, res, next) {
  try {
    equipmentService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function status(req, res, next) {
  try {
    res.status(200).json(equipmentService.status(req.params.id));
  } catch (error) {
    next(error);
  }
}
