import { db } from '../../config/db.js';

const normalizeSlug = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const mapProtocolRowToPublic = (row, steps, visibilityRoleNames) => ({
  id: row.slug,
  code: row.code,
  name: row.name,
  description: row.description,
  trigger: row.trigger,
  responsible: row.responsible,
  areas: JSON.parse(row.areas_json || '[]'),
  priority: row.priority,
  type: row.typeName,
  textSteps: steps,
  communicationRules: row.communication_rules,
  closingCriteria: row.closing_criteria,
  recommendations: row.recommendations,
  visibleForRoles: visibilityRoleNames
});

const withStepsAndVisibility = async (protocolRows) => {
  if (protocolRows.length === 0) return [];

  const protocolIds = protocolRows.map((item) => item.id);

  const stepsRows = await db('protocol_steps')
    .whereIn('protocol_id', protocolIds)
    .select('protocol_id as protocolId', 'step_order as stepOrder', 'content')
    .orderBy('protocol_id', 'asc')
    .orderBy('step_order', 'asc');

  const visibilityRows = await db('protocol_visibility_roles as pvr')
    .innerJoin('roles as r', 'r.id', 'pvr.role_id')
    .whereIn('pvr.protocol_id', protocolIds)
    .select('pvr.protocol_id as protocolId', 'r.name as roleName')
    .orderBy('r.name', 'asc');

  return protocolRows.map((row) => {
    const steps = stepsRows
      .filter((s) => s.protocolId === row.id)
      .map((s) => s.content);

    const visibilityRoleNames = visibilityRows
      .filter((v) => v.protocolId === row.id)
      .map((v) => v.roleName);

    return mapProtocolRowToPublic(row, steps, visibilityRoleNames);
  });
};

export const listVisibleProtocols = async (userRoles) => {
  const query = db('protocols as p')
    .innerJoin('protocol_types as pt', 'pt.id', 'p.protocol_type_id')
    .select(
      'p.id',
      'p.slug',
      'p.code',
      'p.name',
      'p.description',
      'p.trigger',
      'p.responsible',
      'p.areas_json',
      'p.priority',
      'p.communication_rules',
      'p.closing_criteria',
      'p.recommendations',
      'pt.name as typeName'
    )
    .orderBy('p.code', 'asc');

  if (!userRoles.includes('administrador')) {
    query
      .innerJoin('protocol_visibility_roles as pvr', 'pvr.protocol_id', 'p.id')
      .innerJoin('roles as r', 'r.id', 'pvr.role_id')
      .whereIn('r.name', userRoles)
      .groupBy(
        'p.id',
        'p.slug',
        'p.code',
        'p.name',
        'p.description',
        'p.trigger',
        'p.responsible',
        'p.areas_json',
        'p.priority',
        'p.communication_rules',
        'p.closing_criteria',
        'p.recommendations',
        'pt.name'
      );
  }

  const rows = await query;
  return withStepsAndVisibility(rows);
};

const getOrCreateTypeId = async (trx, typeName) => {
  const normalized = typeName.trim();
  const existing = await trx('protocol_types').where({ name: normalized }).first('id');
  if (existing) return existing.id;

  const [created] = await trx('protocol_types').insert({ name: normalized }).returning('id');
  return created.id;
};

