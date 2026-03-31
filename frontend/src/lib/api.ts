const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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

// ============ TOKEN MANAGEMENT ============

export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('gleikstore_token', token)
    }
}

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('gleikstore_token')
    }
    return null
}

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('gleikstore_token')
    }
}

// ============ REQUEST HELPER ============

async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = getToken()
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    }

    // Se no FormData, remover Content-Type para o browser setar automaticamente com o boundary
    if (options.body instanceof FormData) {
        delete (headers as any)['Content-Type']
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${options.method || 'GET'} ${API_URL}${endpoint}`)
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    const contentType = response.headers.get('content-type')
    if (contentType && !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('[API ERROR] Resposta não é JSON:', text.substring(0, 500))
        throw new Error(`Erro na API: O servidor retornou HTML em vez de JSON. Verifique se o backend está rodando em: ${API_URL}`)
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição')
    }

    return data
}

// ============ AUTH ============

export interface AuthResponse {
    user: User
    token: string
}

export async function register(userData: any): Promise<AuthResponse> {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    })
    setToken(data.token)
    return data
}

export async function login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    })
    setToken(data.token)
    return data
}

export async function getMe(): Promise<{ user: User }> {
    return apiRequest('/auth/me')
}

// Alias para compatibilidade
export async function getUser(): Promise<{ user: User }> {
    return getMe()
}

export async function updateUser(data: any): Promise<{ message: string; user: User }> {
    return apiRequest('/user', {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

// ============ DEVICES & WARRANTIES ============

export async function getDevices(): Promise<{ devices: Device[] }> {
    const data = await apiRequest('/device')
     // Forçar array
    return { devices: Array.isArray(data) ? data : data.devices || [] }
}

export async function createDevice(device: any): Promise<{ device: Device }> {
    return apiRequest('/device', {
        method: 'POST',
        body: JSON.stringify(device),
    })
}

export async function getWarrantyByImei(imei: string): Promise<{ warranty: Warranty }> {
    return apiRequest(`/device/warranty/${imei}`)
}

// ============ INVENTORY ============

export async function getInventory(): Promise<Product[]> {
    return apiRequest('/inventory')
}

export async function addProduct(product: any): Promise<Product> {
    return apiRequest('/inventory', {
        method: 'POST',
        body: JSON.stringify(product),
    })
}

// ============ SALES ============

export async function getSales(): Promise<Sale[]> {
    return apiRequest('/sales')
}

export async function createSale(saleData: any): Promise<{ sale: Sale; payment: Payment | null }> {
    return apiRequest('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
    })
}

// ============ UPLOAD & DOCUMENTS ============

export async function uploadProfilePhoto(file: File): Promise<{ message: string; profilePhoto: { fileUrl: string } }> {
    const formData = new FormData()
    formData.append('photo', file)
    return apiRequest('/upload/profile-photo', {
        method: 'POST',
        body: formData,
    })
}

export async function uploadDocument(
    file: File,
    documentType: string
): Promise<{ message: string, document: any }> {
    const formData = new FormData()
    formData.append('document', file)
    formData.append('documentType', documentType)
    return apiRequest('/upload/document', {
        method: 'POST',
        body: formData,
    })
}

export async function uploadContract(file: File): Promise<{ message: string; document: any }> {
    const formData = new FormData()
    formData.append('contract', file)
    return apiRequest('/upload/contract', {
        method: 'POST',
        body: formData,
    })
}

export async function getDocuments(): Promise<{
    documents: any[]
    profilePhoto: { fileUrl: string } | null
}> {
    return apiRequest('/upload/documents')
}

// ============ DIGITAL CONTRACTS ============

export async function signDigitalContract(modelName: string, signature: string): Promise<Document> {
    const data = await apiRequest('/contracts/sign', {
        method: 'POST',
        body: JSON.stringify({ modelName, signature }),
    })
    return data.document
}

export async function getMyContract(): Promise<Document | null> {
    const data = await apiRequest('/contracts/my-contract')
    return data.contract
}

// ============ ADMIN ============

export async function getAdminCustomers(): Promise<{ customers: any[] }> {
    const data = await apiRequest('/admin/customers')
    return { customers: Array.isArray(data.customers) ? data.customers : [] }
}

export async function getAdminCustomerByCpf(cpf: string): Promise<{ user: User }> {
    return apiRequest(`/admin/customers/${cpf}`)
}

export async function consultarCpf(cpf: string): Promise<any> {
    return apiRequest(`/admin/cpf/consultar/${cpf}`, { method: 'POST' })
}

export async function getCpfHistory(): Promise<{ consultas: any[] }> {
    const data = await apiRequest('/admin/cpf/history')
    return { consultas: data.consultas || [] }
}
