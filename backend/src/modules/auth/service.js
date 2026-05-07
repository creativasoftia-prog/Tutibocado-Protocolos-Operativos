import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/db.js';
import { env } from '../../config/env.js';

const getRolesByUserId = async (userId) => {
  const rows = await db('user_roles as ur')
    .innerJoin('roles as r', 'r.id', 'ur.role_id')
    .where('ur.user_id', userId)
    .select('r.name');

  return rows.map((row) => row.name);
};

export const getUserProfile = async (userId) => {
  const user = await db('users')
    .where({ id: userId })
    .first('id', 'full_name as fullName', 'email', 'is_active as isActive', 'created_at as createdAt');

  if (!user) return null;

  const roles = await getRolesByUserId(user.id);
  return { ...user, roles };
};

export const loginWithEmailPassword = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db('users')
    .where({ email: normalizedEmail, is_active: true })
    .first('id', 'full_name as fullName', 'email', 'password_hash as passwordHash');

  if (!user) return null;

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) return null;

  const roles = await getRolesByUserId(user.id);

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      roles
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      roles
    }
  };
};

export const listUsersWithRoles = async () => {
  const users = await db('users')
    .select('id', 'full_name as fullName', 'email', 'is_active as isActive', 'created_at as createdAt')
    .orderBy('full_name', 'asc');

  const usersWithRoles = await Promise.all(
    users.map(async (user) => ({
      ...user,
      roles: await getRolesByUserId(user.id)
    }))
  );

  return usersWithRoles;
};

export const createUserWithRoles = async ({ fullName, email, password, roleNames }) => {
  const normalizedEmail = email.trim().toLowerCase();

  return db.transaction(async (trx) => {
    const existing = await trx('users').where({ email: normalizedEmail }).first('id');
    if (existing) {
      throw new Error('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [createdUser] = await trx('users')
      .insert({
        full_name: fullName.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        is_active: true
      })
      .returning(['id', 'full_name as fullName', 'email']);

    const roles = await trx('roles').whereIn('name', roleNames).select('id', 'name');

    if (roles.length !== roleNames.length) {
      throw new Error('One or more roles do not exist');
    }

    await trx('user_roles').insert(
      roles.map((role) => ({ user_id: createdUser.id, role_id: role.id }))
    );

    return {
      ...createdUser,
      roles: roles.map((role) => role.name)
    };
  });
};

export const updateUserWithRoles = async ({ userId, fullName, email, password, roleNames, isActive }) => {
  const normalizedEmail = email.trim().toLowerCase();

  return db.transaction(async (trx) => {
    const existingUser = await trx('users').where({ id: userId }).first('id');
    if (!existingUser) {
      throw new Error('User not found');
    }

    const emailOwner = await trx('users')
      .where({ email: normalizedEmail })
      .whereNot({ id: userId })
      .first('id');

    if (emailOwner) {
      throw new Error('Email already exists');
    }

    const updatePayload = {
      full_name: fullName.trim(),
      email: normalizedEmail,
      is_active: isActive
    };

    if (password && password.trim().length > 0) {
      updatePayload.password_hash = await bcrypt.hash(password, 10);
    }

    await trx('users').where({ id: userId }).update(updatePayload);

    const roles = await trx('roles').whereIn('name', roleNames).select('id', 'name');

    if (roles.length !== roleNames.length) {
      throw new Error('One or more roles do not exist');
    }

    await trx('user_roles').where({ user_id: userId }).del();
    await trx('user_roles').insert(roles.map((role) => ({ user_id: userId, role_id: role.id })));

    const [updated] = await trx('users')
      .where({ id: userId })
      .select('id', 'full_name as fullName', 'email', 'is_active as isActive');

    return {
      ...updated,
      roles: roles.map((role) => role.name)
    };
  });
};

export const deleteUserById = async ({ userId, actorUserId }) => {
  if (Number(userId) === Number(actorUserId)) {
    throw new Error('You cannot delete your own user');
  }

  return db.transaction(async (trx) => {
    const existingUser = await trx('users').where({ id: userId }).first('id', 'email');
    if (!existingUser) {
      throw new Error('User not found');
    }

    await trx('users').where({ id: userId }).del();
    return { deleted: true };
  });
};
