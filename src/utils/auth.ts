const KEY = 'zhiyan_auth_user';

export interface AuthUser {
  username: string;
  role: 'admin' | 'user';
  loginAt: number;
}

export function login(username: string, password: string): AuthUser | null {
  if (username === 'admin_root' && password === 'admin_root') {
    const user: AuthUser = {
      username: 'admin_root',
      role: 'admin',
      loginAt: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem(KEY);
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getCurrentUser();
}
