import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
let supabaseUrl = 'https://tyepalmkwoxcqzizkknx.supabase.co';
let supabaseAnonKey = 'sb_publishable_iYyOgT614bAR15DR-kPwAg_UsGe6IFd';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = trimmed.split('=')[1].trim();
    } else if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=')) {
      supabaseAnonKey = trimmed.split('=')[1].trim();
    }
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyTables() {
  console.log('======================================================');
  console.log('LIVE SUPABASE PRODUCTION DATABASE VERIFICATION');
  console.log('Endpoint:', supabaseUrl);
  console.log('======================================================\n');

  const tables = [
    'locations',
    'profiles',
    'customers',
    'items',
    'transactions',
    'transaction_items',
    'payments',
    'transaction_files',
    'audit_logs',
    'quote_requests'
  ];

  for (const table of tables) {
    const { data, error, status, count } = await supabase.from(table).select('*', { count: 'exact' });
    if (error) {
      console.log(`TABLE: ${table.padEnd(20)} | STATUS: ${status} | ERROR: ${error.message}`);
    } else {
      console.log(`TABLE: ${table.padEnd(20)} | STATUS: ${status} OK | ROWS: ${data.length} | SAMPLE: ${data.length > 0 ? JSON.stringify(data[0].name || data[0].full_name || data[0].id) : 'EMPTY'}`);
    }
  }

  console.log('\n--- STORAGE BUCKETS CHECK ---');
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('Live Storage Buckets:', buckets?.map(b => b.name).join(', '));
}

verifyTables();
