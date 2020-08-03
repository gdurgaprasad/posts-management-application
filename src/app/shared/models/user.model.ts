export interface User {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  userId: string;
  token: string;
}
