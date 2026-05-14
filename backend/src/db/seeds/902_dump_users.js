/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries for this table to avoid duplicates
  // Note: Cleanup script usually handles this, but here we do it per table if needed.
  // await knex('users').del();
  
  await knex('users').insert([
  {
    "id": 11,
    "full_name": "Administrador General",
    "email": "admin@tutibocado.local",
    "password_hash": "$2a$10$AqeCWMAURdwo2fT6RQx3EuZ5rpRBrc7pcbHiC0Uznb9.OgP4NJ5lG",
    "is_active": true,
    "created_at": "2026-05-14T16:05:25.045Z"
  },
  {
    "id": 12,
    "full_name": "Ana perez",
    "email": "fgdsgew1sd@gmail.com",
    "password_hash": "$2a$10$ppJ34gUy5Oc28OF2od97pulIJXO6V5Okjzy3fIaUqQ44rPk60yAka",
    "is_active": true,
    "created_at": "2026-05-14T16:06:15.735Z"
  },
  {
    "id": 13,
    "full_name": "Armando",
    "email": "juarezarmando@gmail.com",
    "password_hash": "$2a$10$S427h/UkZptKSoO2f.A8zOBpBOF1AhD6371zctTRcZSe5D9KzbPFK",
    "is_active": true,
    "created_at": "2026-05-14T16:08:37.446Z"
  }
]);
};
