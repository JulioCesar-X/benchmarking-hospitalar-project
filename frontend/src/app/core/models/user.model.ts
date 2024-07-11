export interface Role {
  id: number;
  role_name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role_id: number | null;
  roles: Role[];
}