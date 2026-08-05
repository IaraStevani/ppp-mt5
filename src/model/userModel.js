import { database, nextId } from './database.js';

export function createUser(user) {
  const now = new Date().toISOString();
  const newUser = {
    id: nextId('users'),
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  database.users.push(newUser);
  return newUser;
}

export function findUserByEmail(email) {
  return database.users.find((user) => user.email === email);
}

export function findUserById(id) {
  return database.users.find((user) => user.id === Number(id));
}
