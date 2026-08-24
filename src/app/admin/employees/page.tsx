'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { employeeService, auditService } from '@/services';
import { User, Location } from '@/types';
import {
  UserCog,
  UserPlus,
  Edit2,
  Lock,
  Power,
  Shield,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Ban,
  Calendar,
  X,
  History,
  Sparkles,
} from 'lucide-react';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [employeeLogs, setEmployeeLogs] = useState<any[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const [employeeForm, setEmployeeForm] = useState<any>({
    name: '',
    email: '',
    phone: '',
    role: 'EMPLOYEE',
    locationId: 'LOC-01',
    locationName: 'Dallas Flagship — Uptown',
    status: 'ACTIVE',
    password: '',
  });

  const loadEmployees = async () => {
    const data = await employeeService.getAll();
    setEmployees(data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const openActivityLog = async (emp: User) => {
    setSelectedEmployee(emp);
    const logs = await auditService.getAll({ userId: emp.id });
    setEmployeeLogs(logs);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await employeeService.create(employeeForm);
      setIsAddModalOpen(false);
      setEmployeeForm({
        name: '',
        email: '',
        phone: '',
        role: 'EMPLOYEE',
        locationId: 'LOC-01',
        locationName: 'Dallas Flagship — Uptown',
        status: 'ACTIVE',
        password: '',
      });
      loadEmployees();
      alert(`Employee ${created.name} registered successfully.`);
    } catch (err: any) {
      alert(err.message || 'Could not create employee');
    }
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    try {
      await employeeService.update(selectedEmployee.id, employeeForm);
      setIsEditModalOpen(false);
      loadEmployees();
      alert(`Updated staff details for ${selectedEmployee.name}`);
    } catch (err: any) {
      alert(err.message || 'Could not update employee');
    }
  };

  const handleToggleStatus = async (emp: User) => {
    const action = emp.status === 'ACTIVE' ? 'deactivate' : 'reactivate';
    if (!confirm(`Are you sure you want to ${action} access for ${emp.name}?`)) return;

    try {
      await employeeService.toggleStatus(emp.id);
      loadEmployees();
    } catch (err: any) {
      alert(err.message || 'Could not change status');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordResetSuccess(true);
    setTimeout(() => {
      setPasswordResetSuccess(false);
      setIsResetPasswordModalOpen(false);
      setNewPassword('');
    }, 1500);
  };

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
              <UserCog className="w-4 h-4" /> Internal Staff Authorization
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Employee Management & Access Control
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage staff permissions, branch allocations, activity logs, and account statuses
            </p>
          </div>

          <button
            onClick={() => {
              setEmployeeForm({
                name: '',
                email: '',
                phone: '',
                role: 'EMPLOYEE',
                locationId: 'LOC-01',
                locationName: 'Dallas Flagship — Uptown',
                status: 'ACTIVE',
                password: '',
              });
              setIsAddModalOpen(true);
            }}
            className="py-2.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> + PROVISION NEW EMPLOYEE
          </button>
        </div>

        {/* Employee Table */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-tgb-darknavy border-b border-tgb-navyborder text-[11px] uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">Staff ID</th>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Assigned Location</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tgb-navyborder/60">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-tgb-darknavy/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-tgb-gold">{emp.id}</td>
                    <td className="py-3 px-4">
                      <strong className="text-white block">{emp.name}</strong>
                      <span className="text-[10px] text-gray-400 font-mono">{emp.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.role === 'SUPER_ADMIN'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {emp.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Staff Employee'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{emp.locationName}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono">{emp.phone}</td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                      {new Date(emp.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openActivityLog(emp)}
                          className="px-2 py-1 bg-tgb-darknavy hover:bg-tgb-navylight text-gray-300 hover:text-white border border-tgb-navyborder rounded-lg text-xs"
                          title="View Employee Activity Log"
                        >
                          Activity
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setEmployeeForm({ ...emp });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 bg-tgb-darknavy hover:bg-tgb-navylight text-tgb-gold border border-tgb-navyborder rounded-lg"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsResetPasswordModalOpen(true);
                          }}
                          className="p-1.5 bg-tgb-darknavy hover:bg-tgb-navylight text-cyan-400 border border-tgb-navyborder rounded-lg"
                          title="Reset Password"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                        {emp.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleToggleStatus(emp)}
                            className={`p-1.5 border rounded-lg ${
                              emp.status === 'ACTIVE'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                            title={emp.status === 'ACTIVE' ? 'Disable Employee' : 'Reactivate Employee'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD EMPLOYEE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">Provision New Employee Account</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  placeholder="e.g. David Vance"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    placeholder="name@texasgoldbuyers.com"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Direct Phone *</label>
                  <input
                    type="tel"
                    required
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    placeholder="(214) 555-0100"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Role Permission *</label>
                  <select
                    value={employeeForm.role}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="EMPLOYEE">Staff Employee (Counter POS)</option>
                    <option value="SUPER_ADMIN">Super Admin (Full Control)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Branch Lounge *</label>
                  <select
                    value={employeeForm.locationName}
                    onChange={(e) => {
                      const name = e.target.value;
                      const locId = name.includes('Dallas') ? 'LOC-01' : name.includes('Houston') ? 'LOC-02' : name.includes('Austin') ? 'LOC-03' : 'LOC-04';
                      setEmployeeForm({ ...employeeForm, locationName: name, locationId: locId });
                    }}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option>Dallas Flagship — Uptown</option>
                    <option>Houston Galleria Store</option>
                    <option>Austin Domain Branch</option>
                    <option>San Antonio — Riverwalk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Temporary Initial Password *</label>
                <input
                  type="password"
                  required
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold text-tgb-darknavy font-bold text-xs rounded-lg uppercase"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {isEditModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">Edit Employee: {selectedEmployee.name}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditEmployee} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Assigned Location</label>
                  <select
                    value={employeeForm.locationName}
                    onChange={(e) => {
                      const name = e.target.value;
                      const locId = name.includes('Dallas') ? 'LOC-01' : name.includes('Houston') ? 'LOC-02' : name.includes('Austin') ? 'LOC-03' : 'LOC-04';
                      setEmployeeForm({ ...employeeForm, locationName: name, locationId: locId });
                    }}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option>Dallas Flagship — Uptown</option>
                    <option>Houston Galleria Store</option>
                    <option>Austin Domain Branch</option>
                    <option>San Antonio — Riverwalk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Account Status</label>
                  <select
                    value={employeeForm.status}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DISABLED">DISABLED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold text-tgb-darknavy font-bold text-xs rounded-lg uppercase"
                >
                  Save Staff Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetPasswordModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" /> Reset Password: {selectedEmployee.name}
            </h3>

            {passwordResetSuccess ? (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs">
                Password successfully updated in Supabase Auth!
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">New Temporary Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg uppercase"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ACTIVITY LOG MODAL */}
      {selectedEmployee && employeeLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-tgb-navy border border-tgb-gold/30 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-tgb-navyborder">
              <div>
                <div className="text-xs text-tgb-gold font-bold uppercase">Staff Activity Audit Trail</div>
                <h2 className="text-xl font-bold text-white font-display">{selectedEmployee.name} ({selectedEmployee.email})</h2>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {employeeLogs.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  No recorded activity entries found for this employee yet.
                </div>
              ) : (
                employeeLogs.map((log) => (
                  <div key={log.id} className="bg-tgb-darknavy p-3.5 rounded-xl border border-tgb-navyborder text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-tgb-gold">{log.action}</span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{log.details}</p>
                    <div className="text-[10px] text-gray-500 font-mono">IP: {log.ipAddress}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
