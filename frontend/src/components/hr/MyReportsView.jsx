import React, { useEffect, useState, useCallback } from 'react';
import { FileText, RefreshCw, MessageSquare, CalendarDays, Package, ClipboardCheck, PlusCircle } from 'lucide-react';
import { api } from '../../api/client';
import { StatusBadge, TypeBadge } from './shared';
import StockReportForm from '../operations/StockReportForm';
import OperationalReportForm from '../operations/OperationalReportForm';

const TABS = [
  { key: 'incidencias', label: 'Incidencias de Personal', Icon: FileText },
  { key: 'existencias', label: 'Existencias', Icon: Package },
  { key: 'operativos', label: 'Reportes Operativos', Icon: ClipboardCheck },
];

const FORM_LABELS = {
  demanda_no_atendida: 'Demanda No Atendida',
  baja_demanda: 'Baja Demanda',
  mas_vendidos: 'Más Vendidos',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Tab: Incidencias de Personal ──────────────────────────────────────────────
function IncidenciasTab({ token }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setReports(await api.getMyReports(token)); }
    catch (e) { setError(e.message || 'Error al cargar'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} />;
  if (!reports.length) return <Empty icon={FileText} label="Aún no has enviado ninguna incidencia de personal." />;

  return (
    <div className="flex flex-col gap-3">
      {reports.map((r) => (
        <div key={r.id} className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400">{r.reportNumber}</span>
              <TypeBadge type={r.type} />
              <StatusBadge status={r.status} />
            </div>
            <span className="flex items-center gap-1 text-xs text-slate-400"><CalendarDays size={12} />{formatDate(r.createdAt)}</span>
          </div>
          <p className="font-semibold text-cyan-900 text-sm mb-1">{r.subject}</p>
          {r.employeeName && (
            <p className="text-xs text-slate-500 mb-2">
              Colaborador: <span className="font-medium text-slate-700">{r.employeeName}</span>
              {r.employeeCode && <span className="ml-1 text-slate-400">· {r.employeeCode}</span>}
            </p>
          )}
          <p className="text-xs text-slate-500 mb-1">Fecha del incidente: <span className="font-medium text-slate-700">{formatDate(r.incidentDate)}</span></p>
          {r.hrResponse && (
            <div className="mt-2 bg-cyan-50 border border-cyan-100 rounded-xl px-4 py-3 flex gap-2">
              <MessageSquare size={14} className="text-cyan-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-cyan-800 mb-0.5">Respuesta de Capital Humano</p>
                <p className="text-sm text-cyan-900">{r.hrResponse}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Tab: Existencias ──────────────────────────────────────────────────────────
function ExistenciasTab({ token }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setReports(await api.getMyStockReports(token)); }
    catch (e) { setError(e.message || 'Error al cargar'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        >
          <PlusCircle size={15} /> Nuevo reporte
        </button>
      </div>
      {loading ? <Spinner /> : error ? <ErrorBox msg={error} /> : !reports.length ? (
        <Empty icon={Package} label="Aún no has enviado reportes de existencias." />
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => {
            const items = Array.isArray(r.items) ? r.items : [];
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-mono text-slate-400">{r.reportNumber}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400"><CalendarDays size={12} />{r.reportDate || formatDate(r.createdAt)}</span>
                </div>
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(items.reduce((acc, item) => {
                      const cat = item.category || 'Sin categoría';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(item);
                      return acc;
                    }, {})).map(([cat, catItems]) => (
                      <div key={cat}>
                        <h4 className="text-xs font-bold text-cyan-800 uppercase mb-2 border-b border-cyan-100 pb-1">
                          {cat} ({catItems.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {catItems.map((item, i) => (
                            <div key={i} className="bg-cyan-50/60 rounded-xl border border-cyan-100 px-3 py-2 flex flex-col">
                              <p className="text-xs font-semibold text-slate-700 leading-tight mb-2 flex-1">{item.name || item.productName || 'Sin nombre'}</p>
                              <div className="flex justify-between items-end mt-1 border-t border-cyan-100/50 pt-1.5">
                                <span className="text-[10px] text-slate-500 font-medium uppercase">Cantidad</span>
                                <span className="text-lg font-bold text-cyan-700 tabular-nums">{item.quantity ?? item.quantityAvailable ?? 0}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Sin ítems.</p>
                )}
                {r.generalNotes && (
                  <p className="text-xs text-slate-500 mt-2 italic">{r.generalNotes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
      {showForm && <StockReportForm token={token} onClose={() => setShowForm(false)} onCreated={load} />}
    </>
  );
}

// ── Tab: Reportes Operativos ──────────────────────────────────────────────────
function OperativosTab({ token }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setReports(await api.getMyOperationalReports(token)); }
    catch (e) { setError(e.message || 'Error al cargar'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        >
          <PlusCircle size={15} /> Nuevo reporte
        </button>
      </div>
      {loading ? <Spinner /> : error ? <ErrorBox msg={error} /> : !reports.length ? (
        <Empty icon={ClipboardCheck} label="Aún no has enviado reportes operativos." />
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{r.reportNumber}</span>
                  <span className="text-xs font-medium bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">
                    {FORM_LABELS[r.formType] || r.formType}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-400"><CalendarDays size={12} />{formatDate(r.createdAt)}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Fecha: <span className="font-medium text-slate-700">{r.reportDate}</span></span>
                {r.shift && <span>Turno: <span className="font-medium text-slate-700">{r.shift}</span></span>}
                {r.periodLabel && <span>Período: <span className="font-medium text-slate-700">{r.periodLabel}</span></span>}
                <span>Productos: <span className="font-medium text-slate-700">{Array.isArray(r.items) ? r.items.length : 0}</span></span>
              </div>
              {r.encargadoName && <p className="text-xs text-slate-500 mt-1">Encargado: <span className="font-medium text-slate-700">{r.encargadoName}</span></p>}
            </div>
          ))}
        </div>
      )}
      {showForm && <OperationalReportForm token={token} onClose={() => setShowForm(false)} onCreated={load} />}
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16 text-cyan-400">
      <RefreshCw size={24} className="animate-spin mr-2" />
      <span className="text-sm">Cargando…</span>
    </div>
  );
}

function ErrorBox({ msg }) {
  return <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-sm">{msg}</div>;
}

function Empty({ icon: Icon, label }) {
  return (
    <div className="text-center py-16 text-slate-400">
      <Icon size={36} className="mx-auto mb-3 opacity-30" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function MyReportsView({ token, initialTab = 'incidencias' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (TABS.some((tab) => tab.key === initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl text-cyan-900 flex items-center gap-2">
          <FileText size={22} className="text-cyan-600" />
          Mis Reportes
        </h2>
        <p className="text-sm text-cyan-700 mt-0.5">Historial de todos tus reportes enviados.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-5 border-b border-cyan-100 pb-3">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white text-cyan-700 border border-cyan-200 hover:bg-cyan-50'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'incidencias' && <IncidenciasTab token={token} />}
      {activeTab === 'existencias' && <ExistenciasTab token={token} />}
      {activeTab === 'operativos' && <OperativosTab token={token} />}
    </div>
  );
}

