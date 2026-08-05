import { findEquipmentById, updateEquipment } from '../model/equipmentModel.js';
import {
  closeRental,
  createRental,
  findActiveRentalByEquipmentId,
  findRentalById,
  listRentals,
} from '../model/rentalModel.js';
import { createReturn, listReturns } from '../model/returnModel.js';
import { HttpError } from '../utils/httpError.js';

function ensureValidDate(value, fieldName) {
  if (!value || Number.isNaN(Date.parse(value))) {
    throw new HttpError(400, `${fieldName} deve ser uma data valida`);
  }
}

export function rent(payload, user) {
  const { equipmentId, startDate, expectedReturnDate } = payload;

  if (!equipmentId || !startDate || !expectedReturnDate) {
    throw new HttpError(400, 'equipmentId, startDate e expectedReturnDate sao obrigatorios');
  }

  ensureValidDate(startDate, 'startDate');
  ensureValidDate(expectedReturnDate, 'expectedReturnDate');

  const equipment = findEquipmentById(equipmentId);

  if (!equipment) {
    throw new HttpError(404, 'Equipamento nao encontrado');
  }

  if (equipment.status !== 'available') {
    throw new HttpError(409, 'Equipamento indisponivel para locacao');
  }

  const rental = createRental({
    equipmentId,
    startDate,
    expectedReturnDate,
    userId: user.id,
  });

  updateEquipment(equipmentId, { status: 'rented' });
  return rental;
}

export function list() {
  return listRentals();
}

export function returnEquipment(payload, user) {
  const { rentalId, returnDate, condition, notes } = payload;

  if (!rentalId || !returnDate || !condition) {
    throw new HttpError(400, 'rentalId, returnDate e condition sao obrigatorios');
  }

  ensureValidDate(returnDate, 'returnDate');

  const rental = findRentalById(rentalId);

  if (!rental) {
    throw new HttpError(404, 'Locacao nao encontrada');
  }

  if (rental.status !== 'active') {
    throw new HttpError(409, 'Locacao ja foi devolvida');
  }

  const activeRental = findActiveRentalByEquipmentId(rental.equipmentId);

  if (!activeRental || activeRental.id !== rental.id) {
    throw new HttpError(409, 'Equipamento nao possui locacao ativa correspondente');
  }

  const returnRecord = createReturn({
    rentalId,
    equipmentId: rental.equipmentId,
    userId: user.id,
    returnDate,
    condition,
    notes,
  });

  closeRental(rental.id);
  updateEquipment(rental.equipmentId, { status: 'available' });

  return returnRecord;
}

export function returns() {
  return listReturns();
}
