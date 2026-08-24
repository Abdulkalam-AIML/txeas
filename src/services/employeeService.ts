import { createClient } from '@/utils/supabase/client';
import { User, Role } from '@/types';
import { DemoRepository } from '@/lib/demoRepository';

function mapDbProfile(row: any): User {
  const role: Role = row.role === 'super_admin' ? 'SUPER_ADMIN' : 'EMPLOYEE';
  return {
    id: row.id,
    employeeCode: row.employee_code || undefined,
    name: row.full_name,
    email: row.email,
    phone: row.phone || '',
    role,
    locationId: row.location_id || 'c1000000-0000-0000-0000-000000000001',
    locationName: row.location?.name || 'Dallas Flagship — Uptown',
    status: row.status === 'ACTIVE' ? 'ACTIVE' : 'DISABLED',
    joinedDate: row.created_at,
    lastLogin: row.last_login_at || undefined,
    avatarUrl: row.avatar_url || undefined,
  };
}

export const employeeService = {
  async getAll(): Promise<User[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*, location:locations(*)')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapDbProfile);
    }
    return await DemoRepository.getUsers();
  },

  async getStaffEmployees(): Promise<User[]> {
    const all = await this.getAll();
    return all.filter((u) => u.role === 'EMPLOYEE');
  },

  async getById(id: string): Promise<User | undefined> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*, location:locations(*)')
      .eq('id', id)
      .single();

    if (!error && data) {
      return mapDbProfile(data);
    }
    return await DemoRepository.getUserById(id);
  },

  async create(data: Omit<User, 'id' | 'joinedDate'>): Promise<User> {
    const supabase = createClient();
    const roleVal = data.role === 'SUPER_ADMIN' ? 'super_admin' : 'employee';

    const { data: inserted, error } = await supabase
      .from('profiles')
      .insert({
        employee_code: data.employeeCode || `EMP-${Date.now().toString().slice(-3)}`,
        full_name: data.name,
        email: data.email,
        phone: data.phone || null,
        role: roleVal,
        location_id: data.locationId || null,
        status: data.status || 'ACTIVE',
      })
      .select('*, location:locations(*)')
      .single();

    if (!error && inserted) {
      const created = mapDbProfile(inserted);
      await DemoRepository.createEmployee({ ...data, id: created.id } as any);
      return created;
    }

    return await DemoRepository.createEmployee(data);
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const supabase = createClient();
    const dbPayload: any = {};
    if (updates.name) dbPayload.full_name = updates.name;
    if (updates.phone !== undefined) dbPayload.phone = updates.phone;
    if (updates.email) dbPayload.email = updates.email;
    if (updates.role) dbPayload.role = updates.role === 'SUPER_ADMIN' ? 'super_admin' : 'employee';
    if (updates.status) dbPayload.status = updates.status;
    if (updates.locationId) dbPayload.location_id = updates.locationId;
    if (updates.lastLogin) dbPayload.last_login_at = updates.lastLogin;
    dbPayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(dbPayload)
      .eq('id', id)
      .select('*, location:locations(*)')
      .single();

    if (!error && data) {
      const updated = mapDbProfile(data);
      await DemoRepository.updateEmployee(id, updates);
      return updated;
    }

    return await DemoRepository.updateEmployee(id, updates);
  },

  async toggleStatus(id: string): Promise<User> {
    const emp = await this.getById(id);
    if (!emp) throw new Error('Employee not found');
    const newStatus = emp.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    return await this.update(id, { status: newStatus });
  },
};
