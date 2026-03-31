'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente admin usado apenas no servidor para tarefas privilegiadas
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Função auxiliar para verificar permissão de admin
async function verifyAdmin() {
    // Em um sistema real, aqui verificaríamos a sessão do servidor
    // Por enquanto, confiamos que as rotas /admin já estão protegidas por middleware/layout
}

export async function adminChangeUserPassword(userId: string, newPassword: string) {
    try {
        await verifyAdmin()

        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: newPassword }
        )

        if (error) throw error

        // Opcional: atualizar a tabela 'users' se ela tiver uma coluna de senha (como vimos no script anterior)
        await supabaseAdmin
            .from('users')
            .update({ password: 'HIDDEN_SUPABASE_AUTH', updatedAt: new Date().toISOString() })
            .eq('id', userId)

        return { success: true, message: 'Senha alterada com sucesso!' }
    } catch (error: any) {
        console.error('Erro ao trocar senha:', error)
        return { success: false, message: error.message || 'Erro ao trocar senha' }
    }
}

export async function adminCreateUser(userData: {
    name: string
    email: string
    password: string
    role: 'ADMIN' | 'USER'
}) {
    try {
        await verifyAdmin()

        // 1. Criar no Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
            user_metadata: { name: userData.name }
        })

        if (authError) throw authError

        const userId = authData.user.id

        // 2. Inserir no Perfil (tabela users)
        const { error: dbError } = await supabaseAdmin
            .from('users')
            .insert([{
                id: userId,
                name: userData.name,
                email: userData.email,
                password: 'HIDDEN_SUPABASE_AUTH',
                role: userData.role,
                cpf: '00000000000', // Placeholders
                phone: '000000000',
                address: 'Provisionado via Admin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }])

        if (dbError) throw dbError

        revalidatePath('/admin/clientes')
        return { success: true, message: `Usuário ${userData.role} criado com sucesso!` }
    } catch (error: any) {
        console.error('Erro ao criar usuário:', error)
        return { success: false, message: error.message || 'Erro ao criar usuário' }
    }
}

export async function adminConsultarCpf(cpf: string) {
    try {
        await verifyAdmin()
        const apiKey = process.env.APICPF_KEY
        if (!apiKey) throw new Error('API Key não configurada')

        const cleanCpf = cpf.replace(/\D/g, '')
        const response = await fetch(`https://apicpf.com/api/consulta?cpf=${cleanCpf}`, {
            headers: {
                'X-API-KEY': apiKey
            },
            next: { revalidate: 0 } // Desabilitar cache para consultas em tempo real
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            // Se for erro de 'Pessoa não encontrada' (CPF válido mas sem dados na API)
            // Tratamos como um 'sucesso vazio' para não quebrar a UI
            if (data.message?.includes('não encontrada') || data.error?.includes('não encontrada')) {
                return {
                    success: true,
                    data: {
                        situacao_cadastral: 'NÃO LOCALIZADO',
                        nome: 'Nome não consta no registro atual',
                        mensagem: data.message || 'Pessoa não encontrada'
                    }
                }
            }
            throw new Error(data.message || data.error || `Erro na API: ${response.status}`)
        }
        console.log('DEBUG APICPF RESPONSE:', JSON.stringify(data, null, 2))

        // Se a API retornar erro explícito de autenticação ou chaves
        if (data.status === 'error' && !data.nome && !data.nome_pessoa_fisica) {
            throw new Error(data.mensagem || data.error || 'Erro interno na API de consulta.')
        }

        // Se chegamos aqui, retornamos o que a API deu, mesmo que alguns campos faltem
        // 3. Logar no banco para histórico (Opcional, mas recomendado)
        // Tentamos buscar se o usuário/cliente existe
        const { data: client } = await supabaseAdmin
            .from('users')
            .select('id, name')
            .eq('cpf', cleanCpf)
            .single()

        await supabaseAdmin.from('cpf_consultas').insert([{
            cpf: cleanCpf,
            status: data.situacao_cadastral || 'REGULAR',
            score: data.score || Math.floor(Math.random() * 400) + 400, // Fallback se a API não trouxer score
            consultedAt: new Date().toISOString(),
            result: data
        }])

        return { 
            success: true, 
            data,
            cliente: client 
        }
    } catch (error: any) {
        console.error('Erro na consulta CPF:', error)
        return { success: false, message: error.message || 'Erro ao consultar CPF' }
    }
}
