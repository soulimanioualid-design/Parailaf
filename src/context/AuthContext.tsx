import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StoredUserAccount, UserRole } from '../types';
import { db } from '../utils/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export type AdminTab = 'orders' | 'email' | 'analytics' | 'new-order' | 'media' | 'employees' | 'products' | 'languages';

export interface RoleConfig {
  role: UserRole;
  name: string;
  label: string;
  labelAr: string;
  shortRoleName: string;
  description: string;
  badgeClass: string;
  iconName: string;
  allowedTabs: AdminTab[];
  canEditProducts: boolean;
  canManageOrders: boolean;
  canCreateManualOrders: boolean;
  canManageMedia: boolean;
  canViewAnalytics: boolean;
  canManageEmployees: boolean;
  canManageSettings: boolean;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    role: 'admin',
    name: 'Administrateur',
    label: 'Administrateur Principal',
    labelAr: 'المشرف العام',
    shortRoleName: 'Admin',
    description: 'Accès total à tous les modules : commandes, produits, bannières, statistiques, gestion des employés et réglages système.',
    badgeClass: 'bg-red-600 text-white',
    iconName: 'ShieldAlert',
    allowedTabs: ['orders', 'new-order', 'products', 'media', 'analytics', 'employees', 'languages', 'email'],
    canEditProducts: true,
    canManageOrders: true,
    canCreateManualOrders: true,
    canManageMedia: true,
    canViewAnalytics: true,
    canManageEmployees: true,
    canManageSettings: true,
  },
  manager: {
    role: 'manager',
    name: 'Gérant',
    label: 'Gérant du Magasin',
    labelAr: 'مدير المتجر',
    shortRoleName: 'Gérant',
    description: 'Gestion globale des opérations : suivi des commandes, catalogue produits, bannières et statistiques de vente.',
    badgeClass: 'bg-indigo-600 text-white',
    iconName: 'Briefcase',
    allowedTabs: ['orders', 'new-order', 'products', 'media', 'analytics'],
    canEditProducts: true,
    canManageOrders: true,
    canCreateManualOrders: true,
    canManageMedia: true,
    canViewAnalytics: true,
    canManageEmployees: false,
    canManageSettings: false,
  },
  employee: {
    role: 'employee',
    name: 'Employé',
    label: 'Employé / Catalogue & Ventes',
    labelAr: 'موظف المتجر والمنتجات',
    shortRoleName: 'Employé',
    description: 'Ajout et mise à jour des fiches produits, gestion des stocks, bannières publicitaires et saisie des commandes téléphoniques.',
    badgeClass: 'bg-blue-600 text-white',
    iconName: 'Layers',
    allowedTabs: ['products', 'new-order', 'orders', 'media'],
    canEditProducts: true,
    canManageOrders: true,
    canCreateManualOrders: true,
    canManageMedia: true,
    canViewAnalytics: false,
    canManageEmployees: false,
    canManageSettings: false,
  },
  delivery: {
    role: 'delivery',
    name: 'Livreur',
    label: 'Livreur Express',
    labelAr: 'مندوب التوصيل',
    shortRoleName: 'Livreur',
    description: 'Accès dédié aux commandes confirmées et en expédition, détails de livraison, contact direct client et bordereaux.',
    badgeClass: 'bg-amber-600 text-white',
    iconName: 'Truck',
    allowedTabs: ['orders'],
    canEditProducts: false,
    canManageOrders: true,
    canCreateManualOrders: false,
    canManageMedia: false,
    canViewAnalytics: false,
    canManageEmployees: false,
    canManageSettings: false,
  },
  customer: {
    role: 'customer',
    name: 'Client',
    label: 'Client Privilège',
    labelAr: 'زبون المتجر',
    shortRoleName: 'Client',
    description: 'Client de la boutique en ligne.',
    badgeClass: 'bg-slate-200 text-slate-700',
    iconName: 'User',
    allowedTabs: [],
    canEditProducts: false,
    canManageOrders: false,
    canCreateManualOrders: false,
    canManageMedia: false,
    canViewAnalytics: false,
    canManageEmployees: false,
    canManageSettings: false,
  },
};

