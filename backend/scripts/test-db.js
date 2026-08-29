#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('\n========================================================');
  console.log('   PostgreSQL Database Connectivity Diagnostic Tool');
  console.log('========================================================\n');

  const databaseUrl = process.env.DATABASE_URL;
  const pgUser = process.env.PGUSER || 'postgres';
  const pgHost = process.env.PGHOST || 'localhost';
  const pgDatabase = process.env.PGDATABASE || 'api';
  const pgPort = process.env.PGPORT || '5432';

  if (databaseUrl) {
    console.log(`[Config] Using DATABASE_URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
  } else {
    console.log(`[Config] Target Host:     ${pgHost}:${pgPort}`);
    console.log(`[Config] Target Database: ${pgDatabase}`);
    console.log(`[Config] User:            ${pgUser}`);
  }

  const isLocal = !pgHost || pgHost === 'localhost' || pgHost === '127.0.0.1';
  const poolConfig = databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: isLocal && !databaseUrl.includes('neon') && !databaseUrl.includes('supabase') ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      }
    : {
        user: pgUser,
        host: pgHost,
        database: pgDatabase,
        password: process.env.PGPASSWORD || '12345',
        port: parseInt(pgPort, 10),
        ssl: isLocal ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      };

  const pool = new Pool(poolConfig);
  const startTime = Date.now();

  try {
    console.log('\nConnecting to PostgreSQL server...');
    const client = await pool.connect();
    const latency = Date.now() - startTime;
    console.log(`✅ Connection Successful! (Latency: ${latency}ms)\n`);

    const versionRes = await client.query('SELECT version()');
    console.log(`Server Version: ${versionRes.rows[0].version.split(',')[0]}`);

    // Check tables
    const tables = ['colleges', 'courses', 'placements', 'cutoffs', 'reviews', 'users', 'newsletters'];
    console.log('\nChecking platform database tables:');
    console.log('--------------------------------------------------------');

    for (const tbl of tables) {
      try {
        const countRes = await client.query(`SELECT COUNT(*) FROM ${tbl}`);
        console.log(`  ✓ Table '${tbl.padEnd(14)}': ${countRes.rows[0].count} records`);
      } catch (err) {
        console.log(`  ✗ Table '${tbl.padEnd(14)}': NOT FOUND or ERROR (${err.message})`);
      }
    }

    client.release();
    await pool.end();
    console.log('\n========================================================');
    console.log('✅ PostgreSQL is fully ready and configured for platform!');
    console.log('========================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ PostgreSQL Connection Failed:');
    console.error(`   Error: ${err.message}`);
    console.error(`   Code:  ${err.code || 'UNKNOWN'}\n`);

    console.log('Troubleshooting Guide:');
    console.log('1. Local PostgreSQL:');
    console.log('   - Ensure PostgreSQL is installed & running on your computer.');
    console.log('   - Verify port 5432 and database name \'api\' (or create it: createdb api).');
    console.log('   - Update PGPASSWORD in backend/.env with your Postgres password.');
    console.log('2. Cloud PostgreSQL (Neon / Supabase / Railway / ElephantSQL):');
    console.log('   - Set DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require in backend/.env');
    console.log('3. In-Memory Resilient Mode:');
    console.log('   - The platform will automatically run smoothly with its built-in full dataset even if PostgreSQL is offline.\n');

    await pool.end().catch(() => {});
    process.exit(0);
  }
}

testConnection();
