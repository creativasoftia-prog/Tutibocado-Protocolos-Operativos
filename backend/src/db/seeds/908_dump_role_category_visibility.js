/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries for this table to avoid duplicates
  // Note: Cleanup script usually handles this, but here we do it per table if needed.
  // await knex('role_category_visibility').del();
  
  await knex('role_category_visibility').insert([
  {
    "role_id": 35,
    "protocol_type_id": 61
  },
  {
    "role_id": 30,
    "protocol_type_id": 63
  },
  {
    "role_id": 30,
    "protocol_type_id": 60
  },
  {
    "role_id": 30,
    "protocol_type_id": 67
  },
  {
    "role_id": 30,
    "protocol_type_id": 62
  },
  {
    "role_id": 30,
    "protocol_type_id": 68
  },
  {
    "role_id": 30,
    "protocol_type_id": 65
  },
  {
    "role_id": 30,
    "protocol_type_id": 59
  },
  {
    "role_id": 30,
    "protocol_type_id": 58
  },
  {
    "role_id": 30,
    "protocol_type_id": 57
  },
  {
    "role_id": 30,
    "protocol_type_id": 70
  },
  {
    "role_id": 30,
    "protocol_type_id": 64
  },
  {
    "role_id": 30,
    "protocol_type_id": 69
  },
  {
    "role_id": 30,
    "protocol_type_id": 61
  },
  {
    "role_id": 30,
    "protocol_type_id": 66
  },
  {
    "role_id": 34,
    "protocol_type_id": 66
  },
  {
    "role_id": 34,
    "protocol_type_id": 69
  },
  {
    "role_id": 34,
    "protocol_type_id": 64
  },
  {
    "role_id": 34,
    "protocol_type_id": 70
  },
  {
    "role_id": 34,
    "protocol_type_id": 57
  },
  {
    "role_id": 34,
    "protocol_type_id": 58
  },
  {
    "role_id": 34,
    "protocol_type_id": 59
  },
  {
    "role_id": 34,
    "protocol_type_id": 65
  },
  {
    "role_id": 34,
    "protocol_type_id": 68
  },
  {
    "role_id": 34,
    "protocol_type_id": 62
  },
  {
    "role_id": 34,
    "protocol_type_id": 67
  },
  {
    "role_id": 34,
    "protocol_type_id": 60
  },
  {
    "role_id": 34,
    "protocol_type_id": 63
  }
]);
};
