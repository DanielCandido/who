export interface AuthRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  image?: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expireAt: string;
  user: UserResponse;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  cellphone: string;
  password: string;
}

export interface SyncSocketRequest {
  clientId: string;
}

export interface CreateRoom {
  name: string;
  privacy: boolean;
  password?: string;
}
