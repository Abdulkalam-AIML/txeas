import { DemoRepository } from '@/lib/demoRepository';
import { AuditLog } from '@/types';

export const auditService = {
  async getAll(options?: {
    action?: string;
    entity?: string;
    userId?: string;
    query?: string;
  }): Promise<AuditLog[]> {
    return await DemoRepository.getAuditLogs(options);
  },

  async log(
    action: AuditLog['action'],
    entity: AuditLog['entity'],
    entityId: string,
    details: string,
    beforeState?: any,
    afterState?: any
  ): Promise<AuditLog> {
    const user = await DemoRepository.getActiveUser();
    return await DemoRepository.logAudit({
      userId: user?.id || 'SYSTEM',
      userName: user?.name || 'System',
      role: user?.role || 'SUPER_ADMIN',
      action,
      entity,
      entityId,
      details,
      beforeState,
      afterState,
    });
  },
};
