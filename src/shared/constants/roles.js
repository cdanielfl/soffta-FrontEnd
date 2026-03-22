// Roles do sistema
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_MASTER: 'admin_master',
  ADMIN_UPA: 'admin_upa',
  RECEPCIONISTA: 'recepcionista',
  ATENDENTE: 'atendente'
};

// Permissões por role
export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    label: 'Super Administrador',
    canAccessAllUpas: true,
    canManageUsers: true,
    canManageUpas: true,
    canViewDashboard: true,
    canAccessRecepcao: true,
    canAccessGuiche: true,
    canAccessAdmin: true,
    canAccessSuperAdmin: true,
    canCustomize: true
  },
  [ROLES.ADMIN_MASTER]: {
    label: 'Administrador Master',
    canAccessAllUpas: true,
    canManageUsers: true,
    canManageUpas: false,
    canViewDashboard: true,
    canAccessRecepcao: false,
    canAccessGuiche: false,
    canAccessAdmin: true,
    canAccessSuperAdmin: false,
    canCustomize: true
  },
  [ROLES.ADMIN_UPA]: {
    label: 'Administrador UPA',
    canAccessAllUpas: false,
    canManageUsers: true,
    canManageUpas: false,
    canViewDashboard: true,
    canAccessRecepcao: true,
    canAccessGuiche: true,
    canAccessAdmin: true,
    canAccessSuperAdmin: false,
    canCustomize: true
  },
  [ROLES.RECEPCIONISTA]: {
    label: 'Recepcionista',
    canAccessAllUpas: false,
    canManageUsers: false,
    canManageUpas: false,
    canViewDashboard: false,
    canAccessRecepcao: true,
    canAccessGuiche: false,
    canAccessAdmin: false,
    canAccessSuperAdmin: false,
    canCustomize: false
  },
  [ROLES.ATENDENTE]: {
    label: 'Atendente',
    canAccessAllUpas: false,
    canManageUsers: false,
    canManageUpas: false,
    canViewDashboard: false,
    canAccessRecepcao: false,
    canAccessGuiche: true,
    canAccessAdmin: false,
    canAccessSuperAdmin: false,
    canCustomize: false
  }
};

