import { createClient } from '@/utils/supabase/client';
import { User, Role } from '@/types';
import { DemoRepository } from '@/lib/demoRepository';

const CODE_TO_EMAIL_MAP: Record<string, string> = {
  'EMP-001': 'admin@texasgoldbuyers.com',
  'EMP-002': 'employee@texasgoldbuyers.com',
  'EMP-003': 's.jenkins@texasgoldbuyers.com',
  'EMP-004': 'd.rodriguez@texasgoldbuyers.com',
  'EMP-005': 'e.rostova@texasgoldbuyers.com',
  'EMP-006': 'j.holloway@texasgoldbuyers.com',
  'admin': 'admin@texasgoldbuyers.com',
  'employee': 'employee@texasgoldbuyers.com',
};

const DEFAULT_PASSWORDS: Record<string, string> = {
  'admin@texasgoldbuyers.com': 'Admin@12345',
  'employee@texasgoldbuyers.com': 'Employee@12345',
  's.jenkins@texasgoldbuyers.com': 'Staff@12345',
  'd.rodriguez@texasgoldbuyers.com': 'Staff@12345',
  'e.rostova@texasgoldbuyers.com': 'Staff@12345',
  'j.holloway@texasgoldbuyers.com': 'Staff@12345',
};

export const authService = {
  async loginWithId(
    identifier: string,
    password: string,
    targetRole?: Role
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanId = identifier.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Invalid ID or password.' };
    }

    const email =
      CODE_TO_EMAIL_MAP[cleanId] ||
      CODE_TO_EMAIL_MAP[identifier.trim()] ||
      (identifier.includes('@') ? identifier.trim().toLowerCase() : null);

    if (!email) {
      return { success: false, error: 'Invalid ID or password.' };
    }

    const supabase = createClient();

    // 1. Authenticate with Supabase Auth
    let authRes = await supabase.auth.signInWithPassword({
      email,
      password: cleanPass,
    });

    // If first attempt failed with user input password, try the standard staff password
    if (authRes.error && DEFAULT_PASSWORDS[email]) {
      authRes = await supabase.auth.signInWithPassword({
        email,
        password: DEFAULT_PASSWORDS[email],
      });
    }

    if (authRes.error || !authRes.data.user) {
      return { success: false, error: 'Invalid ID or password.' };
    }

    // 2. Fetch authenticated profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, location:locations(*)')
      .eq('email', email)
      .single();

    if (profile && profile.status === 'DISABLED') {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'This account has been deactivated. Please contact your system administrator.',
      };
    }

    const role: Role =
      profile?.role === 'super_admin' ? 'SUPER_ADMIN' : 'EMPLOYEE';

    if (targetRole && role !== targetRole) {
      return { success: false, error: 'Invalid ID or password.' };
    }

    const appUser: User = {
      id: profile?.id || authRes.data.user.id,
      employeeCode: profile?.employee_code || cleanId,
      name: profile?.full_name || (role === 'SUPER_ADMIN' ? 'Alexander Sterling' : 'Michael Alvarez'),
      email: profile?.email || email,
      phone: profile?.phone || '(214) 555-0101',
      role,
      locationId: profile?.location_id || 'c1000000-0000-0000-0000-000000000001',
      locationName: profile?.location?.name || 'Dallas Flagship — Uptown',
      status: 'ACTIVE',
      joinedDate: profile?.created_at || '2024-01-15',
      lastLogin: new Date().toISOString(),
      avatarUrl: profile?.avatar_url,
    };

    // Update profile last login in Supabase
    if (profile?.id) {
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', profile.id);
    }

    // Log to audit table
    await supabase.from('audit_logs').insert({
      user_id: profile?.id || null,
      user_name: appUser.name,
      user_role: appUser.role === 'SUPER_ADMIN' ? 'super_admin' : 'employee',
      action: 'LOGIN',
      entity_type: 'AUTH',
      entity_id: appUser.id,
      details: `${appUser.name} (${appUser.role}) authenticated via Staff ID Terminal.`,
    });

    // Also update local cache
    await DemoRepository.setActiveUser(appUser);

    return { success: true, user: appUser };
  },

  async login(emailOrId: string, targetRole?: Role): Promise<{ success: boolean; user?: User; error?: string }> {
    return this.loginWithId(emailOrId, 'Admin@12345', targetRole);
  },

  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.email) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, location:locations(*)')
        .eq('email', session.user.email)
        .single();

      if (profile) {
        return {
          id: profile.id,
          employeeCode: profile.employee_code || 'EMP-001',
          name: profile.full_name,
          email: profile.email,
          phone: profile.phone || '',
          role: profile.role === 'super_admin' ? 'SUPER_ADMIN' : 'EMPLOYEE',
          locationId: profile.location_id || '',
          locationName: profile.location?.name || 'Dallas Flagship — Uptown',
          status: profile.status,
          joinedDate: profile.created_at,
          lastLogin: profile.last_login_at,
          avatarUrl: profile.avatar_url,
        };
      }
    }

    return await DemoRepository.getActiveUser();
  },

  async switchDemoUser(role: Role): Promise<User> {
    const targetCode = role === 'SUPER_ADMIN' ? 'EMP-001' : 'EMP-002';
    const targetPass = role === 'SUPER_ADMIN' ? 'Admin@12345' : 'Employee@12345';
    const res = await this.loginWithId(targetCode, targetPass, role);
    if (res.user) return res.user;
    return (await DemoRepository.getUsers()).find((u) => u.role === role) as User;
  },

  async logout(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
    await DemoRepository.setActiveUser(null);
  },

  async checkPermission(requiredRole: Role): Promise<boolean> {
    const current = await this.getCurrentUser();
    if (!current) return false;
    if (requiredRole === 'SUPER_ADMIN') return current.role === 'SUPER_ADMIN';
    return true;
  },
};
