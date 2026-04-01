const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://oflocwxemmxczvskpxyg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mbG9jd3hlbW14Y3p2c2tweHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTQzNTcsImV4cCI6MjA4MDg5MDM1N30.rI6UtkhF4SZZIA1j4yMpxgQjcMroGkrJgxEwz7vu8kM');

async function test() {
  const email = 'check' + Date.now() + '@gleikstore.com';
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email, password: 'SenhaForte123!', options: { data: { name: 'Teste' } }
  });
  
  if (authError) {
    console.error('=> ERRO AUTH:', authError.message);
    process.exit(1);
  }
  
  const { error: dbError } = await supabase.from('users').insert([{
    id: authData.user.id, name: 'Teste', email, cpf: '12345678900',
    phone: '123', address: '12', role: 'USER'
  }]);
  
  if (dbError) {
    console.error('=> ERRO DB:', JSON.stringify(dbError, null, 2));
    process.exit(1);
  }
  console.log('=> TUDO PERFEITAMENTE OK!');
  process.exit(0);
}

test();
