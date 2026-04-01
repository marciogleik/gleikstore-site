import { supabase } from './supabase'

// Tipos
export interface User {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  address: string
  role?: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt?: string
  profilePhoto?: {
    fileUrl: string
    uploadedAt: string
  }
}

export interface Product {
    id: string
    model: string
    capacity: string
    color: string
    condition: string
    imei: string
    price: number
    status: 'AVAILABLE' | 'SOLD' | 'RESERVED' | 'MAINTENANCE'
    createdAt: string
    updatedAt: string
}

export interface Sale {
    id: string
    customerId: string
    productId: string
    totalAmount: number
    paymentType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'CASH' | 'FINANCING'
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
    contractUrl: string | null
    saleDate: string
    customer?: {
        name: string
        cpf: string
        email: string
    }
    product?: Product
    payment?: Payment
}

export interface Payment {
    id: string
    saleId: string
    amount: number
    status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
    boletoUrl: string | null
    boletoBarcode: string | null
    dueDate: string
    paidAt: string | null
}

export interface Device {
    id: string
    userId: string
    model: string
    imei: string
    createdAt: string
    updatedAt: string
}

export interface Warranty {
    id: string
    imei: string
    model: string
    customerName: string
    purchaseDate: string
    warrantyEnd: string
    status: string
    observations?: string
}

export interface Document {
    id: string
    userId: string
    documentType: 'RG' | 'CPF' | 'COMPROVANTE_ENDERECO' | 'CONTRATO'
    fileUrl?: string | null
    modelName?: string | null
    signature?: string | null
    isDigital?: boolean
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    uploadedAt: string
}

// ============ CPF CONSULTA TYPES ============

export interface CpfConsultaHistoryItem {
    id: string
    cpf: string
    name: string | null
    score: number | null
    hasPendencies: boolean
    consultedAt: string
    admin: {
        name: string
    }
}

export interface CpfConsultaResult {
    consulta: {
        cpf: string
        name: string
        status: string
        score: number | null
        hasPendencies: boolean
        pendencies: any[]
        consultedAt: string
        rawData: any
    }
    cliente: User | null
    isDemo: boolean
}

// ============ AUTH ============

export interface AuthResponse {
    user: User
    session: any
}

export async function register(userData: any): Promise<AuthResponse> {
    const { email, password, name, cpf, phone, address } = userData
    
    // 1. Criar no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Falha ao criar usuário')

    // 2. Criar no Perfil (tabela users do banco)
    const { error: dbError } = await supabase
        .from('users')
        .insert([{
            id: authData.user.id,
            name,
            email,
            password: 'SUPABASE_AUTH',
            cpf,
            phone,
            address,
            role: 'USER'
        }])

    if (dbError) throw dbError

    const user: User = {
        id: authData.user.id,
        name,
        email,
        cpf,
        phone,
        address,
        role: 'USER',
        createdAt: new Date().toISOString()
    }

    return { user, session: authData.session }
}

export async function login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Falha no login')

    // Buscar dados do perfil na tabela 'users'
    const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

    if (dbError) throw dbError

    return { 
        user: userData as User, 
        session: authData.session 
    }
}

export async function getMe(): Promise<{ user: User }> {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) throw new Error('Sessão expirada')

    const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

    if (dbError) throw dbError

    return { user: userData as User }
}

export async function logout() {
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
        localStorage.removeItem('gleikstore_token') // Limpeza legada por segurança
    }
}

export async function getUser(): Promise<{ user: User }> {
    return getMe()
}

export async function updateUser(data: any): Promise<{ message: string; user: User }> {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) throw new Error('Não autenticado')

    const { data: updatedUser, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', authUser.id)
        .select()
        .single()

    if (error) throw error

    return { message: 'Perfil atualizado com sucesso!', user: updatedUser as User }
}

// ============ DEVICES & WARRANTIES ============

export async function getDevices(): Promise<{ devices: Device[] }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('userId', user.id)

    if (error) throw error
    return { devices: data || [] }
}

