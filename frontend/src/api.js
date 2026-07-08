export const API_ORIGIN = import.meta.env.VITE_API_URL || ''

const BASE_URL = `${API_ORIGIN}/api`
const TOKEN_KEY = 'mwe_token'

export function getImageUrl(imagePath) {
  if (!imagePath) return ''
  if (/^(https?:|blob:|data:)/.test(imagePath)) return imagePath
  return `${API_ORIGIN}${imagePath}`
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }

  return data
}
