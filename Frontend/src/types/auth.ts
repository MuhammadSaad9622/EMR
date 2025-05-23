export type Role = 'Doctor' | 'Patient' | 'Admin';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
}