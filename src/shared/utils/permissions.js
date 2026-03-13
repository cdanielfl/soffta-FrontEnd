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
    canAccessSuperAdmin: true
  },
  [ROLES.ADMIN_MASTER]: {
    label: 'Administrador Master',
    canAccessAllUpas: true,
    canManageUsers: false,
    canManageUpas: false,
    canViewDashboard: true,
    canAccessRecepcao: false,
    canAccessGuiche: false,
    canAccessAdmin: true,
    canAccessSuperAdmin: false
  },
  [ROLES.ADMIN_UPA]: {
    label: 'Administrador UPA',
    canAccessAllUpas: false,
    canManageUsers: false,
    canManageUpas: false,
    canViewDashboard: true,
    canAccessRecepcao: true,
    canAccessGuiche: true,
    canAccessAdmin: true,
    canAccessSuperAdmin: false
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
    canAccessSuperAdmin: false
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
    canAccessSuperAdmin: false
  }
};

// UPAs disponíveis
export const UPAS = {
  JANGURUSSU: {
    id: 'jangurussu',
    name: 'UPA Jangurussu',
    slug: 'jangurussu'
  },
  EDSON_QUEIROZ: {
    id: 'edson-queiroz',
    name: 'UPA Edson Queiroz',
    slug: 'edson-queiroz'
  },
  ITAPERI: {
    id: 'itaperi',
    name: 'UPA Itaperi',
    slug: 'itaperi'
  }
};

// Mapear slug para UPA
export const getUpaBySlug = (slug) => {
  return Object.values(UPAS).find(upa => 
    upa.id === slug || upa.slug === slug
  );
};

// Verificar se usuário tem permissão
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  const userPermissions = PERMISSIONS[user.role];
  return userPermissions ? userPermissions[permission] : false;
};

// Verificar se usuário pode acessar UPA específica
export const canAccessUpa = (user, upaId) => {
  if (!user) return false;
  
  // Super Admin e Admin Master podem acessar todas
  if (hasPermission(user, 'canAccessAllUpas')) return true;
  
  // Outros usuários só podem acessar sua própria UPA
  return user.upa_id === upaId;
};

// Filtrar UPAs que o usuário pode acessar
export const getAccessibleUpas = (user) => {
  if (!user) return [];
  
  if (hasPermission(user, 'canAccessAllUpas')) {
    return Object.values(UPAS);
  }
  
  // Retorna apenas a UPA do usuário
  return Object.values(UPAS).filter(upa => upa.id === user.upa_id);
};
