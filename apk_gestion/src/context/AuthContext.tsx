import React, { createContext, useState, ReactNode, useContext } from 'react';

interface User {
  id: number;
  name: string;
  role: string;
}

interface AuthContextProps {
  userRole: string | null;
  login: (role: string) => void;
  logout: () => void;
  roles: { [key: string]: string };
}

const roles = {
  ADMIN: 'admin',
  USER: 'user',
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  const login = (role: string) => setUserRole(role);
  const logout = () => setUserRole(null);

  return (
    <AuthContext.Provider value={{ userRole, login, logout, roles }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, roles };
