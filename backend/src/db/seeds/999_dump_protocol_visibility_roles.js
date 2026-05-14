/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries for this table to avoid duplicates
  // Note: Cleanup script usually handles this, but here we do it per table if needed.
  // await knex('protocol_visibility_roles').del();
  
  await knex('protocol_visibility_roles').insert([
  {
    "protocol_id": 209,
    "role_id": 31
  },
  {
    "protocol_id": 209,
    "role_id": 32
  },
  {
    "protocol_id": 209,
    "role_id": 33
  },
  {
    "protocol_id": 210,
    "role_id": 31
  },
  {
    "protocol_id": 210,
    "role_id": 32
  },
  {
    "protocol_id": 210,
    "role_id": 33
  },
  {
    "protocol_id": 211,
    "role_id": 31
  },
  {
    "protocol_id": 211,
    "role_id": 32
  },
  {
    "protocol_id": 211,
    "role_id": 33
  },
  {
    "protocol_id": 212,
    "role_id": 31
  },
  {
    "protocol_id": 212,
    "role_id": 32
  },
  {
    "protocol_id": 212,
    "role_id": 33
  },
  {
    "protocol_id": 213,
    "role_id": 31
  },
  {
    "protocol_id": 213,
    "role_id": 32
  },
  {
    "protocol_id": 213,
    "role_id": 33
  },
  {
    "protocol_id": 214,
    "role_id": 31
  },
  {
    "protocol_id": 214,
    "role_id": 32
  },
  {
    "protocol_id": 214,
    "role_id": 33
  },
  {
    "protocol_id": 215,
    "role_id": 31
  },
  {
    "protocol_id": 215,
    "role_id": 32
  },
  {
    "protocol_id": 215,
    "role_id": 33
  },
  {
    "protocol_id": 216,
    "role_id": 31
  },
  {
    "protocol_id": 216,
    "role_id": 32
  },
  {
    "protocol_id": 216,
    "role_id": 33
  },
  {
    "protocol_id": 217,
    "role_id": 31
  },
  {
    "protocol_id": 217,
    "role_id": 32
  },
  {
    "protocol_id": 217,
    "role_id": 33
  },
  {
    "protocol_id": 218,
    "role_id": 31
  },
  {
    "protocol_id": 218,
    "role_id": 32
  },
  {
    "protocol_id": 218,
    "role_id": 33
  },
  {
    "protocol_id": 219,
    "role_id": 31
  },
  {
    "protocol_id": 219,
    "role_id": 32
  },
  {
    "protocol_id": 219,
    "role_id": 33
  },
  {
    "protocol_id": 220,
    "role_id": 31
  },
  {
    "protocol_id": 220,
    "role_id": 32
  },
  {
    "protocol_id": 220,
    "role_id": 33
  },
  {
    "protocol_id": 221,
    "role_id": 31
  },
  {
    "protocol_id": 221,
    "role_id": 32
  },
  {
    "protocol_id": 221,
    "role_id": 33
  },
  {
    "protocol_id": 222,
    "role_id": 31
  },
  {
    "protocol_id": 222,
    "role_id": 32
  },
  {
    "protocol_id": 222,
    "role_id": 33
  },
  {
    "protocol_id": 223,
    "role_id": 31
  },
  {
    "protocol_id": 223,
    "role_id": 32
  },
  {
    "protocol_id": 223,
    "role_id": 33
  },
  {
    "protocol_id": 224,
    "role_id": 31
  },
  {
    "protocol_id": 224,
    "role_id": 32
  },
  {
    "protocol_id": 224,
    "role_id": 33
  },
  {
    "protocol_id": 225,
    "role_id": 31
  },
  {
    "protocol_id": 225,
    "role_id": 32
  },
  {
    "protocol_id": 225,
    "role_id": 33
  },
  {
    "protocol_id": 226,
    "role_id": 31
  },
  {
    "protocol_id": 226,
    "role_id": 32
  },
  {
    "protocol_id": 226,
    "role_id": 33
  },
  {
    "protocol_id": 227,
    "role_id": 31
  },
  {
    "protocol_id": 227,
    "role_id": 32
  },
  {
    "protocol_id": 227,
    "role_id": 33
  },
  {
    "protocol_id": 228,
    "role_id": 31
  },
  {
    "protocol_id": 228,
    "role_id": 32
  },
  {
    "protocol_id": 228,
    "role_id": 33
  },
  {
    "protocol_id": 229,
    "role_id": 31
  },
  {
    "protocol_id": 229,
    "role_id": 32
  },
  {
    "protocol_id": 229,
    "role_id": 33
  },
  {
    "protocol_id": 230,
    "role_id": 31
  },
  {
    "protocol_id": 230,
    "role_id": 32
  },
  {
    "protocol_id": 230,
    "role_id": 33
  },
  {
    "protocol_id": 231,
    "role_id": 31
  },
  {
    "protocol_id": 231,
    "role_id": 32
  },
  {
    "protocol_id": 231,
    "role_id": 33
  },
  {
    "protocol_id": 232,
    "role_id": 31
  },
  {
    "protocol_id": 232,
    "role_id": 32
  },
  {
    "protocol_id": 232,
    "role_id": 33
  },
  {
    "protocol_id": 233,
    "role_id": 31
  },
  {
    "protocol_id": 233,
    "role_id": 32
  },
  {
    "protocol_id": 233,
    "role_id": 33
  },
  {
    "protocol_id": 234,
    "role_id": 31
  },
  {
    "protocol_id": 234,
    "role_id": 32
  },
  {
    "protocol_id": 234,
    "role_id": 33
  },
  {
    "protocol_id": 235,
    "role_id": 31
  },
  {
    "protocol_id": 235,
    "role_id": 32
  },
  {
    "protocol_id": 235,
    "role_id": 33
  },
  {
    "protocol_id": 236,
    "role_id": 31
  },
  {
    "protocol_id": 236,
    "role_id": 32
  },
  {
    "protocol_id": 236,
    "role_id": 33
  },
  {
    "protocol_id": 237,
    "role_id": 31
  },
  {
    "protocol_id": 237,
    "role_id": 32
  },
  {
    "protocol_id": 237,
    "role_id": 33
  },
  {
    "protocol_id": 238,
    "role_id": 31
  },
  {
    "protocol_id": 238,
    "role_id": 32
  },
  {
    "protocol_id": 238,
    "role_id": 33
  },
  {
    "protocol_id": 239,
    "role_id": 31
  },
  {
    "protocol_id": 239,
    "role_id": 32
  },
  {
    "protocol_id": 239,
    "role_id": 33
  },
  {
    "protocol_id": 240,
    "role_id": 31
  },
  {
    "protocol_id": 240,
    "role_id": 32
  },
  {
    "protocol_id": 240,
    "role_id": 33
  },
  {
    "protocol_id": 241,
    "role_id": 31
  },
  {
    "protocol_id": 241,
    "role_id": 32
  },
  {
    "protocol_id": 241,
    "role_id": 33
  },
  {
    "protocol_id": 242,
    "role_id": 31
  },
  {
    "protocol_id": 242,
    "role_id": 32
  },
  {
    "protocol_id": 242,
    "role_id": 33
  },
  {
    "protocol_id": 243,
    "role_id": 31
  },
  {
    "protocol_id": 243,
    "role_id": 32
  },
  {
    "protocol_id": 243,
    "role_id": 33
  },
  {
    "protocol_id": 244,
    "role_id": 31
  },
  {
    "protocol_id": 244,
    "role_id": 32
  },
  {
    "protocol_id": 244,
    "role_id": 33
  },
  {
    "protocol_id": 245,
    "role_id": 31
  },
  {
    "protocol_id": 245,
    "role_id": 32
  },
  {
    "protocol_id": 245,
    "role_id": 33
  },
  {
    "protocol_id": 246,
    "role_id": 31
  },
  {
    "protocol_id": 246,
    "role_id": 32
  },
  {
    "protocol_id": 246,
    "role_id": 33
  },
  {
    "protocol_id": 247,
    "role_id": 31
  },
  {
    "protocol_id": 247,
    "role_id": 32
  },
  {
    "protocol_id": 247,
    "role_id": 33
  },
  {
    "protocol_id": 248,
    "role_id": 31
  },
  {
    "protocol_id": 248,
    "role_id": 32
  },
  {
    "protocol_id": 248,
    "role_id": 33
  },
  {
    "protocol_id": 249,
    "role_id": 31
  },
  {
    "protocol_id": 249,
    "role_id": 32
  },
  {
    "protocol_id": 249,
    "role_id": 33
  },
  {
    "protocol_id": 250,
    "role_id": 31
  },
  {
    "protocol_id": 250,
    "role_id": 32
  },
  {
    "protocol_id": 250,
    "role_id": 33
  },
  {
    "protocol_id": 251,
    "role_id": 31
  },
  {
    "protocol_id": 251,
    "role_id": 32
  },
  {
    "protocol_id": 251,
    "role_id": 33
  },
  {
    "protocol_id": 252,
    "role_id": 31
  },
  {
    "protocol_id": 252,
    "role_id": 32
  },
  {
    "protocol_id": 252,
    "role_id": 33
  },
  {
    "protocol_id": 253,
    "role_id": 31
  },
  {
    "protocol_id": 253,
    "role_id": 32
  },
  {
    "protocol_id": 253,
    "role_id": 33
  },
  {
    "protocol_id": 254,
    "role_id": 31
  },
  {
    "protocol_id": 254,
    "role_id": 32
  },
  {
    "protocol_id": 254,
    "role_id": 33
  },
  {
    "protocol_id": 255,
    "role_id": 31
  },
  {
    "protocol_id": 255,
    "role_id": 32
  },
  {
    "protocol_id": 255,
    "role_id": 33
  },
  {
    "protocol_id": 256,
    "role_id": 31
  },
  {
    "protocol_id": 256,
    "role_id": 32
  },
  {
    "protocol_id": 256,
    "role_id": 33
  },
  {
    "protocol_id": 257,
    "role_id": 31
  },
  {
    "protocol_id": 257,
    "role_id": 32
  },
  {
    "protocol_id": 257,
    "role_id": 33
  },
  {
    "protocol_id": 258,
    "role_id": 31
  },
  {
    "protocol_id": 258,
    "role_id": 32
  },
  {
    "protocol_id": 258,
    "role_id": 33
  },
  {
    "protocol_id": 259,
    "role_id": 31
  },
  {
    "protocol_id": 259,
    "role_id": 32
  },
  {
    "protocol_id": 259,
    "role_id": 33
  },
  {
    "protocol_id": 260,
    "role_id": 31
  },
  {
    "protocol_id": 260,
    "role_id": 32
  },
  {
    "protocol_id": 260,
    "role_id": 33
  },
  {
    "protocol_id": 217,
    "role_id": 34
  }
]);
};
