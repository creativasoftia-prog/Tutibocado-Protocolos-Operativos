/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries for this table to avoid duplicates
  // Note: Cleanup script usually handles this, but here we do it per table if needed.
  // await knex('protocol_types').del();
  
  await knex('protocol_types').insert([
  {
    "id": 57,
    "name": "Infraestructura",
    "created_at": "2026-05-14T16:05:25.058Z"
  },
  {
    "id": 58,
    "name": "Insumos y consumibles",
    "created_at": "2026-05-14T16:05:25.089Z"
  },
  {
    "id": 59,
    "name": "Logística",
    "created_at": "2026-05-14T16:05:25.112Z"
  },
  {
    "id": 60,
    "name": "Tecnología/Soporte",
    "created_at": "2026-05-14T16:05:25.120Z"
  },
  {
    "id": 61,
    "name": "Capital Humano",
    "created_at": "2026-05-14T16:05:25.128Z"
  },
  {
    "id": 62,
    "name": "Sanidad",
    "created_at": "2026-05-14T16:05:25.158Z"
  },
  {
    "id": 63,
    "name": "Visitas de Dependencias Gubernamentales",
    "created_at": "2026-05-14T16:05:25.165Z"
  },
  {
    "id": 64,
    "name": "Finanzas",
    "created_at": "2026-05-14T16:05:25.172Z"
  },
  {
    "id": 65,
    "name": "Operativo",
    "created_at": "2026-05-14T16:05:25.193Z"
  },
  {
    "id": 66,
    "name": "Atención al Cliente",
    "created_at": "2026-05-14T16:05:25.201Z"
  },
  {
    "id": 67,
    "name": "Seguridad",
    "created_at": "2026-05-14T16:05:25.214Z"
  },
  {
    "id": 68,
    "name": "Promociones",
    "created_at": "2026-05-14T16:05:25.234Z"
  },
  {
    "id": 69,
    "name": "Equipos y Maquinaria",
    "created_at": "2026-05-14T16:05:25.282Z"
  },
  {
    "id": 70,
    "name": "Finanzas / Operativo",
    "created_at": "2026-05-14T16:05:25.398Z"
  }
]);
};
