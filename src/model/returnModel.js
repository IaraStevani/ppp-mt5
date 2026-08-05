import { database, nextId } from './database.js';

export function createReturn(returnRecord) {
  const now = new Date().toISOString();
  const newReturn = {
    id: nextId('returns'),
    rentalId: Number(returnRecord.rentalId),
    equipmentId: Number(returnRecord.equipmentId),
    userId: returnRecord.userId,
    returnDate: returnRecord.returnDate,
    condition: returnRecord.condition,
    notes: returnRecord.notes || null,
    createdAt: now,
  };

  database.returns.push(newReturn);
  return newReturn;
}

export function listReturns() {
  return database.returns;
}