export async function createDevice(device: any): Promise<{ device: Device }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data, error } = await supabase
        .from('devices')
        .insert([{ ...device, userId: user.id }])
        .select()
        .single()

    if (error) throw error
    return { device: data as Device }
}

export async function getWarrantyByImei(imei: string): Promise<{ warranty: Warranty }> {
    const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('imei', imei)
        .single()

    if (error) throw error
    return { warranty: data as Warranty }
}

export async function updateDevice(id: string, data: any): Promise<{ message: string; device: Device }> {
    const { data: updatedDevice, error } = await supabase
        .from('devices')
        .update(data)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return { message: 'Aparelho atualizado com sucesso!', device: updatedDevice as Device }
}

// ============ INVENTORY ============

export async function getInventory(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('createdAt', { ascending: false })

    if (error) throw error
    return data || []
}

export async function addProduct(product: any): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()

    if (error) throw error
    return data as Product
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) throw error
    return { message: 'Produto removido com sucesso' }
}

// ============ SALES ============

export async function getSales(): Promise<Sale[]> {
    const { data, error } = await supabase
        .from('sales')
        .select('*, customer:users(name, cpf, email), product:products(*), payment:payments(*)')
        .order('saleDate', { ascending: false })

    if (error) throw error
    return data || []
}

export async function createSale(saleData: any): Promise<{ sale: Sale; payment: Payment | null }> {
    const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
            customerId: saleData.customerId,
            productId: saleData.productId,
            totalAmount: saleData.totalAmount,
            paymentType: saleData.paymentType,
            status: 'COMPLETED',
            saleDate: new Date().toISOString()
        }])
        .select()
        .single()

    if (saleError) throw saleError

    const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([{
            saleId: sale.id,
            amount: sale.totalAmount,
            status: 'PAID',
            dueDate: new Date().toISOString(),
            paidAt: new Date().toISOString()
        }])
        .select()
        .single()

    if (paymentError) throw paymentError

    await supabase
        .from('products')
        .update({ status: 'SOLD' })
        .eq('id', saleData.productId)

    return { sale: sale as Sale, payment: payment as Payment }
}

export async function confirmSalePayment(saleId: string): Promise<{ message: string; sale: Sale }> {
    const { data: sale, error } = await supabase
        .from('sales')
        .update({ status: 'COMPLETED' })
        .eq('id', saleId)
        .select()
        .single()

    if (error) throw error

    await supabase
        .from('payments')
        .update({ status: 'PAID', paidAt: new Date().toISOString() })
        .eq('saleId', saleId)

    return { message: 'Pagamento confirmado com sucesso', sale: sale as Sale }
}

// ============ UPLOAD & DOCUMENTS ============

export async function uploadProfilePhoto(file: File): Promise<{ message: string; profilePhoto: { fileUrl: string } }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/profile_${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

    const { error: dbError } = await supabase
        .from('documents') 
        .insert([{
            userId: user.id,
            documentType: 'RG', 
            fileUrl: publicUrl,
            status: 'APPROVED'
        }])

    if (dbError) throw dbError

    return { message: 'Foto enviada com sucesso', profilePhoto: { fileUrl: publicUrl } }
}

export async function uploadDocument(
    file: File,
    documentType: string
): Promise<{ message: string, document: any }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${documentType}_${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

    const { data: doc, error: dbError } = await supabase
        .from('documents')
        .insert([{
            userId: user.id,
            documentType,
            fileUrl: publicUrl,
            status: 'PENDING'
        }])
        .select()
        .single()

    if (dbError) throw dbError

    return { message: 'Documento enviado com sucesso', document: doc }
}

export async function uploadContract(file: File): Promise<{ message: string; document: any }> {
    return uploadDocument(file, 'CONTRATO')
}

export async function getDocuments(): Promise<{
    documents: any[]
    profilePhoto: { fileUrl: string } | null
}> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('userId', user.id)

    if (error) throw error

    const profilePhoto = data.find(d => d.documentType === 'RG' || d.documentType === 'PROFILE') 
    
    return { 
        documents: data || [],
        profilePhoto: profilePhoto ? { fileUrl: profilePhoto.fileUrl } : null
    }
}

