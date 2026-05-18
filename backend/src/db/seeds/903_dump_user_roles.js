/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries for this table to avoid duplicates
  // Note: Cleanup script usually handles this, but here we do it per table if needed.
  // await knex('user_roles').del();
  
  await knex('user_roles').insert([
  {
    "user_id": 11,
    "role_id": 30
  },
  {
    "user_id": 12,
    "role_id": 33
  },
  {
    "user_id": 12,
    "role_id": 34
  },
  {
    "user_id": 13,
    "role_id": 34
  }
]);
};
