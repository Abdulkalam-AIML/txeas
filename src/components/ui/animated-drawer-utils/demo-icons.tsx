import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  ScanFace,
  Lock,
  KeyRound,
  FileKey,
  ShieldCheck,
  Ban,
  Shield,
} from "lucide-react";

export const BannedIcon = () => (
  <Ban className="w-5 h-5 text-rose-500 shrink-0" />
);

export const DangerIcon = () => (
  <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0" />
);

export const FaceIDIcon = () => (
  <ScanFace className="w-5 h-5 shrink-0" />
);

export const LockIcon = () => (
  <Lock className="w-5 h-5 text-tgb-gold shrink-0" />
);

export const PassIcon = () => (
  <KeyRound className="w-5 h-5 text-emerald-400 shrink-0" />
);

export const PhraseIcon = () => (
  <FileKey className="w-5 h-5 text-tgb-gold shrink-0" />
);

export const RecoveryPhraseIcon = () => (
  <ShieldCheck className="w-8 h-8 text-tgb-gold shrink-0" />
);

export const ShieldIcon = () => (
  <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
);

export const WarningIcon = () => (
  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
);
