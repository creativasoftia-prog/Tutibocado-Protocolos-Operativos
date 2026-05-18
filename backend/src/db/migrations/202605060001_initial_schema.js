export async function up(knex) {
  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary();
    table.string('name', 80).notNullable().unique();
    table.string('description', 300).notNullable().defaultTo('');
    table.boolean('is_system').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('full_name', 160).notNullable();
    table.string('email', 180).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable('user_roles', (table) => {
    table.integer('user_id').unsigned().notNullable();
    table.integer('role_id').unsigned().notNullable();

    table.primary(['user_id', 'role_id']);
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('role_id').references('roles.id').onDelete('CASCADE');
  });

  await knex.schema.createTable('protocol_types', (table) => {
    table.increments('id').primary();
    table.string('name', 120).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable('protocols', (table) => {
    table.increments('id').primary();
    table.string('slug', 180).notNullable().unique();
    table.string('code', 30).notNullable().unique();
    table.string('name', 220).notNullable();
    table.text('description').notNullable();
    table.text('trigger').notNullable();
    table.string('responsible', 180).notNullable();
    table.text('areas_json').notNullable();
    table.string('priority', 20).notNullable();
    table.integer('protocol_type_id').unsigned().notNullable();
    table.text('communication_rules').notNullable();
    table.text('closing_criteria').notNullable();
    table.text('recommendations').notNullable();
    table.integer('created_by_user_id').unsigned().nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

    table.foreign('protocol_type_id').references('protocol_types.id');
    table.foreign('created_by_user_id').references('users.id');
  });

  await knex.schema.createTable('protocol_steps', (table) => {
    table.increments('id').primary();
    table.integer('protocol_id').unsigned().notNullable();
    table.integer('step_order').notNullable();
    table.text('content').notNullable();

    table.foreign('protocol_id').references('protocols.id').onDelete('CASCADE');
    table.unique(['protocol_id', 'step_order']);
  });

  await knex.schema.createTable('protocol_visibility_roles', (table) => {
    table.integer('protocol_id').unsigned().notNullable();
    table.integer('role_id').unsigned().notNullable();

    table.primary(['protocol_id', 'role_id']);
    table.foreign('protocol_id').references('protocols.id').onDelete('CASCADE');
    table.foreign('role_id').references('roles.id').onDelete('CASCADE');
  });

  await knex.schema.createTable('audit_logs', (table) => {
    table.increments('id').primary();
    table.integer('actor_user_id').unsigned().nullable();
    table.string('action', 120).notNullable();
    table.string('entity_type', 80).notNullable();
    table.string('entity_id', 80).notNullable();
    table.text('details').notNullable().defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    table.foreign('actor_user_id').references('users.id');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('protocol_visibility_roles');
  await knex.schema.dropTableIfExists('protocol_steps');
  await knex.schema.dropTableIfExists('protocols');
  await knex.schema.dropTableIfExists('protocol_types');
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
}
