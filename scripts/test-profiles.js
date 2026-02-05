/**
 * Script de teste para verificar a tabela profiles no Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfiles() {
  console.log('🧪 Testando tabela profiles...\n');

  try {
    // Tentar buscar dados da tabela
    console.log('1️⃣ Tentando ler dados da tabela profiles...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao ler profiles:', error);
    } else {
      console.log('✅ Tabela profiles existe!');
      console.log('   Dados encontrados:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('   Exemplo de estrutura:', JSON.stringify(data[0], null, 2));
      }
    }

    // Tentar inserir um perfil de teste
    console.log('\n2️⃣ Tentando inserir um perfil de teste...');
    const testUserId = '00000000-0000-0000-0000-000000000001';
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: testUserId,
          account_type: 'teste',
          name: 'Teste',
        }
      ])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError.message);
      if (insertError.message.includes('permission')) {
        console.log('⚠️  Pode ser um problema de RLS (Row Level Security)');
      }
    } else {
      console.log('✅ Inserção de teste bem-sucedida!');
      console.log('   Dados inseridos:', insertData);
    }

    // Tentar fazer upsert
    console.log('\n3️⃣ Testando UPSERT...');
    const { data: upsertData, error: upsertError } = await supabase
      .from('profiles')
      .upsert([
        {
          user_id: testUserId,
          account_type: 'arrendatario',
          name: 'Teste Arrendatário',
        }
      ])
      .select();

    if (upsertError) {
      console.error('❌ Erro ao fazer upsert:', upsertError.message);
    } else {
      console.log('✅ UPSERT bem-sucedido!');
      console.log('   Dados:', upsertData);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testProfiles();
