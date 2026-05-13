const normalizeSlug = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export async function seed(knex) {
  const source = await import('../../../../src/data/protocols.js');
  const protocolsData = source.protocolsData || [];

  const roles = await knex('roles').select('id', 'name');
  const visibleRoleIds = roles
    .filter((role) => ['administrador', 'supervisor', 'logistica', 'sucursal'].includes(role.name))
    .map((role) => role.id);

  const firstAdmin = await knex('users as u')
    .innerJoin('user_roles as ur', 'ur.user_id', 'u.id')
    .innerJoin('roles as r', 'r.id', 'ur.role_id')
    .where('r.name', 'administrador')
    .first('u.id as id');

  for (const protocol of protocolsData) {
    const [existingType] = await knex('protocol_types').where({ name: protocol.type }).select('id');
    let typeId = existingType?.id;

    if (!typeId) {
      const [createdType] = await knex('protocol_types').insert({ name: protocol.type }).returning(['id']);
      typeId = createdType.id;
    }

    let slug = normalizeSlug(protocol.id || protocol.name);
    let suffix = 1;

    // Keep slug unique while preserving semantic name.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const found = await knex('protocols').where({ slug }).first('id');
      if (!found) break;
      suffix += 1;
      slug = `${normalizeSlug(protocol.id || protocol.name)}-${suffix}`;
    }

    const [createdProtocol] = await knex('protocols')
      .insert({
        slug,
        code: protocol.code,
        name: protocol.name,
        icon: protocol.icon || '',
        description: protocol.description,
        trigger: protocol.trigger,
        responsible: protocol.responsible,
        areas_json: JSON.stringify(protocol.areas || []),
        priority: protocol.priority,
        protocol_type_id: typeId,
        communication_rules: protocol.communicationRules || '',
        closing_criteria: protocol.closingCriteria || '',
        recommendations: protocol.recommendations || '',
        created_by_user_id: firstAdmin?.id || null
      })
      .returning(['id']);

    const steps = (protocol.textSteps || []).map((content, index) => ({
      protocol_id: createdProtocol.id,
      step_order: index + 1,
      content
    }));

    if (steps.length > 0) {
      await knex('protocol_steps').insert(steps);
    }

    if (visibleRoleIds.length > 0) {
      await knex('protocol_visibility_roles').insert(
        visibleRoleIds.map((roleId) => ({
          protocol_id: createdProtocol.id,
          role_id: roleId
        }))
      );
    }
  }
}
