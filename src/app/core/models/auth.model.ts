export interface LoginRequest {
  mail: string;
  password: string;
  deviceInfo: string;
}

export interface RegisterRequest {
  mail: string;
  pseudo: string;
  password: string;
  deviceInfo: string;
}

export interface AuthResponse {
  accessToken: string;
}