export const createProtocol = async ({ payload, actorUserId }) => {
  return db.transaction(async (trx) => {
    const typeId = await getOrCreateTypeId(trx, payload.type);

    const baseSlug = normalizeSlug(payload.name);
    let slug = baseSlug;
    let suffix = 1;

    // Ensure slug uniqueness for stable URL-like key.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const exists = await trx('protocols').where({ slug }).first('id');
      if (!exists) break;
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const [createdProtocol] = await trx('protocols')
      .insert({
        slug,
        code: payload.code,
        name: payload.name,
        description: payload.description,
        trigger: payload.trigger,
        responsible: payload.responsible,
        areas_json: JSON.stringify(payload.areas),
        priority: payload.priority,
        protocol_type_id: typeId,
        communication_rules: payload.communicationRules,
        closing_criteria: payload.closingCriteria,
        recommendations: payload.recommendations,
        created_by_user_id: actorUserId
      })
      .returning(['id', 'slug', 'code', 'name', 'description', 'trigger', 'responsible', 'areas_json', 'priority', 'communication_rules', 'closing_criteria', 'recommendations']);

    await trx('protocol_steps').insert(
      payload.textSteps.map((content, index) => ({
        protocol_id: createdProtocol.id,
        step_order: index + 1,
        content: content.trim()
      }))
    );

    const roles = await trx('roles').whereIn('name', payload.visibleForRoles).select('id', 'name');

    if (roles.length !== payload.visibleForRoles.length) {
      throw new Error('One or more visibility roles do not exist');
    }

    await trx('protocol_visibility_roles').insert(
      roles.map((role) => ({ protocol_id: createdProtocol.id, role_id: role.id }))
    );

    await trx('audit_logs').insert({
      actor_user_id: actorUserId,
      action: 'protocol.create',
      entity_type: 'protocol',
      entity_id: `${createdProtocol.id}`,
      details: JSON.stringify({ code: payload.code, name: payload.name })
    });

    const [typeRow] = await trx('protocol_types').where({ id: typeId }).select('name');

    return mapProtocolRowToPublic(
      { ...createdProtocol, typeName: typeRow.name },
      payload.textSteps,
      payload.visibleForRoles
    );
  });
};

const getTypeBySlug = async (trx, typeSlug) => {
  const types = await trx('protocol_types').select('id', 'name');
  return types.find((type) => normalizeSlug(type.name) === typeSlug) || null;
};

const ensureVisibilityRoles = async (trx, roleNames) => {
  const roles = await trx('roles').whereIn('name', roleNames).select('id', 'name');
  if (roles.length !== roleNames.length) {
    throw new Error('One or more visibility roles do not exist');
  }
  return roles;
};

const updateProtocolCore = async ({ trx, protocolId, payload }) => {
  const protocol = await trx('protocols').where({ id: protocolId }).first('id');
  if (!protocol) {
    throw new Error('Protocol not found');
  }

  const typeId = await getOrCreateTypeId(trx, payload.type);

  await trx('protocols')
    .where({ id: protocolId })
    .update({
      code: payload.code,
      name: payload.name,
      description: payload.description,
      trigger: payload.trigger,
      responsible: payload.responsible,
      areas_json: JSON.stringify(payload.areas),
      priority: payload.priority,
      protocol_type_id: typeId,
      communication_rules: payload.communicationRules,
      closing_criteria: payload.closingCriteria,
      recommendations: payload.recommendations,
      updated_at: trx.fn.now()
    });

  await trx('protocol_steps').where({ protocol_id: protocolId }).del();
  await trx('protocol_steps').insert(
    payload.textSteps.map((content, index) => ({
      protocol_id: protocolId,
      step_order: index + 1,
      content: content.trim()
    }))
  );

  const roles = await ensureVisibilityRoles(trx, payload.visibleForRoles);
  await trx('protocol_visibility_roles').where({ protocol_id: protocolId }).del();
  await trx('protocol_visibility_roles').insert(
    roles.map((role) => ({ protocol_id: protocolId, role_id: role.id }))
  );
};

export const updateProtocolBySlug = async ({ slug, payload, actorUserId }) => {
  return db.transaction(async (trx) => {
    const protocol = await trx('protocols').where({ slug }).first('id');
    if (!protocol) {
      throw new Error('Protocol not found');
    }

    await updateProtocolCore({ trx, protocolId: protocol.id, payload });

    await trx('audit_logs').insert({
      actor_user_id: actorUserId,
      action: 'protocol.update',
      entity_type: 'protocol',
      entity_id: `${protocol.id}`,
      details: JSON.stringify({ slug, code: payload.code, name: payload.name })
    });

    const rows = await trx('protocols as p')
      .innerJoin('protocol_types as pt', 'pt.id', 'p.protocol_type_id')
      .where('p.id', protocol.id)
      .select(
        'p.id',
        'p.slug',
        'p.code',
        'p.name',
        'p.description',
        'p.trigger',
        'p.responsible',
        'p.areas_json',
        'p.priority',
        'p.communication_rules',
        'p.closing_criteria',
        'p.recommendations',
        'pt.name as typeName'
      );

    const [updated] = await withStepsAndVisibility(rows);
    return updated;
  });
};