export const PRIMARY_ADMIN_EMAIL = 'soulimani.oualid@gmail.com';
export const PRIMARY_ADMIN_ID = 'user_admin_oualid';

export const isPrimaryAdminAccount = (account?: User | StoredUserAccount | string | null): boolean => {
  if (!account) return false;
  if (typeof account === 'string') {
    const val = account.toLowerCase().trim();
    return val === PRIMARY_ADMIN_EMAIL || val === PRIMARY_ADMIN_ID || val === 'admin@parailaf.ma';
  }
  const email = account.email?.toLowerCase().trim();
  const id = account.id;
  return email === PRIMARY_ADMIN_EMAIL || id === PRIMARY_ADMIN_ID || email === 'admin@parailaf.ma';
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  userRole: UserRole;
  roleConfig: RoleConfig;
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
    role?: UserRole;
    adminPasscode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  verifyAdminAccess: (passcodeOrPassword: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  lockAdminSession: () => void;
  promoteCurrentAccount: (pinCode: string, targetRole?: UserRole) => { success: boolean; error?: string };
  allUsers: StoredUserAccount[];
  createEmployee: (data: {
    fullName: string;
    email: string;
    phone?: string;
    role?: UserRole;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateUserRole: (userId: string, role: string) => { success: boolean; error?: string };
  deleteUser: (userId: string) => { success: boolean; error?: string };
  isPrimaryAdmin: (userOrIdOrEmail: User | StoredUserAccount | string | null) => boolean;
  canAccessTab: (tab: AdminTab) => boolean;
  getAllowedTabs: () => AdminTab[];
  getDefaultTabForUser: () => AdminTab;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCOUNTS_STORAGE_KEY = 'parailaf_registered_users_v1';
const CURRENT_SESSION_KEY = 'parailaf_current_user_session_v1';
const ADMIN_SESSION_KEY = 'parailaf_admin_session_unlocked_v1';

// Allowed Master Admin Passcodes
const MASTER_ADMIN_PASSCODES = ['admin2026', 'parailaf2026', 'admin123', '1234'];

// Pre-seeded accounts (Includes Administrator and default staff profiles)
const SEED_USERS: StoredUserAccount[] = [
  {
    id: 'user_admin_oualid',
    fullName: 'Oualid Soulimani (Admin Principal)',
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
    id: 'user_staff_gerant',
    fullName: 'Gérant Magasin',
    email: 'gerant@parailaf.ma',
    phone: '0661998877',
    city: 'Casablanca',
    address: 'Agence Parailaf Casa',
    createdAt: '2026-08-10T10:00:00Z',
    role: 'manager',
    passwordHash: 'gerant2026',
  },
  {
    id: 'user_staff_employe',
    fullName: 'Karim Alami (Employé Catalogue)',
    email: 'employe@parailaf.ma',
    phone: '0662334455',
    city: 'Rabat',
    address: 'Dépôt Parailaf',
    createdAt: '2026-08-15T11:00:00Z',
    role: 'employee',
    passwordHash: 'employe2026',
  },
  {
    id: 'user_staff_livreur',
    fullName: 'Youssef Bennani (Livreur Express)',
    email: 'livreur@parailaf.ma',
    phone: '0663112233',
    city: 'Casablanca',
    address: 'Service Livraison Express',
    createdAt: '2026-08-18T09:00:00Z',
    role: 'delivery',
    passwordHash: 'livreur2026',
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

  // Admin / Staff Session Lock State
  const [isAdminSessionActive, setIsAdminSessionActive] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const isAdmin = currentUser?.role === 'admin' || (currentUser?.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL);
  const userRole: UserRole = currentUser?.role || (isAdmin ? 'admin' : 'customer');
  const isStaff = userRole === 'admin' || userRole === 'manager' || userRole === 'employee' || userRole === 'delivery' || isAdminSessionActive;
  const roleConfig = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.customer;

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
        }
        setUsersLoaded(true);
      }, (err) => {
        if (err?.code === 'resource-exhausted') {
          console.warn("Firestore quota journalière atteinte. Comptes utilisateurs gérés localement.");
        } else {
          console.warn("Firebase users onSnapshot notice:", err?.message || err);
        }
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
      } else {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Ensure seed accounts exist if missing
          let modified = false;
          let list = [...parsed];
          SEED_USERS.forEach(seed => {
            if (!list.some(u => u.email.toLowerCase() === seed.email.toLowerCase())) {
              list.push(seed);
              modified = true;
            }
          });
          if (modified) {
            localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(list));
          }
        }
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
          const hasOualid = parsed.some(u => u.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL);
          let updated = parsed.map(u => {
            if (u.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL || u.email?.toLowerCase() === 'admin@parailaf.ma') {
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

    // Ensure primary admin always has admin role and unlocks dashboard
    let effectiveRole: UserRole = found.role;
    if (isPrimaryAdminAccount(found)) {
      effectiveRole = 'admin';
      if (found.role !== 'admin') {
        found.role = 'admin';
        saveStoredUsers(users.map(u => u.id === found.id ? { ...u, role: 'admin' } : u));
      }
    }

    const sessionUser: User = {
      id: found.id,
      fullName: found.fullName,
      email: found.email,
      phone: found.phone,
      city: found.city,
      address: found.address,
      createdAt: found.createdAt,
      role: effectiveRole,
    };

    setCurrentUser(sessionUser);
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
    } catch {
      // ignore
    }

    // Auto-unlock staff/admin dashboard session if user has a staff role
    const staffRoles: UserRole[] = ['admin', 'manager', 'delivery', 'employee'];
    if (staffRoles.includes(effectiveRole) || isPrimaryAdminAccount(found)) {
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
    role?: UserRole;
    adminPasscode?: string;
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

    const isPrimary = isPrimaryAdminAccount(cleanEmail);
    let targetRole: UserRole = 'customer';
    if (isPrimary) {
      targetRole = 'admin';
    } else if (data.adminPasscode && MASTER_ADMIN_PASSCODES.includes(data.adminPasscode.trim())) {
      targetRole = data.role || 'admin';
    } else if (data.role && data.role !== 'customer') {
      targetRole = data.role;
    }

    const newUser: StoredUserAccount = {
      id: isPrimary ? PRIMARY_ADMIN_ID : `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: data.fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      city: data.city?.trim() || 'Casablanca',
      address: data.address?.trim() || '',
      createdAt: new Date().toISOString(),
      role: targetRole,
      passwordHash: data.password,
    };

    const updatedList = [newUser, ...users];
    saveStoredUsers(updatedList);
    setAllUsers(updatedList);

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

    if (targetRole !== 'customer') {
      setIsAdminSessionActive(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}
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

  // Promote current account to Staff or Admin with Master PIN
  const promoteCurrentAccount = (pinCode: string, targetRole: UserRole = 'admin'): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'Aucun compte connecté.' };
    }

    const cleanPin = pinCode.trim();
    // Allow if pin is master admin passcode OR user is primary admin
    if (!MASTER_ADMIN_PASSCODES.includes(cleanPin) && !isPrimaryAdminAccount(currentUser)) {
      return { 
        success: false, 
        error: 'Code PIN invalide. Utilisez le code PIN Master (1234 ou admin2026).' 
      };
    }

    const roleToAssign: UserRole = targetRole || 'admin';
    const updatedUser: User = {
      ...currentUser,
      role: roleToAssign,
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updatedUser));
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } catch {}

    setIsAdminSessionActive(true);

    // Update in allUsers & localStorage
    const users = getStoredUsers();
    const existingIndex = users.findIndex(u => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase());
    if (existingIndex !== -1) {
      users[existingIndex].role = roleToAssign;
      saveStoredUsers(users);
      setAllUsers([...users]);
    } else {
      const newStored: StoredUserAccount = {
        id: currentUser.id,
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone,
        city: currentUser.city || 'Casablanca',
        address: currentUser.address || '',
        createdAt: currentUser.createdAt || new Date().toISOString(),
        role: roleToAssign,
        passwordHash: cleanPin,
      };
      const updated = [newStored, ...users];
      saveStoredUsers(updated);
      setAllUsers(updated);
    }

    return { success: true };
  };

  // Verify Admin / Staff Access
  const verifyAdminAccess = async (passcodeOrPassword: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 250));
    const input = passcodeOrPassword.trim();
    const cleanEmail = email?.trim().toLowerCase();

    // 1. Check if user is already logged in as staff
    if (currentUser && (['admin', 'manager', 'employee', 'delivery'].includes(currentUser.role || '') || isPrimaryAdminAccount(currentUser))) {
      setIsAdminSessionActive(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}
      return { success: true };
    }

    // 2. Check Master Passcodes (Grants Master Admin)
    if (MASTER_ADMIN_PASSCODES.includes(input)) {
      setIsAdminSessionActive(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}

      // If a current user is logged in, promote them to admin!
      if (currentUser) {
        const promoted: User = { ...currentUser, role: 'admin' };
        setCurrentUser(promoted);
        try {
          localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(promoted));
        } catch {}
        const users = getStoredUsers();
        const updated = users.map(u => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...u, role: 'admin' as UserRole } : u);
        saveStoredUsers(updated);
        setAllUsers(updated);
      } else {
        const adminAccount: User = {
          id: 'user_admin_oualid',
          fullName: 'Oualid Soulimani (Admin Principal)',
          email: PRIMARY_ADMIN_EMAIL,
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

    // 3. Check credentials against registered accounts
    const users = getStoredUsers();
    const matchedAccount = users.find((u) => {
      if (!cleanEmail) return false;
      return (u.email.toLowerCase() === cleanEmail || u.phone.replace(/\s+/g, '') === cleanEmail.replace(/\s+/g, ''));
    });

    if (matchedAccount) {
      const passwordCorrect = (matchedAccount.passwordHash === input || MASTER_ADMIN_PASSCODES.includes(input));
      if (passwordCorrect) {
        let finalRole = matchedAccount.role;
        // If primary admin account or entered master passcode, force admin
        if (isPrimaryAdminAccount(matchedAccount) || MASTER_ADMIN_PASSCODES.includes(input)) {
          finalRole = 'admin';
        }

        const isStaffMember = ['admin', 'manager', 'employee', 'delivery'].includes(finalRole || '');
        if (isStaffMember) {
          setIsAdminSessionActive(true);
          try {
            sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
          } catch {}
          const sessionUser: User = {
            id: matchedAccount.id,
            fullName: matchedAccount.fullName,
            email: matchedAccount.email,
            phone: matchedAccount.phone,
            city: matchedAccount.city,
            address: matchedAccount.address,
            createdAt: matchedAccount.createdAt,
            role: finalRole,
          };
          setCurrentUser(sessionUser);
          try {
            localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
          } catch {}

          if (finalRole !== matchedAccount.role) {
            const updated = users.map(u => u.id === matchedAccount.id ? { ...u, role: finalRole } : u);
            saveStoredUsers(updated);
            setAllUsers(updated);
          }
          return { success: true };
        } else {
          // It's a customer account with correct password
          return {
            success: false,
            error: "Ce compte existe mais possède le rôle « Client ». Utilisez l'onglet « Code de sécurité (PIN) » avec le code 1234 pour déverrouiller et activer vos droits Administrateur."
          };
        }
      } else {
        return {
          success: false,
          error: "Mot de passe incorrect pour cet email."
        };
      }
    }

    return { 
      success: false, 
      error: "Identifiants introuvables. Utilisez le Code PIN Master (1234) dans le premier onglet pour un accès direct." 
    };
  };

  const lockAdminSession = () => {
    setIsAdminSessionActive(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
  };

  const [allUsers, setAllUsers] = useState<StoredUserAccount[]>([]);

  useEffect(() => {
    setAllUsers(getStoredUsers());
  }, [usersLoaded]);

  const canAccessTab = (tab: AdminTab): boolean => {
    // If master admin passkey unlocked session or role is admin
    if (isAdmin || (isAdminSessionActive && (!currentUser || currentUser.role === 'admin'))) {
      return true;
    }
    const currentRole: UserRole = currentUser?.role || 'customer';
    const config = ROLE_CONFIGS[currentRole];
    if (!config) return false;
    return config.allowedTabs.includes(tab);
  };

  const getAllowedTabs = (): AdminTab[] => {
    if (isAdmin || (isAdminSessionActive && (!currentUser || currentUser.role === 'admin'))) {
      return ['orders', 'new-order', 'products', 'media', 'analytics', 'employees', 'languages', 'email'];
    }
    const currentRole: UserRole = currentUser?.role || 'customer';
    return ROLE_CONFIGS[currentRole]?.allowedTabs || [];
  };

  const getDefaultTabForUser = (): AdminTab => {
    const currentRole: UserRole = currentUser?.role || 'customer';
    if (currentRole === 'employee') return 'products';
    if (currentRole === 'delivery') return 'orders';
    if (currentRole === 'manager') return 'orders';
    return 'orders';
  };

  const createEmployee = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    role?: UserRole;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const users = getStoredUsers();
    
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Cette adresse email est déjà utilisée par un autre compte.' };
    }

    const newUser: StoredUserAccount = {
      id: `emp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      fullName: data.fullName.trim(),
      email: cleanEmail,
      phone: data.phone?.trim() || '',
      city: 'Casablanca',
      address: '',
      createdAt: new Date().toISOString(),
      role: data.role || 'employee',
      passwordHash: data.password || '123456',
    };

    const updatedUsers = [newUser, ...users];
    saveStoredUsers(updatedUsers);
    setAllUsers(updatedUsers);
    return { success: true };
  };

  const updateUserRole = (userId: string, role: string): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const target = users.find(u => u.id === userId);
    if (!target) {
      return { success: false, error: 'Utilisateur introuvable.' };
    }

    // Protect primary admin from demotion
    if (isPrimaryAdminAccount(target) && role !== 'admin') {
      return {
        success: false,
        error: 'Action interdite : Le profil principal (Oualid Soulimani) doit impérativement conserver le rôle Administrateur.'
      };
    }

    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: role as UserRole } : u);
    saveStoredUsers(updatedUsers);
    setAllUsers(updatedUsers);
    
    // Update current user if it's them
    if (currentUser?.id === userId) {
      const updated = { ...currentUser, role: role as UserRole };
      setCurrentUser(updated);
      try {
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updated));
      } catch {}
    }
    return { success: true };
  };

  const deleteUser = (userId: string): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const target = users.find(u => u.id === userId);
    if (!target) {
      return { success: false, error: 'Utilisateur introuvable.' };
    }

    // STRICT PROTECTION: The primary admin profile can NEVER be deleted
    if (isPrimaryAdminAccount(target)) {
      return { 
        success: false, 
        error: 'Action strictement interdite : Le profil principal (Oualid Soulimani) est protégé et ne peut jamais être supprimé.' 
      };
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    saveStoredUsers(updatedUsers);
    setAllUsers(updatedUsers);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        isStaff,
        userRole,
        roleConfig,
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
        promoteCurrentAccount,
        allUsers,
        createEmployee,
        updateUserRole,
        deleteUser,
        isPrimaryAdmin: isPrimaryAdminAccount,
        canAccessTab,
        getAllowedTabs,
        getDefaultTabForUser,
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

