import {
  createEquipment,
  deleteEquipment,
  findEquipmentById,
  listEquipment,
  updateEquipment,
} from '../model/equipmentModel.js';
import { findActiveRentalByEquipmentId } from '../model/rentalModel.js';
import { HttpError } from '../utils/httpError.js';

function validateEquipmentPayload(payload, partial = false) {
  const requiredFields = ['name', 'type', 'dailyRate'];

  if (!partial) {
    const missingFields = requiredFields.filter((field) => payload[field] === undefined || payload[field] === '');

    if (missingFields.length) {
      throw new HttpError(400, 'Campos obrigatorios ausentes', missingFields);
    }
  }

  if (payload.dailyRate !== undefined && (Number.isNaN(Number(payload.dailyRate)) || Number(payload.dailyRate) <= 0)) {
    throw new HttpError(400, 'Valor diario deve ser maior que zero');
  }
}

export function create(payload) {
  validateEquipmentPayload(payload);
  return createEquipment(payload);
}

export function list() {
  return listEquipment();
}

export function getById(id) {
  const equipment = findEquipmentById(id);

  if (!equipment) {
    throw new HttpError(404, 'Equipamento nao encontrado');
  }

  return equipment;
}

export function update(id, payload) {
  getById(id);
  validateEquipmentPayload(payload, true);

  const allowedChanges = {
    name: payload.name,
    type: payload.type,
    description: payload.description,
    dailyRate: payload.dailyRate,
  };

  Object.keys(allowedChanges).forEach((key) => allowedChanges[key] === undefined && delete allowedChanges[key]);

  return updateEquipment(id, allowedChanges);
}

export function remove(id) {
  const equipment = getById(id);

  if (findActiveRentalByEquipmentId(equipment.id)) {
    throw new HttpError(409, 'Equipamento com locacao ativa nao pode ser excluido');
  }

  deleteEquipment(id);
}

export function status(id) {
  const equipment = getById(id);

  return {
    equipmentId: equipment.id,
    status: equipment.status,
  };
}
