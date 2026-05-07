import { createDatabaseConfig } from '../src/config/db.js';
import knex from 'knex';
const db = knex(createDatabaseConfig());
const rows = await db('protocols')
  .whereRaw("(name LIKE '%POS%' OR [trigger] LIKE '%POS%' OR description LIKE '%POS%' OR closing_criteria LIKE '%POS%' OR areas_json LIKE '%POS%')")
  .select('id', 'slug', 'name');
console.log(JSON.stringify(rows, null, 2));
const steps = await db('protocol_steps as ps')
  .join('protocols as p', 'p.id', 'ps.protocol_id')
  .whereRaw("ps.content LIKE '%POS%'")
  .select('p.slug', 'ps.protocol_id', 'ps.step_order', 'ps.content');
console.log('\nSTEPS:', JSON.stringify(steps, null, 2));
await db.destroy();
