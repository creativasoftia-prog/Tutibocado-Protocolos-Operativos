import React, { useCallback, useEffect, useState } from 'react';
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Eye,
  RefreshCcw,
  Search,
  ClipboardList,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Building2,
  CalendarRange,
} from 'lucide-react';
import { api } from '../../api/client';
import ReportCard from './ReportCard';
import { EmptyState, Spinner, STATUS_CONFIG } from './shared';
import { useToast } from '../../context/ToastContext';
import DatePicker from '../DatePicker';
import ProtocolIncidentsPanel from '../protocols/ProtocolIncidentsPanel';

const PAGE_SIZE = 12;

const STAT_DEFS = [
  { key: 'pendiente', label: 'Pendientes', Icon: Clock,          color: 'text-amber-600',    bg: 'bg-amber-50',    border: 'border-amber-200' },
  { key: 'revisado',  label: 'Revisados',  Icon: Eye,            color: 'text-sky-600',      bg: 'bg-sky-50',      border: 'border-sky-200' },
];

export default function HRDashboard({ token }) {
  const toast = useToast();
  const [activeView, setActiveView] = useState('reports');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [filterBranch, setFilterBranch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listHrReports(token);
      setReports(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const handleStatusChange = async (reportId, payload) => {
    try {
      await api.updateHrReportStatus(token, reportId, payload);
      await loadReports();
      toast.success('Reporte marcado como revisado.');
    } catch (error) {
      toast.error(error.message || 'No se pudo actualizar el reporte');
      throw error;
    }
  };

  // ── Estadísticas ────────────────────────────────────────────────────────────
  const stats = STAT_DEFS.map((def) => ({
    ...def,
    count: reports.filter((r) => r.status === def.key).length,
  }));

  const pendingCount   = reports.filter((r) => r.status === 'pendiente').length;
  const totalEmployees = new Set(reports.map((r) => r.employeeId)).size;

  // ── Sucursales únicas (para el filtro) ─────────────────────────────────────
  const uniqueBranches = Array.from(
    new Set(reports.map((r) => r.employeeBranch).filter(Boolean))
  ).sort();

  // ── Filtrado ────────────────────────────────────────────────────────────────
  const filtered = reports.filter((r) => {
    const matchStatus   = !filterStatus || r.status === filterStatus;
    const q             = search.toLowerCase().trim();
    const matchSearch   = !q ||
      r.employeeName?.toLowerCase().includes(q) ||
      r.employeeCode?.toLowerCase().includes(q) ||
      r.subject?.toLowerCase().includes(q) ||
      r.reportNumber?.toLowerCase().includes(q) ||
      r.employeeBranch?.toLowerCase().includes(q);
    const matchEmployee = !activeEmployee || r.employeeId === activeEmployee;
    const matchBranch   = !filterBranch || r.employeeBranch === filterBranch;
    const incDate       = r.incidentDate ? new Date(r.incidentDate + 'T00:00:00') : null;
    const matchFrom     = !dateFrom || (incDate && incDate >= new Date(dateFrom + 'T00:00:00'));
    const matchTo       = !dateTo   || (incDate && incDate <= new Date(dateTo   + 'T23:59:59'));
    return matchStatus && matchSearch && matchEmployee && matchBranch && matchFrom && matchTo;
  });

  const paginated  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // ── Colaboradores únicos con conteos ───────────────────────────────────────
  const employeesWithReports = Array.from(
    new Map(reports.map((r) => [r.employeeId, {
      id: r.employeeId, name: r.employeeName, code: r.employeeCode, branch: r.employeeBranch,
    }])).values()
  ).map((emp) => ({
    ...emp,
    total:    reports.filter((r) => r.employeeId === emp.id).length,
    pending:  reports.filter((r) => r.employeeId === emp.id && r.status === 'pendiente').length,
  })).sort((a, b) => b.pending - a.pending || b.total - a.total);

  // ── 5 reportes más recientes (para resumen rápido) ──────────────────────────
  const recent = [...reports]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-2xl px-6 py-5 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl">Capital Humano</h2>
              <p className="text-cyan-200 text-sm">Gestión de reportes y justificantes de los colaboradores</p>
            </div>
          </div>
          <button
            onClick={loadReports}
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <RefreshCcw size={14} /> Actualizar
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-xl font-bold">{reports.length}</p>
              <p className="text-cyan-200 text-xs">Total reportes</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <UserCheck size={16} />
            </div>
            <div>
              <p className="text-xl font-bold">{totalEmployees}</p>
              <p className="text-cyan-200 text-xs">Colaboradores con reportes</p>
            </div>
          </div>
          <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 col-span-2 sm:col-span-1 ${
            pendingCount > 0 ? 'bg-amber-500/20 border-amber-400/30' : 'bg-emerald-500/20 border-emerald-400/30'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              pendingCount > 0 ? 'bg-amber-500/30' : 'bg-emerald-500/30'
            }`}>
              {pendingCount > 0 ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <div>
              <p className="text-xl font-bold">{pendingCount}</p>
              <p className={`text-xs ${pendingCount > 0 ? 'text-amber-200' : 'text-emerald-200'}`}>
                {pendingCount > 0 ? 'Pendientes de revisión' : 'Sin pendientes'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats por estado (filtros) */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map(({ key, label, Icon, count, bg, border, color }) => (
            <button
              key={key}
              onClick={() => { setFilterStatus(filterStatus === key ? '' : key); setPage(0); }}
              className={`rounded-xl px-3 py-2 text-left border transition-all ${
                filterStatus === key
                  ? `${bg} ${border} shadow-sm`
                  : 'bg-white/10 border-white/15 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon size={12} className={filterStatus === key ? color : 'text-white/70'} />
                <span className={`text-xs font-medium ${filterStatus === key ? color : 'text-white/70'}`}>{label}</span>
              </div>
              <p className={`text-lg font-bold ${filterStatus === key ? color : 'text-white'}`}>{count}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-5 items-start">
        <aside className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-2 lg:sticky lg:top-4">
          <button
            type="button"
            onClick={() => setActiveView('reports')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeView === 'reports' ? 'bg-cyan-600 text-white' : 'text-slate-700 hover:bg-cyan-50'
            }`}
          >
            Reportes RH
          </button>
          <button
            type="button"
            onClick={() => setActiveView('incidents')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeView === 'incidents' ? 'bg-cyan-600 text-white' : 'text-slate-700 hover:bg-cyan-50'
            }`}
          >
            Incidencias de protocolos
          </button>
        </aside>

        <div className="space-y-4">
      {activeView === 'reports' ? (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Sidebar colaboradores */}
        <div className="lg:col-span-1 space-y-4">
          {/* Lista de colaboradores */}
          <div className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800 flex items-center gap-1.5 mb-3">
              <Users size={13} /> Colaboradores ({employeesWithReports.length})
            </p>
            <div className="space-y-1 max-h-[380px] overflow-y-auto">
              <button
                onClick={() => { setActiveEmployee(null); setPage(0); }}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${
                  !activeEmployee ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>Todos los colaboradores</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                  !activeEmployee ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>{reports.length}</span>
              </button>
              {employeesWithReports.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => { setActiveEmployee(activeEmployee === emp.id ? null : emp.id); setPage(0); }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-sm transition-colors ${
                    activeEmployee === emp.id ? 'bg-cyan-600 text-white font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{emp.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {emp.pending > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          activeEmployee === emp.id ? 'bg-amber-200 text-amber-800' : 'bg-amber-100 text-amber-700'
                        }`}>{emp.pending}</span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        activeEmployee === emp.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>{emp.total}</span>
                    </div>
                  </div>
                  {emp.branch && (
                    <p className={`text-xs truncate ${activeEmployee === emp.id ? 'text-cyan-200' : 'text-slate-400'}`}>
                      {emp.branch}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actividad reciente */}
          {recent.length > 0 && (
            <div className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800 flex items-center gap-1.5 mb-3">
                <TrendingUp size={13} /> Recientes
              </p>
              <div className="space-y-2">
                {recent.map((r) => {
                  const cfg = STATUS_CONFIG[r.status];
                  const StatusIcon = cfg?.Icon;
                  return (
                    <div key={r.id} className="flex items-start gap-2">
                      {StatusIcon && <StatusIcon size={13} className={`mt-0.5 shrink-0 ${cfg.className.replace(/bg-\S+|border-\S+|rounded-\S+|px-\S+|py-\S+/g,'')}`} />}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{r.subject}</p>
                        <p className="text-xs text-slate-400 truncate">{r.employeeName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Panel de reportes */}
        <div className="lg:col-span-3 space-y-4">
          {/* Barra de búsqueda */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Buscar por nombre, código, asunto..."
                className="w-full pl-9 pr-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
              className="px-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="revisado">Revisado</option>
            </select>
          </div>

          {/* Filtros de fecha y sucursal */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 bg-white border border-cyan-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-400 transition-colors shrink-0">
              <CalendarRange size={14} className="text-cyan-500 shrink-0" />
              <DatePicker
                compact
                label="Desde"
                value={dateFrom}
                onChange={(v) => { setDateFrom(v); setPage(0); }}
                align="left"
              />
              <span className="text-cyan-200 select-none shrink-0">|</span>
              <DatePicker
                compact
                label="Hasta"
                value={dateTo}
                onChange={(v) => { setDateTo(v); setPage(0); }}
                align="right"
              />
            </div>
            {uniqueBranches.length > 0 && (
              <div className="flex items-center gap-2 bg-white border border-cyan-200 rounded-xl px-3 py-2">
                <Building2 size={14} className="text-cyan-600 shrink-0" />
                <select
                  value={filterBranch}
                  onChange={(e) => { setFilterBranch(e.target.value); setPage(0); }}
                  className="text-sm border-none outline-none bg-transparent"
                >
                  <option value="">Todas las sucursales</option>
                  {uniqueBranches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Contador de resultados */}
          {!loading && (
            <div className="flex items-center justify-between bg-white/60 border border-cyan-100 rounded-xl px-4 py-2.5">
              <span className="text-sm text-cyan-800 font-medium">
                {filtered.length === reports.length
                  ? `${reports.length} reporte${reports.length !== 1 ? 's' : ''}`
                  : `${filtered.length} de ${reports.length} reportes`}
              </span>
              {(filterStatus || search || activeEmployee || filterBranch || dateFrom || dateTo) && (
                <button
                  onClick={() => { setFilterStatus(''); setSearch(''); setActiveEmployee(null); setFilterBranch(''); setDateFrom(''); setDateTo(''); setPage(0); }}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {loading ? (
            <Spinner />
          ) : paginated.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Sin reportes"
              subtitle="No hay reportes que coincidan con los filtros aplicados."
            />
          ) : (
            <div className="space-y-2">
              {paginated.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  canManage
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-cyan-100">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
              >
                ← Anterior
              </button>
              <span className="text-xs text-slate-500">
                Página {page + 1} de {totalPages} · {filtered.length} reportes
              </span>
              <button
                disabled={(page + 1) >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>
      ) : (
        <ProtocolIncidentsPanel token={token} />
      )}
        </div>
      </div>
    </div>
  );
}
