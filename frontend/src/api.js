// Small helper around fetch() so every context doesn't repeat the same code.
// In dev, Vite proxies "/api" to the Express server (see vite.config.js).
const BASE_URL = 'https://madhav-event-fullstack.onrender.com/api'
const TOKEN_KEY = 'mwe_token'

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
  // When body is a FormData (e.g. a form with a file upload), let the browser
  // set its own multipart/form-data Content-Type (with boundary) instead of JSON.
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
