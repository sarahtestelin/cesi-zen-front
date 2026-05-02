export interface LoginRequest {
  mail: string;
  password: string;
  deviceInfo: string;
}

export interface AuthResponse {
  accessToken: string;
}
