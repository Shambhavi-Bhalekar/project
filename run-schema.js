const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:Shambhavi15@db.hllfsdbjzcqhjscbgyei.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!');
    
    const sql = fs.readFileSync('./backend/schema.sql', 'utf8');
    console.log('Executing schema.sql...');
    await client.query(sql);
    console.log('Successfully executed schema.sql!');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
