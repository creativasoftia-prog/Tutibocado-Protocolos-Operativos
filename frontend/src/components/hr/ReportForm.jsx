import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Send,
  X,
  User,
} from 'lucide-react';
import { api } from '../../api/client';
import { FieldError, Spinner, TypeBadge } from './shared';

const REPORT_TYPES = [
  { value: 'falta', label: 'Falta / Ausencia' },
  { value: 'enfermedad', label: 'Enfermedad' },
  { value: 'permiso', label: 'Solicitud de permiso' },
  { value: 'situacion', label: 'Situación en tienda' },
  { value: 'otro', label: 'Otro motivo' },
];

const emptyForm = {
  employeeCode: '',
  type: 'falta',
  subject: '',
  description: '',
  incidentDate: new Date().toISOString().slice(0, 10),
};

export default function ReportForm({ token, onSuccess, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [validatedEmployee, setValidatedEmployee] = useState(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // ── Validar empleado por código ────────────────────────────────────────────
  const handleValidateEmployee = async () => {
    const normalizedCode = form.employeeCode.trim().toUpperCase();

    if (!normalizedCode) {
      setErrors((prev) => ({ ...prev, employeeCode: 'Escribe tu número de empleado' }));
      return;
    }

    if (!/^EMP-\d{3,6}$/.test(normalizedCode)) {
      setErrors((prev) => ({ ...prev, employeeCode: 'El código debe tener formato EMP-001' }));
      return;
    }

    setValidating(true);
    setValidatedEmployee(null);
    setErrors((prev) => ({ ...prev, employeeCode: '' }));
    try {
      const employee = await api.validateEmployee(token, normalizedCode);
      setValidatedEmployee(employee);
      setForm((prev) => ({ ...prev, employeeCode: normalizedCode }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        employeeCode: 'No se encontró un empleado activo con ese código. Verifica con tu supervisor.',
      }));
    } finally {
      setValidating(false);
    }
  };

  // ── Enviar reporte ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatedEmployee) {
      newErrors.employeeCode = 'Debes verificar tu número de empleado primero';
    }
    if (!form.type) newErrors.type = 'Selecciona un tipo';
    if (!form.subject.trim() || form.subject.trim().length < 5) {
      newErrors.subject = 'El asunto debe tener al menos 5 caracteres';
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      newErrors.description = 'Describe la situación con más detalle (mínimo 10 caracteres)';
    }
    if (!form.incidentDate) newErrors.incidentDate = 'Selecciona la fecha';
    if (form.incidentDate && form.incidentDate > today) {
      newErrors.incidentDate = 'La fecha del incidente no puede ser futura';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const report = await api.createHrReport(token, {
        employeeCode: form.employeeCode.trim(),
        type: form.type,
        subject: form.subject.trim(),
        description: form.description.trim(),
        incidentDate: form.incidentDate,
      });
      setSubmitted(report);
      if (onSuccess) onSuccess(report);
    } catch (error) {
      setSubmitError(error.message || 'No se pudo enviar el reporte');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Pantalla de éxito ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <div>
          <p className="font-heading font-bold text-emerald-800 text-xl">Reporte enviado</p>
          <p className="text-sm text-slate-600 mt-1">
            Tu reporte <span className="font-semibold">{submitted.reportNumber}</span> fue recibido por Capital Humano.
          </p>
          <p className="text-xs text-slate-400 mt-1">Te notificarán cuando sea revisado.</p>
        </div>
        <button
          onClick={() => { setSubmitted(null); setForm(emptyForm); setValidatedEmployee(null); }}
          className="mt-2 px-5 py-2 bg-cyan-600 text-white rounded-xl font-semibold text-sm hover:bg-cyan-700"
        >
          Enviar otro reporte
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Verificación de empleado */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-cyan-800 flex items-center gap-1.5">
          <User size={15} /> Verificación de identidad
        </p>
        <p className="text-xs text-cyan-700">
          Ingresa tu número de empleado para que Capital Humano pueda identificarte. Sin verificación no es posible enviar el reporte.
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={form.employeeCode}
              onChange={(e) => { setField('employeeCode', e.target.value.toUpperCase()); setValidatedEmployee(null); }}
              placeholder="Ej. EMP-001"
              pattern="EMP-[0-9]{3,6}"
              maxLength={10}
              className="w-full px-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <FieldError message={errors.employeeCode} />
          </div>
          <button
            type="button"
            onClick={handleValidateEmployee}
            disabled={validating}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 disabled:opacity-50"
          >
            {validating ? <Spinner /> : <Search size={14} />}
            Verificar
          </button>
        </div>

        {validatedEmployee && (
          <div className="flex items-center gap-2.5 bg-white border border-emerald-200 rounded-xl px-3 py-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-emerald-800 text-sm">{validatedEmployee.fullName}</p>
              <p className="text-xs text-slate-500">
                {[validatedEmployee.position, validatedEmployee.branch, validatedEmployee.department].filter(Boolean).join(' · ')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setValidatedEmployee(null); setField('employeeCode', ''); }}
              className="ml-auto text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Tipo de reporte */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Tipo de reporte</label>
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setField('type', value)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                form.type === value
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <FieldError message={errors.type} />
      </div>

      {/* Fecha del incidente */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Fecha del incidente / ausencia</label>
        <input
          type="date"
          max={today}
          value={form.incidentDate}
          onChange={(e) => setField('incidentDate', e.target.value)}
          className="w-full px-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
        <FieldError message={errors.incidentDate} />
      </div>

      {/* Asunto */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Asunto</label>
        <input
          type="text"
          minLength={5}
          maxLength={220}
          value={form.subject}
          onChange={(e) => setField('subject', e.target.value)}
          placeholder="Ej. Falta por cita médica el 14 de mayo"
          className="w-full px-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
        <FieldError message={errors.subject} />
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Descripción / detalle</label>
        <textarea
          rows={4}
          minLength={10}
          maxLength={2000}
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Explica la situación con el mayor detalle posible..."
          className="w-full px-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
        />
        <FieldError message={errors.description} />
      </div>

      {submitError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle size={14} /> {submitError}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50">
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !validatedEmployee}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-xl font-semibold text-sm hover:bg-cyan-700 disabled:opacity-50 shadow-sm"
        >
          {submitting ? <Spinner /> : <Send size={15} />}
          Enviar a Capital Humano
        </button>
      </div>
    </form>
  );
}
