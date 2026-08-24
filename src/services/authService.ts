import { DemoRepository } from '@/lib/demoRepository';
import { User, Role } from '@/types';

export const authService = {
  async login(email: string, role?: Role): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const user = await DemoRepository.getUserByEmail(cleanEmail);

    if (!user) {
      return { success: false, error: 'Invalid credentials. User does not exist.' };
    }

    if (user.status === 'DISABLED') {
      return { success: false, error: 'This account has been deactivated. Please contact Super Admin.' };
    }

    if (role && user.role !== role) {
      return { success: false, error: `Unauthorized. This account is registered as ${user.role}.` };
    }

    // Update last login
    await DemoRepository.updateEmployee(user.id, { lastLogin: new Date().toISOString() });
    await DemoRepository.setActiveUser(user);

    await DemoRepository.logAudit({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'LOGIN',
      entity: 'AUTH',
      entityId: user.id,
      details: `${user.name} (${user.role}) logged in successfully.`,
    });

    return { success: true, user };
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
        details: `${current.name} logged out.`,
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
