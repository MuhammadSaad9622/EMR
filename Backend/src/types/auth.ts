export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'doctor' | 'patient';
}

export interface SignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'patient' | 'doctor';
}

export interface AuthResponse {
    token: string;
    user: User;
} 