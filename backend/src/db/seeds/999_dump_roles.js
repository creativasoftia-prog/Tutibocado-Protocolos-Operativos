/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries for this table to avoid duplicates
  // Note: Cleanup script usually handles this, but here we do it per table if needed.
  // await knex('roles').del();
  
  await knex('roles').insert([
  {
    "id": 31,
    "name": "gerente",
    "description": "Gerencia Operativa",
    "is_system": true,
    "created_at": "2026-05-14T16:05:25.032Z"
  },
  {
    "id": 32,
    "name": "supervisor",
    "description": "Supervisión de Piso",
    "is_system": true,
    "created_at": "2026-05-14T16:05:25.035Z"
  },
  {
    "id": 33,
    "name": "operador",
    "description": "Personal Operativo",
    "is_system": true,
    "created_at": "2026-05-14T16:05:25.038Z"
  },
  {
    "id": 35,
    "name": "capital_humano",
    "description": "Recursos Humanos",
    "is_system": true,
    "created_at": "2026-05-14T16:05:25.043Z"
  },
  {
    "id": 30,
    "name": "administrador",
    "description": "Administrador del Sistema",
    "is_system": true,
    "created_at": "2026-05-14T16:05:25.028Z"
  },
  {
    "id": 34,
    "name": "sucursal",
    "description": "Acceso de Sucursal",
    "is_system": true,
    "created_at": "2026-05-14T16:05:25.041Z"
  }
]);
};
