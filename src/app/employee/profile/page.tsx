'use client';

import React, { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/context/AuthContext';
import { User, Shield, Building, Phone, Mail, Calendar, Key, CheckCircle2 } from 'lucide-react';

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <PortalLayout>
      <div className="max-w-3xl space-y-6 pb-16">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Staff Member Profile
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Your terminal identity, assigned lounge, and security credentials
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">{user?.name}</h2>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Staff Employee • ID: {user?.id}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-tgb-navyborder text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Email Address</span>
              <span className="font-mono text-white font-medium">{user?.email}</span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact Phone</span>
              <span className="font-mono text-white font-medium">{user?.phone}</span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Assigned Location</span>
              <span className="text-white font-medium">{user?.locationName}</span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Account Status</span>
              <span className="text-emerald-400 font-bold">ACTIVE & AUTHORIZED</span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-tgb-navyborder">
            <Key className="w-4 h-4 text-tgb-gold" />
            <h3 className="text-base font-bold text-white font-display">Update Password</h3>
          </div>

          {success && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password updated successfully!</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="py-2.5 px-5 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-bold text-xs rounded-xl uppercase shadow"
              >
                Save New Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
