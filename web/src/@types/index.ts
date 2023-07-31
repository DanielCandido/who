export interface Authenticate {
  token: string;
  refreshToken: string;
  expireIn: string;
  user: {
    id: string;
    image?: string;
    email: string;
    name: string;
  };
}

export interface Room {
  id: string;
  name: string;
  privacy: boolean;
  password?: string;
}
