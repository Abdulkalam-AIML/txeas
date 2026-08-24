import { DemoRepository } from '@/lib/demoRepository';
import { User } from '@/types';

export const employeeService = {
  async getAll(): Promise<User[]> {
    return await DemoRepository.getUsers();
  },

  async getStaffEmployees(): Promise<User[]> {
    const all = await DemoRepository.getUsers();
    return all.filter((u) => u.role === 'EMPLOYEE');
  },

  async getById(id: string): Promise<User | undefined> {
    return await DemoRepository.getUserById(id);
  },

  async create(data: Omit<User, 'id' | 'joinedDate'>): Promise<User> {
    return await DemoRepository.createEmployee(data);
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    return await DemoRepository.updateEmployee(id, updates);
  },

  async toggleStatus(id: string): Promise<User> {
    const emp = await DemoRepository.getUserById(id);
    if (!emp) throw new Error('Employee not found');
    const newStatus = emp.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    return await DemoRepository.updateEmployee(id, { status: newStatus });
  },
};
