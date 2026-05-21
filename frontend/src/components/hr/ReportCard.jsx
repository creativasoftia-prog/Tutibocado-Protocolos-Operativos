import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { StatusBadge, TypeBadge } from './shared';

// ── Mensajes predeterminados por acción y tipo de reporte ───────────────────
const PREDEFINED = {
  aceptado: {
    falta: [
      'El reporte de falta ha sido revisado y aprobado. Se tomará nota en el expediente del colaborador.',
      'Falta registrada y aprobada. Queda en el expediente para seguimiento interno.',
    ],
    enfermedad: [
      'El reporte de enfermedad ha sido revisado y aprobado. Le deseamos una pronta recuperación.',
      'Reporte de enfermedad aprobado. Se requiere presentar justificante médico al regresar.',
    ],
    permiso: [
      'La solicitud de permiso ha sido revisada y aprobada. Queda registrada la autorización.',
      'Permiso autorizado. Favor de coordinarse con tu supervisor para cubrir las actividades.',
    ],
    situacion: [
      'La situación reportada ha sido revisada y aprobada. Se tomará nota para seguimiento.',
      'Situación registrada y validada. Recursos Humanos dará seguimiento al caso.',
    ],
    otro: [
      'El reporte ha sido revisado y aprobado. Gracias por la información proporcionada.',
      'Reporte aprobado. Recursos Humanos tomará las acciones correspondientes.',
    ],
  },
  rechazado: {
    falta: [
      'El reporte de falta fue revisado; sin embargo, no cuenta con la documentación necesaria. Favor de comunicarse con Recursos Humanos.',
      'Reporte de falta rechazado por información incompleta. Es necesario presentar evidencia o justificante.',
    ],
    enfermedad: [
      'El reporte de enfermedad fue revisado. Se requiere presentar justificante médico oficial para proceder con la aprobación.',
      'No es posible aprobar el reporte de enfermedad sin el comprobante médico correspondiente.',
    ],
    permiso: [
      'La solicitud de permiso fue revisada y no puede ser aprobada en este momento. Comunícate con tu supervisor.',
      'Permiso no autorizado. La operación no permite ausencias en las fechas indicadas.',
    ],
    situacion: [
      'La situación reportada fue revisada y no procede en este momento. Comunícate con Recursos Humanos para más información.',
      'El reporte no puede ser procesado con la información proporcionada. Se requieren más detalles.',
    ],
    otro: [
      'El reporte fue revisado y no puede ser procesado. Comunícate con Recursos Humanos para aclarar la situación.',
      'Reporte rechazado. Por favor visita a Recursos Humanos para recibir orientación.',
    ],
  },
};

function getMessages(action, type) {
  return PREDEFINED[action]?.[type] || PREDEFINED[action]?.otro || [];
}

export default function ReportCard({ report, canManage = false, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [reviewAction, setReviewAction] = useState(null); // 'aceptado' | 'rechazado'
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  const isPending = report.status === 'pendiente';

  const selectAction = (action) => {
    setReviewAction(action);
    const msgs = getMessages(action, report.type);
    setMessage(msgs[0] || '');
    if (!expanded) setExpanded(true);
  };

  const handleSubmit = async () => {
    if (!onStatusChange || !reviewAction) return;
    setUpdating(true);
    try {
      await onStatusChange(report.id, { status: reviewAction, hrResponse: message.trim() || null });
      setReviewAction(null);
      setMessage('');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setReviewAction(null);
    setMessage('');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* ── Cabecera ──────────────────────────────────────────────────────────── */}
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
        <button
          className="text-slate-400 shrink-0 mt-0.5"
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* ── Botones rápidos Aprobar / Rechazar (siempre visibles cuando pendiente) ── */}
      {canManage && isPending && (
        <div className="flex gap-2 px-4 pb-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={updating}
            onClick={() => selectAction('aceptado')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
              reviewAction === 'aceptado'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 size={12} /> Aprobar
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => selectAction('rechazado')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
              reviewAction === 'rechazado'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <XCircle size={12} /> Rechazar
          </button>
        </div>
      )}

      {/* ── Contenido expandido ───────────────────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-3 bg-slate-50/50">

          {/* Descripción */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Descripción</p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{report.description}</p>
          </div>

          {/* Comentario previo de Capital Humano (si ya fue procesado) */}
          {report.hrResponse && (
            <div className="rounded-xl bg-cyan-50 border border-cyan-200 px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 mb-1 flex items-center gap-1">
                <MessageSquare size={11} /> Comentario de Capital Humano
              </p>
              <p className="text-sm text-cyan-900 whitespace-pre-wrap">{report.hrResponse}</p>
            </div>
          )}

          {/* ── Formulario de revisión inline ─────────────────────────────────── */}
          {canManage && isPending && reviewAction && (
            <div
              className={`rounded-xl border p-3 space-y-3 ${
                reviewAction === 'aceptado'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                reviewAction === 'aceptado' ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {reviewAction === 'aceptado'
                  ? <><CheckCircle2 size={12} /> Aprobar — comentario para el colaborador</>
                  : <><XCircle size={12} /> Rechazar — comentario para el colaborador</>
                }
              </p>

              {/* Mensajes predeterminados */}
              <div>
                <p className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
                  <Sparkles size={11} /> Mensajes predeterminados — clic para seleccionar
                </p>
                <div className="flex flex-col gap-1.5">
                  {getMessages(reviewAction, report.type).map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMessage(msg)}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                        message === msg
                          ? reviewAction === 'aceptado'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-medium'
                            : 'bg-rose-100 border-rose-400 text-rose-800 font-medium'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea editable */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Personalizar comentario
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe un comentario para el colaborador..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 resize-none bg-white"
                />
              </div>

              {/* Confirmar / Cancelar */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleSubmit}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                    reviewAction === 'aceptado'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {updating
                    ? 'Guardando…'
                    : reviewAction === 'aceptado'
                      ? '✓ Confirmar aprobación'
                      : '✗ Confirmar rechazo'
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
