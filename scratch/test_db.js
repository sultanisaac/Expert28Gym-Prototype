import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSultan() {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'sultan.work26@gmail.com')
    .single();
  
  if (error) {
    console.error("Error fetching Sultan's profile:", error);
  } else {
    console.log("Sultan's profile:", profile);
  }
}

checkSultan();
