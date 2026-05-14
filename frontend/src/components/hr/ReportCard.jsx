import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge, TypeBadge } from './shared';

const STATUS_ACTIONS = {
  pendiente: ['revisado'],
  revisado: [],
  aceptado: [],
  rechazado: [],
};

const STATUS_LABELS = {
  revisado: 'Marcar revisado',
};

const ACTION_CLASSES = {
  revisado: 'bg-sky-600 hover:bg-sky-700 text-white',
};

export default function ReportCard({ report, canManage = false, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const availableActions = canManage ? (STATUS_ACTIONS[report.status] || []) : [];

  const handleAction = async (newStatus) => {
    if (!onStatusChange) return;
    setUpdating(true);
    try {
      await onStatusChange(report.id, { status: newStatus, hrResponse: null });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Cabecera del card */}
      <div
        className="flex items-start justify-between gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-xs font-mono text-slate-400">{report.reportNumber}</span>
            <TypeBadge type={report.type} />
            <StatusBadge status={report.status} />
          </div>
          <p className="font-semibold text-slate-800 text-sm truncate">{report.subject}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <User size={11} /> {report.employeeName || 'Colaborador'} ({report.employeeCode})
            </span>
            {report.employeeBranch && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Building2 size={11} /> {report.employeeBranch}
              </span>
            )}
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar size={11} /> {report.incidentDate?.slice(0, 10)}
            </span>
          </div>
        </div>
        <button className="text-slate-400 shrink-0 mt-0.5">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Contenido expandido */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-3 bg-slate-50/50">
          {/* Descripción */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Descripción</p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{report.description}</p>
          </div>

          {/* Acciones (solo para quienes pueden gestionar) */}
          {canManage && availableActions.length > 0 && (
            <div className="pt-1">
              <div className="flex flex-wrap gap-2">
                {availableActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    disabled={updating}
                    onClick={() => handleAction(action)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${ACTION_CLASSES[action]}`}
                  >
                    <CheckCircle2 size={12} />
                    {STATUS_LABELS[action]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
