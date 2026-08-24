import { createClient } from '@/utils/supabase/client';
import { AuditLog } from '@/types';
import { DemoRepository } from '@/lib/demoRepository';

function mapDbAuditLog(row: any): AuditLog {
  return {
    id: row.id,
    timestamp: row.created_at,
    userId: row.user_id || 'SYSTEM',
    userName: row.user_name || 'System User',
    role: row.user_role === 'super_admin' ? 'SUPER_ADMIN' : 'EMPLOYEE',
    action: row.action as any,
    entity: (row.entity_type || 'TRANSACTION') as any,
    entityId: row.entity_id || '',
    details: row.details,
    ipAddress: row.ip_address || '127.0.0.1',
    userAgent: row.user_agent || 'Texas Gold Buyers POS Terminal',
    beforeState: row.before_state || undefined,
    afterState: row.after_state || undefined,
  };
}

export const auditService = {
  async getAll(options?: {
    action?: string;
    entity?: string;
    userId?: string;
    query?: string;
  }): Promise<AuditLog[]> {
    const supabase = createClient();
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.action && options.action !== 'ALL') {
      query = query.eq('action', options.action);
    }
    if (options?.entity && options.entity !== 'ALL') {
      query = query.eq('entity_type', options.entity);
    }
    if (options?.userId && options.userId !== 'ALL') {
      query = query.eq('user_id', options.userId);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      let result = data.map(mapDbAuditLog);
      if (options?.query) {
        const q = options.query.toLowerCase();
        result = result.filter(
          (l: AuditLog) =>
            l.userName.toLowerCase().includes(q) ||
            l.details.toLowerCase().includes(q) ||
            l.entityId.toLowerCase().includes(q)
        );
      }
      return result;
    }

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
    const supabase = createClient();
    const user = await DemoRepository.getActiveUser();

    await supabase.from('audit_logs').insert({
      user_id: user?.id || null,
      user_name: user?.name || 'System',
      user_role: user?.role === 'SUPER_ADMIN' ? 'super_admin' : 'employee',
      action,
      entity_type: entity,
      entity_id: entityId,
      details,
      before_state: beforeState || null,
      after_state: afterState || null,
    });

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
