/**
 * Cliente API para comunicação com o backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Tipos
export interface User {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  address: string
  createdAt: string
  updatedAt?: string
  profilePhoto?: {
    fileUrl: string
    uploadedAt: string
  }
  devices?: Device[]
  documents?: Document[]
}

export interface Device {
  id: string
  model: string
  imei: string
  purchaseDate: string
  warrantyEnd: string
}

export interface Document {
  id: string
  documentType: 'RG' | 'CPF' | 'COMPROVANTE_ENDERECO' | 'CONTRATO'
  fileUrl: string
  uploadedAt: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

// Função para obter token do localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('gleikstore_token')
}

// Função para salvar token
export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gleikstore_token', token)
  }
}

// Função para remover token
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gleikstore_token')
  }
}

// Função base para requisições
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição')
  }

  return data
}

// ============ AUTH ============

export async function register(userData: {
  name: string
  email: string
  password: string
  cpf: string
  phone: string
  address: string
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function login(credentials: {
  email: string
  password: string
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function getMe(): Promise<{ user: User }> {
  return request<{ user: User }>('/auth/me')
}

// ============ USER ============

export async function getUser(): Promise<{ user: User }> {
  return request<{ user: User }>('/user')
}

export async function updateUser(data: {
  name?: string
  phone?: string
  address?: string
  currentPassword?: string
  newPassword?: string
}): Promise<{ message: string; user: User }> {
  return request<{ message: string; user: User }>('/user', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ============ DEVICE ============

export async function getDevices(): Promise<{ devices: Device[] }> {
  return request<{ devices: Device[] }>('/device')
}

export async function createDevice(data: {
  model: string
  imei: string
  purchaseDate: string
  warrantyEnd: string
}): Promise<{ message: string; device: Device }> {
  return request<{ message: string; device: Device }>('/device', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateDevice(
  id: string,
  data: Partial<Device>
): Promise<{ message: string; device: Device }> {
  return request<{ message: string; device: Device }>(`/device/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ============ UPLOAD ============

export async function uploadProfilePhoto(file: File): Promise<{ message: string; profilePhoto: { fileUrl: string } }> {
  const token = getToken()
  const formData = new FormData()
  formData.append('photo', file)

  const response = await fetch(`${API_URL}/upload/profile-photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erro no upload')
  }

  return data
}

export async function uploadDocument(
  file: File,
  documentType: 'RG' | 'CPF' | 'COMPROVANTE_ENDERECO'
): Promise<{ message: string; document: Document }> {
  const token = getToken()
  const formData = new FormData()
  formData.append('document', file)
  formData.append('documentType', documentType)

  const response = await fetch(`${API_URL}/upload/document`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erro no upload')
  }

  return data
}

export async function uploadContract(file: File): Promise<{ message: string; document: Document }> {
  const token = getToken()
  const formData = new FormData()
  formData.append('contract', file)

  const response = await fetch(`${API_URL}/upload/contract`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erro no upload')
  }

  return data
}

export async function getDocuments(): Promise<{
  documents: Document[]
  profilePhoto: { fileUrl: string } | null
}> {
  return request<{ documents: Document[]; profilePhoto: { fileUrl: string } | null }>(
    '/upload/documents'
  )
}
