const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://oflocwxemmxczvskpxyg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mbG9jd3hlbW14Y3p2c2tweHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTQzNTcsImV4cCI6MjA4MDg5MDM1N30.rI6UtkhF4SZZIA1j4yMpxgQjcMroGkrJgxEwz7vu8kM');

async function setupAdmin() {
  const email = 'marcio.junioor@gmail.com';
  const password = 'Marcio882@';
  
  console.log('1. Tentando fazer login para ver se a conta Auth já existe...');
  let { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  
  if (authError) {
    console.log('Login falhou (', authError.message, '). Tentando criar a conta do zero...');
    const result = await supabase.auth.signUp({
      email, password, options: { data: { name: 'Marcio Junior' } }
    });
    authData = result.data;
    if (result.error) {
       console.error('=> ERRO INCONTORNÁVEL NO AUTH:', result.error.message);
       process.exit(1);
    }
  }

  const userId = authData?.user?.id;
  if (!userId) {
     console.error('Falha ao obter ID do usuário.');
     process.exit(1);
  }

  console.log('2. Conta Auth garantida. ID:', userId);
  console.log('3. Checando se o Perfil de Usuário existe public.users...');
  
  const { data: existingUser } = await supabase.from('users').select('*').eq('id', userId).single();
  
  if (!existingUser) {
     console.log('Perfil não existe. Criando perfil...');
     const { error: insertError } = await supabase.from('users').insert([{
        id: userId,
        name: 'Marcio Junior',
        email: email,
        role: 'ADMIN',
        cpf: '00000000000',
        phone: '61999999999',
        address: 'Gleikstore'
     }]);
     if (insertError) {
        console.error('=> ERRO AO CRIAR PERFIL:', insertError);
        process.exit(1);
     }
  } else {
     console.log('Perfil já existe! Forçando ele a se tornar ADMIN...');
     const { error: updateError } = await supabase.from('users').update({ role: 'ADMIN' }).eq('id', userId);
     if (updateError) {
        console.error('=> ERRO AO DAR PERMISSÃO DE ADMIN:', updateError);
        process.exit(1);
     }
  }

  console.log('\n=======================================');
  console.log('🚀 SUCESSO ABSOLUTO! A conta foi configurada!');
  console.log('Email:', email);
  console.log('Senha:', password);
  console.log('Permissão: ADMIN');
  console.log('Pode tentar fazer login direto no site agora!');
  console.log('=======================================\n');
  process.exit(0);
}

setupAdmin();
