export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface ApiError {
  message: string;
}

class ApiService {
  private baseURL = 'http://localhost:8080/api';

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Manejo específico de errores
        if (response.status === 401) {
          errorMessage = 'Token de autenticación inválido o expirado';
        } else if (response.status === 403) {
          errorMessage = 'No tienes permisos para acceder a este recurso';
        } else if (response.status === 404) {
          errorMessage = 'Recurso no encontrado';
        }
        
        const error: ApiError = await response.json().catch(() => ({
          message: errorMessage
        }));
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Test endpoints
  async getPublicData(): Promise<string> {
    return this.request<string>('/test/public');
  }

  async getProtectedData(): Promise<string> {
    return this.request<string>('/test/protected');
  }

  async getAdminData(): Promise<string> {
    return this.request<string>('/test/admin');
  }
}

export const apiService = new ApiService();

// Interfaz para respuestas estándar de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Función de utilidad para hacer peticiones API con formato estándar
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const result = await apiService.request<T>(endpoint, options);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
