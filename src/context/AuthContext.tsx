import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StoredUserAccount } from '../types';
import { db } from '../utils/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAdminSessionActive: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { 
    fullName: string; 
    email: string; 
    phone: string; 
    password: string; 
    city?: string; 
    address?: string; 
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  verifyAdminAccess: (passcodeOrPassword: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  lockAdminSession: () => void;
  allUsers: StoredUserAccount[];
  createEmployee: (data: any) => Promise<{ success: boolean; error?: string }>;
  updateUserRole: (userId: string, role: string) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCOUNTS_STORAGE_KEY = 'parailaf_registered_users_v1';
const CURRENT_SESSION_KEY = 'parailaf_current_user_session_v1';
const ADMIN_SESSION_KEY = 'parailaf_admin_session_unlocked_v1';

// Allowed Master Admin Passcodes
const MASTER_ADMIN_PASSCODES = ['admin2026', 'parailaf2026', 'admin123', '1234'];

// Pre-seeded accounts (Includes Administrator)
const SEED_USERS: StoredUserAccount[] = [
  {
    id: 'user_admin_oualid',
    fullName: 'Oualid Soulimani (Admin)',
    email: 'soulimani.oualid@gmail.com',
    phone: '0661234567',
    city: 'Oujda',
    address: 'Direction Parailaf Maroc',
    createdAt: '2026-08-01T08:00:00Z',
    role: 'admin',
    passwordHash: 'admin2026',
  },
  {
    id: 'user_admin_parailaf',
    fullName: 'Administrateur Parailaf',
    email: 'admin@parailaf.ma',
    phone: '0536701020',
    city: 'Casablanca',
    address: 'Direction Parailaf Maroc',
    createdAt: '2026-08-01T08:00:00Z',
    role: 'admin',
    passwordHash: 'parailaf2026',
  },
  {
    id: 'user_demo_02',
    fullName: 'Fatima Zahra Bennani',
    email: 'fatima.bennani@gmail.com',
    phone: '0650987654',
    city: 'Casablanca',
    address: 'Boulevard d’Anfa, Casablanca',
    createdAt: '2026-08-20T14:30:00Z',
    role: 'customer',
    passwordHash: 'maroc2026',
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Admin Session Lock State
  const [isAdminSessionActive, setIsAdminSessionActive] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const isAdmin = currentUser?.role === 'admin' || (currentUser?.email?.toLowerCase() === 'soulimani.oualid@gmail.com');

  // Sync users with Firestore
  const [usersLoaded, setUsersLoaded] = useState(false);

  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'users', 'parailaf_all_users_v1'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.users)) {
            // Update local storage with fresh data from Firestore
            localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(data.users));
          }
        } else {
          // Document doesn't exist yet, seed it if we have local users
          const localUsers = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
          if (localUsers) {
             setDoc(doc(db, 'users', 'parailaf_all_users_v1'), { users: JSON.parse(localUsers) }).catch(() => {});
          }
        }
        setUsersLoaded(true);
      }, (err) => {
        console.warn("Firebase users onSnapshot notice:", err?.message || err);
        setUsersLoaded(true);
      });
      return () => unsub();
    } catch (e) {
      console.warn("Firebase users sync notice:", e);
      setUsersLoaded(true);
    }
  }, []);

  // Initialize seed accounts if not already present
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      }
    } catch {
      // ignore
    }
  }, []);

  const getStoredUsers = (): StoredUserAccount[] => {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const hasOualid = parsed.some(u => u.email?.toLowerCase() === 'soulimani.oualid@gmail.com');
          let updated = parsed.map(u => {
            if (u.email?.toLowerCase() === 'soulimani.oualid@gmail.com' || u.email?.toLowerCase() === 'admin@parailaf.ma') {
              return { ...u, role: 'admin' as const };
            }
            return u;
          });
          if (!hasOualid) {
            updated = [SEED_USERS[0], ...updated];
          }
          return updated;
        }
      }
      return SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  };

  const saveStoredUsers = (users: StoredUserAccount[]) => {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(users));
      if (usersLoaded) {
        setDoc(doc(db, 'users', 'parailaf_all_users_v1'), { users }).catch(console.error);
      }
    } catch (e) {
      console.error('Failed to save users', e);
    }
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for UX realism
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim().replace(/\s+/g, '');

    const users = getStoredUsers();
    const found = users.find(
      (u) => 
        (u.email.toLowerCase() === cleanId || u.phone.replace(/\s+/g, '') === cleanPhone) &&
        u.passwordHash === password
    );

    if (!found) {
      return {
        success: false,
        error: 'Identifiants incorrects. Vérifiez votre email/téléphone et votre mot de passe.',
      };
    }

    const sessionUser: User = {
      id: found.id,
      fullName: found.fullName,
      email: found.email,
      phone: found.phone,
      city: found.city,
      address: found.address,
      createdAt: found.createdAt,
      role: found.role,
    };

    setCurrentUser(sessionUser);
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
    } catch {
      // ignore
    }

    if (found.role === 'admin' || found.email.toLowerCase() === 'soulimani.oualid@gmail.com') {
      setIsAdminSessionActive(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    city?: string;
    address?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim().replace(/\s+/g, '');

    if (!data.fullName.trim() || data.fullName.trim().length < 3) {
      return { success: false, error: 'Veuillez saisir votre nom et prénom complets.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Veuillez saisir une adresse email valide.' };
    }

    if (!cleanPhone || cleanPhone.length < 9) {
      return { success: false, error: 'Veuillez saisir un numéro de téléphone marocain valide.' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Le mot de passe doit comporter au moins 6 caractères.' };
    }

    const users = getStoredUsers();

    // Check if email or phone is already taken
    const existing = users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.phone.replace(/\s+/g, '') === cleanPhone
    );

    if (existing) {
      return {
        success: false,
        error: 'Un compte existe déjà avec cette adresse email ou ce numéro de téléphone.',
      };
    }

    const newUser: StoredUserAccount = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: data.fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      city: data.city?.trim() || 'Casablanca',
      address: data.address?.trim() || '',
      createdAt: new Date().toISOString(),
      role: 'customer',
      passwordHash: data.password,
    };

    const updatedList = [newUser, ...users];
    saveStoredUsers(updatedList);

    const sessionUser: User = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      city: newUser.city,
      address: newUser.address,
      createdAt: newUser.createdAt,
      role: newUser.role,
    };

    setCurrentUser(sessionUser);
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
    } catch {
      // ignore
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminSessionActive(false);
    try {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
    setIsAccountModalOpen(false);
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Non connecté' };

    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === currentUser.id);

    if (index === -1) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    const updatedUser: StoredUserAccount = {
      ...users[index],
      ...data,
    };

    users[index] = updatedUser;
    saveStoredUsers(users);

    const updatedSession: User = {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      city: updatedUser.city,
      address: updatedUser.address,
      createdAt: updatedUser.createdAt,
      role: updatedUser.role,
    };

    setCurrentUser(updatedSession);
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updatedSession));
    } catch {
      // ignore
    }

    return { success: true };
  };

  // Verify Admin Access
  const verifyAdminAccess = async (passcodeOrPassword: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 300));
    const input = passcodeOrPassword.trim();
    const cleanEmail = email?.trim().toLowerCase();

    // 1. Check if user is already logged in as admin
    if (currentUser && (currentUser.role === 'admin' || currentUser.email?.toLowerCase() === 'soulimani.oualid@gmail.com')) {
      setIsAdminSessionActive(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}
      return { success: true };
    }

    // 2. Check Master Passcodes
    if (MASTER_ADMIN_PASSCODES.includes(input)) {
      setIsAdminSessionActive(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}

      // If no admin user is currently logged in, automatically establish session as Administrator
      if (!currentUser || currentUser.role !== 'admin') {
        const adminAccount: User = {
          id: 'user_admin_oualid',
          fullName: 'Oualid Soulimani (Admin)',
          email: 'soulimani.oualid@gmail.com',
          phone: '0661234567',
          city: 'Oujda',
          address: 'Direction Parailaf Maroc',
          createdAt: new Date().toISOString(),
          role: 'admin',
        };
        setCurrentUser(adminAccount);
        try {
          localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(adminAccount));
        } catch {}
      }
      return { success: true };
    }

    // 3. Check credentials against registered admin accounts
    const users = getStoredUsers();
    const targetEmail = cleanEmail || 'soulimani.oualid@gmail.com';
    const adminUser = users.find((u) => 
      (u.email.toLowerCase() === targetEmail || u.email.toLowerCase() === 'admin@parailaf.ma') &&
      u.role === 'admin' &&
      (u.passwordHash === input || MASTER_ADMIN_PASSCODES.includes(input))
    );

    if (adminUser) {
      setIsAdminSessionActive(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}
      const sessionUser: User = {
        id: adminUser.id,
        fullName: adminUser.fullName,
        email: adminUser.email,
        phone: adminUser.phone,
        city: adminUser.city,
        address: adminUser.address,
        createdAt: adminUser.createdAt,
        role: 'admin',
      };
      setCurrentUser(sessionUser);
      try {
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
      } catch {}
      return { success: true };
    }

    return { 
      success: false, 
      error: "Accès refusé : Identifiants ou code de sécurité administrateur incorrects. Seul l'administrateur a accès au tableau de bord." 
    };
  };

  const lockAdminSession = () => {
    setIsAdminSessionActive(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
  };

  const [allUsers, setAllUsers] = useState<StoredUserAccount[]>([]);

  // Update allUsers when getStoredUsers is updated or from Firestore directly
  useEffect(() => {
    setAllUsers(getStoredUsers());
  }, [usersLoaded]);

  const createEmployee = async (data: any): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const users = getStoredUsers();
    
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Cette adresse email est déjà utilisée par un autre compte.' };
    }

    const newUser: StoredUserAccount = {
      id: `emp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      fullName: data.fullName,
      email: cleanEmail,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      role: data.role || 'employee',
      passwordHash: data.password || '123456', // Simple password for now
    };

    const updatedUsers = [newUser, ...users];
    saveStoredUsers(updatedUsers);
    setAllUsers(updatedUsers);
    return { success: true };
  };

  const updateUserRole = (userId: string, role: string) => {
    const users = getStoredUsers();
    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: role as any } : u);
    saveStoredUsers(updatedUsers);
    setAllUsers(updatedUsers);
    
    // Update current user if it's them
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: role as any } : prev);
    }
  };

  const deleteUser = (userId: string) => {
    const users = getStoredUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    saveStoredUsers(updatedUsers);
    setAllUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        isAdminSessionActive,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        isAccountModalOpen,
        setIsAccountModalOpen,
        login,
        register,
        logout,
        updateProfile,
        verifyAdminAccess,
        lockAdminSession,
        allUsers,
        createEmployee,
        updateUserRole,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