export const deleteProtocolBySlug = async ({ slug, actorUserId }) => {
  return db.transaction(async (trx) => {
    const protocol = await trx('protocols').where({ slug }).first('id', 'name');
    if (!protocol) {
      throw new Error('Protocol not found');
    }

    await trx('protocols').where({ id: protocol.id }).del();

    await trx('audit_logs').insert({
      actor_user_id: actorUserId,
      action: 'protocol.delete',
      entity_type: 'protocol',
      entity_id: `${protocol.id}`,
      details: JSON.stringify({ slug, name: protocol.name })
    });

    return { deleted: true };
  });
};

export const listCategories = async () => {
  const rows = await db('protocol_types as pt')
    .leftJoin('protocols as p', 'p.protocol_type_id', 'pt.id')
    .select('pt.id', 'pt.name')
    .count('p.id as protocolsCount')
    .groupBy('pt.id', 'pt.name')
    .orderBy('pt.name', 'asc');

  return rows.map((row) => ({
    id: normalizeSlug(row.name),
    name: row.name,
    protocolsCount: Number(row.protocolsCount || 0)
  }));
};

export const createCategory = async ({ name, actorUserId }) => {
  return db.transaction(async (trx) => {
    const normalized = name.trim();
    const existing = await trx('protocol_types').where({ name: normalized }).first('id');
    if (existing) {
      throw new Error('Category already exists');
    }

    const [created] = await trx('protocol_types').insert({ name: normalized }).returning(['id', 'name']);

    await trx('audit_logs').insert({
      actor_user_id: actorUserId,
      action: 'category.create',
      entity_type: 'protocol_type',
      entity_id: `${created.id}`,
      details: JSON.stringify({ name: created.name })
    });

    return { id: normalizeSlug(created.name), name: created.name, protocolsCount: 0 };
  });
};

export const updateCategoryBySlug = async ({ categoryId, name, actorUserId }) => {
  return db.transaction(async (trx) => {
    const category = await getTypeBySlug(trx, categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const normalized = name.trim();
    const duplicate = await trx('protocol_types')
      .where({ name: normalized })
      .whereNot({ id: category.id })
      .first('id');

    if (duplicate) {
      throw new Error('Category already exists');
    }

    await trx('protocol_types').where({ id: category.id }).update({ name: normalized });

    await trx('audit_logs').insert({
      actor_user_id: actorUserId,
      action: 'category.update',
      entity_type: 'protocol_type',
      entity_id: `${category.id}`,
      details: JSON.stringify({ previousName: category.name, nextName: normalized })
    });

    const [usage] = await trx('protocols').where({ protocol_type_id: category.id }).count('id as count');

    return {
      id: normalizeSlug(normalized),
      name: normalized,
      protocolsCount: Number(usage?.count || 0)
    };
  });
};

export const deleteCategoryBySlug = async ({ categoryId, actorUserId }) => {
  return db.transaction(async (trx) => {
    const category = await getTypeBySlug(trx, categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const [usage] = await trx('protocols').where({ protocol_type_id: category.id }).count('id as count');
    const count = Number(usage?.count || 0);

    if (count > 0) {
      throw new Error('Cannot delete category with related protocols');
    }

    await trx('protocol_types').where({ id: category.id }).del();

    await trx('audit_logs').insert({
      actor_user_id: actorUserId,
      action: 'category.delete',
      entity_type: 'protocol_type',
      entity_id: `${category.id}`,
      details: JSON.stringify({ name: category.name })
    });

    return { deleted: true };
  });
};
