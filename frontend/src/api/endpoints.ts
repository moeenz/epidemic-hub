const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000"

export function buildEndpoint(path: string): string {
  return `${API_BASE_URL}${path}`
}
