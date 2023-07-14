export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expireAt: string;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  cellphone: string;
  password: string;
}