// ============ DIGITAL CONTRACTS ============

export async function signDigitalContract(modelName: string, signature: string): Promise<Document> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data, error } = await supabase
        .from('documents')
        .insert([{
            userId: user.id,
            documentType: 'CONTRATO',
            modelName,
            signature,
            isDigital: true,
            status: 'APPROVED'
        }])
        .select()
        .single()

    if (error) throw error
    return data as Document
}

export async function getMyContract(): Promise<Document | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('userId', user.id)
        .eq('documentType', 'CONTRATO')
        .order('uploadedAt', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) throw error
    return data as Document
}

// ============ ADMIN ============

export async function getAdminCustomers(): Promise<{ customers: any[] }> {
    const { data, error } = await supabase
        .from('users')
        .select('*, sales(count)')
        .eq('role', 'USER')

    if (error) throw error
    
    const customers = (data || []).map(c => ({
        ...c,
        _count: { sales: (c as any).sales[0]?.count || 0 }
    }))

    return { customers }
}

export async function getAdminCustomerByCpf(cpf: string): Promise<{ user: User }> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('cpf', cpf)
        .single()

    if (error) throw error
    return { user: data as User }
}

export async function consultarCpf(cpf: string): Promise<any> {
    // AVISO: Isso expõe a chave se estiver no código. 
    // Em produção real, isso deve ser uma Supabase Edge Function.
    const apiKey = '7207dcb9d2c55fd01a7866667883ae2c155d46936b97067ad339bf1f051f90b3'
    const cleanCpf = cpf.replace(/\D/g, '')
    
    try {
        const response = await fetch(`https://apicpf.com/api/consulta?cpf=${cleanCpf}`, {
            headers: { 'X-API-KEY': apiKey }
        })
        const data = await response.json()
        
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('cpf_consultas').insert([{
                cpf: cleanCpf,
                name: data.nome || 'N/A',
                score: data.score || 500,
                hasPendencies: !!data.pendencias,
                status: data.situacao || 'REGULAR',
                consultedBy: user.id
            }])
        }

        return {
            consulta: {
                cpf: cleanCpf,
                name: data.nome || 'N/A',
                status: data.situacao || 'REGULAR',
                score: data.score || 500,
                hasPendencies: !!data.pendencias,
                pendencies: [],
                consultedAt: new Date().toISOString(),
                rawData: data
            },
            cliente: null,
            isDemo: false
        }
    } catch (e) {
        throw new Error('Falha na consulta de CPF externa.')
    }
}

export async function getCpfHistory(): Promise<{ consultas: any[] }> {
    const { data, error } = await supabase
        .from('cpf_consultas')
        .select('*, admin:users(name)')
        .order('consultedAt', { ascending: false })
        .limit(50)

    if (error) throw error
    return { consultas: data || [] }
}

export async function getAdminWarrantyByImei(imei: string): Promise<{ warranty: Warranty }> {
    const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('imei', imei)
        .single()

    if (error) throw error
    return { warranty: data as Warranty }
}

export async function saveAdminWarranty(data: any): Promise<{ message: string; warranty: Warranty }> {
    const { data: warranty, error } = await supabase
        .from('warranties')
        .upsert([{
            imei: data.imei,
            model: data.model,
            customerName: data.customerName,
            purchaseDate: data.purchaseDate,
            warrantyEnd: data.warrantyEnd,
            status: 'ACTIVE'
        }])
        .select()
        .single()

    if (error) throw error
    return { message: 'Garantia salva com sucesso', warranty: warranty as Warranty }
}

export async function adminChangeUserPassword(userId: string, password: string): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'Operação permitida apenas via e-mail de recuperação em modelos sem servidor.' }
}

export async function adminCreateUser(userData: any): Promise<{ success: boolean; message: string; user?: any }> {
    return { success: false, message: 'Criação de usuários administrativos deve ser feita via Supabase Dashboard ou Convite.' }
}
