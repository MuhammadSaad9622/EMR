const API_URL = 'http://localhost:5000/api';

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'doctor' | 'patient';
  };
}

interface SignupData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'patient';
}

export const api = {
  async login(emailOrUsername: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Sending login request:', {
        emailOrUsername,
        passwordLength: password.length,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: emailOrUsername.toLowerCase(),
          password 
        })
      });

      const data = await response.json();
      console.log('Login response:', {
        status: response.status,
        ok: response.ok,
        message: data.message
      });

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signup(data: SignupData): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign up');
    }

    return response.json();
  },

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    try {
      console.log('Sending password reset request:', {
        email,
        newPasswordLength: newPassword.length
      });

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();
      console.log('Password reset response:', {
        status: response.status,
        ok: response.ok,
        message: data.message
      });

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
}; 