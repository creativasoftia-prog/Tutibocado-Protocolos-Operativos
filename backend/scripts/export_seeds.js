import knex from 'knex';
import fs from 'fs';
import path from 'path';
import { createDatabaseConfig } from '../src/config/db.js';

const config = createDatabaseConfig();
const db = knex(config);

const TABLES = [
  'roles',
  'users',
  'user_roles',
  'protocol_types',
  'protocols',
  'protocol_steps',
  'protocol_visibility_roles',
  'role_category_visibility',
  'employees',
  'hr_reports',
  'protocol_incidents',
  'audit_logs'
];

async function exportSeeds() {
  console.log('Starting seed export...');
  
  const seedsDir = path.resolve('src/db/seeds');
  if (!fs.existsSync(seedsDir)) {
    fs.mkdirSync(seedsDir, { recursive: true });
  }

  for (const table of TABLES) {
    try {
      console.log(`Exporting table: ${table}`);
      const data = await db(table).select('*');
      
      if (data.length === 0) {
        console.log(`Table ${table} is empty, skipping.`);
        continue;
      }

      // Format data: convert Date objects to ISO strings
      const formattedData = data.map(row => {
        const newRow = { ...row };
        for (const key in newRow) {
          if (newRow[key] instanceof Date) {
            newRow[key] = newRow[key].toISOString();
          }
        }
        return newRow;
      });

      const fileName = `999_dump_${table}.js`;
      const filePath = path.join(seedsDir, fileName);

      const content = `/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries for this table to avoid duplicates
  // Note: Cleanup script usually handles this, but here we do it per table if needed.
  // await knex('${table}').del();
  
  await knex('${table}').insert(${JSON.stringify(formattedData, null, 2)});
};
`;

      fs.writeFileSync(filePath, content);
      console.log(`Saved ${data.length} records to ${fileName}`);
    } catch (error) {
      console.error(`Error exporting table ${table}:`, error.message);
    }
  }

  console.log('Export finished.');
  process.exit(0);
}

exportSeeds();
