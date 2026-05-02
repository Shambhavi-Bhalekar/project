const { Client } = require('pg');
const fs = require('fs');

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-east-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1',
  'ca-central-1', 'eu-central-1', 'eu-west-1', 'eu-west-2',
  'eu-south-1', 'eu-west-3', 'eu-north-1', 'me-south-1',
  'sa-east-1'
];

async function tryConnect(region) {
  const connectionString = `postgresql://postgres.hllfsdbjzcqhjscbgyei:Shambhavi15@aws-0-${region}.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`\nSUCCESS! Connected to region: ${region}`);
    
    console.log('Running schema.sql...');
    const sql = fs.readFileSync('./backend/schema.sql', 'utf8');
    await client.query(sql);
    console.log('Successfully created tables!');
    
    console.log('Reloading schema cache...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('Cache reloaded!');
    
    await client.end();
    process.exit(0);
  } catch (err) {
    process.stdout.write('.');
    await client.end().catch(()=>{}).finally(()=>{});
  }
}

async function runAll() {
  console.log('Brute-forcing Supabase pooler regions...');
  // Run sequentially to avoid exhausting socket limits, or in parallel
  const promises = regions.map(r => tryConnect(r));
  await Promise.all(promises);
  console.log('\nFailed to connect to any region pooler.');
}

runAll();
