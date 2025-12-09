/**
 * Cliente Supabase para Storage
 * Usado para upload de arquivos (fotos, documentos, contratos)
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar se as variáveis estão configuradas
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase não configurado. Uploads serão salvos localmente.');
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

module.exports = supabase;
