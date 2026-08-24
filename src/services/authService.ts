import { DemoRepository } from '@/lib/demoRepository';
import { User, Role } from '@/types';

export const authService = {
  async loginWithId(identifier: string, password: string, role?: Role): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Invalid ID or password.' };
    }

    const user = await DemoRepository.getUserByIdOrCode(cleanId);

    // Generic error message for security - never reveal if ID exists
    if (!user) {
      return { success: false, error: 'Invalid ID or password.' };
    }

    if (user.status === 'DISABLED') {
      return { success: false, error: 'This account has been deactivated. Please contact your system administrator.' };
    }

    if (role && user.role !== role) {
      return { success: false, error: 'Invalid ID or password.' };
    }

    // Update last login timestamp
    await DemoRepository.updateEmployee(user.id, { lastLogin: new Date().toISOString() });
    await DemoRepository.setActiveUser(user);

    await DemoRepository.logAudit({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'LOGIN',
      entity: 'AUTH',
      entityId: user.id,
      details: `${user.name} (${user.role}) authenticated successfully via staff ID terminal.`,
    });

    return { success: true, user };
  },

  async login(emailOrId: string, targetRole?: Role): Promise<{ success: boolean; user?: User; error?: string }> {
    return this.loginWithId(emailOrId, 'default_password', targetRole);
  },

  async getCurrentUser(): Promise<User | null> {
    return await DemoRepository.getActiveUser();
  },

  async switchDemoUser(role: Role): Promise<User> {
    const users = await DemoRepository.getUsers();
    const target = users.find((u) => u.role === role && u.status === 'ACTIVE') || users[0];
    await DemoRepository.setActiveUser(target);
    return target;
  },

  async logout(): Promise<void> {
    const current = await DemoRepository.getActiveUser();
    if (current) {
      await DemoRepository.logAudit({
        userId: current.id,
        userName: current.name,
        role: current.role,
        action: 'LOGOUT',
        entity: 'AUTH',
        entityId: current.id,
        details: `${current.name} signed out.`,
      });
    }
    await DemoRepository.setActiveUser(null);
  },

  async checkPermission(requiredRole: Role): Promise<boolean> {
    const current = await DemoRepository.getActiveUser();
    if (!current) return false;
    if (requiredRole === 'SUPER_ADMIN') return current.role === 'SUPER_ADMIN';
    return true; // Super Admin or Employee has access to employee features
  },
};
