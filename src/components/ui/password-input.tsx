'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Password', error, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full bg-[#071320] border ${
              error ? 'border-rose-500/80 focus:border-rose-500' : 'border-tgb-navyborder focus:border-tgb-gold'
            } rounded-xl pl-10 pr-10 py-3 text-white text-xs sm:text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-tgb-gold transition-all ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
