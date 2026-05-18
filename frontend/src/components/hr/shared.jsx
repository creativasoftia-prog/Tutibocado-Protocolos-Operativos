import React from 'react';
import { CheckCircle2, Clock, XCircle, Eye, AlertCircle } from 'lucide-react';

// ── Badge de estado de reporte ──────────────────────────────────────────────
export const STATUS_CONFIG = {
  pendiente: {
    label: 'Pendiente',
    Icon: Clock,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  revisado: {
    label: 'Revisado',
    Icon: Eye,
    className: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  aceptado: {
    label: 'Aceptado',
    Icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rechazado: {
    label: 'Rechazado',
    Icon: XCircle,
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export const TYPE_CONFIG = {
  falta: { label: 'Falta', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  enfermedad: { label: 'Enfermedad', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  situacion: { label: 'Situación', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  permiso: { label: 'Permiso', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  otro: { label: 'Otro', className: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['pendiente'];
  const { Icon, label, className } = config;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${className}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}

export function TypeBadge({ type }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG['otro'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
      <AlertCircle size={11} /> {message}
    </p>
  );
}

export function SectionCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-cyan-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
        <Icon size={22} className="text-slate-400" />
      </div>
      <p className="font-semibold text-slate-600">{title}</p>
      {subtitle && <p className="text-sm text-slate-400 max-w-xs">{subtitle}</p>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
