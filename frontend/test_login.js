const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://oflocwxemmxczvskpxyg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mbG9jd3hlbW14Y3p2c2tweHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTQzNTcsImV4cCI6MjA4MDg5MDM1N30.rI6UtkhF4SZZIA1j4yMpxgQjcMroGkrJgxEwz7vu8kM');

async function test() {
  const email = 'marcio.junioor@gmail.com';
  const password = 'Marcio882@';
  
  console.log('1. Testando Login no Supabase Auth para: ' + email);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  
  if (authError) {
     console.error('=> ERRO CRÍTICO NO AUTH:', authError.message);
     process.exit(1);
  }
  console.log('=> SUCESSO NO AUTH! ID:', authData.user.id);
  
  console.log('2. Buscando perfil de usuário na tabela public.users...');
  const { data: userData, error: dbError } = await supabase.from('users').select('*').eq('id', authData.user.id).single();
  
  if (dbError) {
     console.error('=> ERRO CRÍTICO NO DB (Tabela users):', JSON.stringify(dbError, null, 2));
     process.exit(1);
  }
  
  console.log('=> TUDO OK! PERFIL ENCONTRADO:', userData.email, '| Permissão:', userData.role);
  process.exit(0);
}

test();
