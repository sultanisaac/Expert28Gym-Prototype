import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val.trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://xuajmsxpnedvjxhclzfd.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Signing in as client1@gmail.com...");
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'client1@gmail.com',
      password: 'client123',
    });

    if (authError) {
      console.error("Auth Error:", authError);
      return;
    }

    console.log("Auth Success, User ID:", authData.user.id);

    console.log("Querying profiles table for user ID...");
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    console.log("Profiles data:", data);
    console.log("Profiles error:", error);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
