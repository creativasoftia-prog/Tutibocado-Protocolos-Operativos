import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Building2, CalendarRange, CheckCircle2, ClipboardList, Lightbulb, RefreshCcw, Search, ShieldCheck } from 'lucide-react';
import { api } from '../../api/client';
import DatePicker from '../DatePicker';

const PAGE_SIZE = 8;

const STATUS_STYLES = {
  pendiente: 'bg-amber-100 text-amber-700 border-amber-200',
  revisado: 'bg-sky-100 text-sky-700 border-sky-200',
  resuelto: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const ENTRY_TYPE_LABEL = {
  ejecucion: 'Ejecución',
  sugerencia: 'Sugerencia',
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';
  return parsed.toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ProtocolIncidentsPanel({ token }) {
  const [incidents, setIncidents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [branchFilter, setBranchFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [incidentsData, summaryData] = await Promise.all([
        api.listProtocolIncidents(token),
        api.getProtocolIncidentsSummary(token),
      ]);
      setIncidents(incidentsData);
      setSummary(summaryData);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData().catch(() => {
      setIncidents([]);
      setSummary(null);
      setLoading(false);
    });
  }, [loadData]);

  const uniqueBranches = useMemo(
    () => Array.from(new Set(incidents.map((i) => i.employeeBranch).filter(Boolean))).sort(),
    [incidents]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return incidents.filter((item) => {
      const statusMatch = !statusFilter || item.status === statusFilter;
      const typeMatch = !typeFilter || item.entryType === typeFilter;
      const branchMatch = !branchFilter || item.employeeBranch === branchFilter;
      const createdDate = item.createdAt ? new Date(item.createdAt) : null;
      const fromDate = dateFrom ? new Date(dateFrom + 'T00:00:00') : null;
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;
      const dateMatch = (!fromDate || (createdDate && createdDate >= fromDate)) &&
                        (!toDate   || (createdDate && createdDate <= toDate));
      const searchMatch =
        !query ||
        item.incidentNumber?.toLowerCase().includes(query) ||
        item.protocolCode?.toLowerCase().includes(query) ||
        item.protocolName?.toLowerCase().includes(query) ||
        item.employeeCode?.toLowerCase().includes(query) ||
        item.employeeName?.toLowerCase().includes(query) ||
        item.employeeBranch?.toLowerCase().includes(query) ||
        item.documentation?.toLowerCase().includes(query) ||
        item.suggestion?.toLowerCase().includes(query);

      return statusMatch && typeMatch && branchMatch && dateMatch && searchMatch;
    });
  }, [incidents, search, statusFilter, typeFilter, branchFilter, dateFrom, dateTo]);

  const chartData = useMemo(() => {
    const rows = (summary?.byProtocol || []).slice(0, 6);
    const maxTotal = rows.reduce((max, row) => Math.max(max, Number(row.total || 0)), 1);
    return rows.map((row) => ({
      ...row,
      widthPct: Math.max(8, Math.round((Number(row.total || 0) / maxTotal) * 100)),
    }));
  }, [summary]);

  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, typeFilter, branchFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleStatusChange = async (incidentId, nextStatus) => {
    await api.updateProtocolIncidentStatus(token, incidentId, { status: nextStatus });
    await loadData();
  };

  return (
    <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-heading font-semibold text-cyan-900 text-xl flex items-center gap-2">
            <ClipboardList size={20} /> Incidencias de protocolos
          </h3>
          <p className="text-sm text-slate-500">Registro de ejecución, efectividad y sugerencias operativas.</p>
        </div>
        <button
          type="button"
          onClick={() => loadData()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cyan-200 text-cyan-700 text-sm font-semibold hover:bg-cyan-50"
        >
          <RefreshCcw size={14} /> Actualizar
        </button>
      </div>

      {summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-cyan-700">Total</p>
            <p className="text-xl font-bold text-cyan-900">{summary.total}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-amber-700">Pendientes</p>
            <p className="text-xl font-bold text-amber-800">{summary.pending}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-emerald-700">Sí ayudó</p>
            <p className="text-xl font-bold text-emerald-800">{summary.helpful}</p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-rose-700">No ayudó</p>
            <p className="text-xl font-bold text-rose-800">{summary.notHelpful}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-4">
        <aside className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-3 space-y-3 h-fit lg:sticky lg:top-4">
          <p className="text-xs uppercase tracking-wide font-semibold text-cyan-700">Filtros</p>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-3 py-2.5 border border-cyan-200 rounded-lg text-sm bg-white"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm bg-white"
          >
            <option value="">Todos los tipos</option>
            <option value="ejecucion">Ejecución</option>
            <option value="sugerencia">Sugerencia</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="revisado">Revisado</option>
            <option value="resuelto">Resuelto</option>
          </select>

          {/* Filtro por sucursal */}
          {uniqueBranches.length > 0 && (
            <div className="flex items-center gap-2 bg-white border border-cyan-200 rounded-lg px-2.5 py-1">
              <Building2 size={13} className="text-cyan-600 shrink-0" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="flex-1 text-sm border-none outline-none bg-transparent py-1.5"
              >
                <option value="">Todas las sucursales</option>
                {uniqueBranches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filtro por rango de fechas */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-700">
              <CalendarRange size={13} /> Rango de fechas
            </div>
            <DatePicker
              label="Desde"
              value={dateFrom}
              onChange={(v) => setDateFrom(v)}
              placeholder="Desde"
            />
            <DatePicker
              label="Hasta"
              value={dateTo}
              onChange={(v) => setDateTo(v)}
              placeholder="Hasta"
            />
          </div>

          {(statusFilter || typeFilter || branchFilter || dateFrom || dateTo || search) ? (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('');
                setTypeFilter('');
                setBranchFilter('');
                setDateFrom('');
                setDateTo('');
                setSearch('');
              }}
              className="w-full px-3 py-2 rounded-lg border border-cyan-200 text-cyan-700 text-sm font-semibold hover:bg-cyan-100"
            >
              Limpiar filtros
            </button>
          ) : null}

          <div className="rounded-lg border border-cyan-200 bg-white p-2.5">
            <p className="text-xs uppercase tracking-wide font-semibold text-cyan-700 mb-2">Gráfica por protocolo</p>
            {chartData.length === 0 ? (
              <p className="text-xs text-slate-500">Aún no hay datos suficientes.</p>
            ) : (
              <div className="space-y-2">
                {chartData.map((row) => (
                  <div key={row.protocolId}>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1 gap-2">
                      <span className="truncate">{row.protocolCode}</span>
                      <span className="font-semibold">{row.total}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-cyan-500 rounded-full" style={{ width: `${row.widthPct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-2">
          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">Cargando incidencias...</div>
          ) : paginated.length === 0 ? (
            <div className="rounded-xl border border-dashed border-cyan-200 bg-cyan-50/50 py-8 px-4 text-center">
              <p className="text-cyan-700 font-semibold">Sin incidencias para mostrar</p>
              <p className="text-sm text-cyan-600">Cuando se documenten protocolos o se envíen sugerencias aparecerán aquí.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {paginated.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{item.incidentNumber} · {formatDate(item.createdAt)}</p>
                  <p className="font-semibold text-slate-800 text-sm">{item.protocolCode} - {item.protocolName}</p>
                  <p className="text-xs text-slate-500">{item.employeeCode} · {item.employeeName}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-1 rounded border bg-indigo-100 text-indigo-700 border-indigo-200">
                    {ENTRY_TYPE_LABEL[item.entryType] || item.entryType}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${STATUS_STYLES[item.status] || STATUS_STYLES.pendiente}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {item.entryType === 'ejecucion' ? (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className={`rounded-lg px-2.5 py-2 border ${item.followedAllSteps ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    <p className="font-semibold flex items-center gap-1">
                      <ShieldCheck size={12} /> Pasos completos
                    </p>
                    <p>{item.followedAllSteps ? 'Sí' : 'No'}</p>
                  </div>
                  <div className={`rounded-lg px-2.5 py-2 border ${item.wasHelpful ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    <p className="font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Fue útil
                    </p>
                    <p>{item.wasHelpful ? 'Sí' : 'No'}</p>
                  </div>
                  <div className="rounded-lg px-2.5 py-2 border bg-slate-100 border-slate-200 text-slate-700 md:col-span-1 col-span-full">
                    <p className="font-semibold">Documentación</p>
                    <p className="line-clamp-3">{item.documentation || 'Sin detalles'}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 rounded-lg px-2.5 py-2 border bg-yellow-50 border-yellow-200 text-yellow-800 text-xs">
                  <p className="font-semibold flex items-center gap-1"><Lightbulb size={12} /> Sugerencia</p>
                  <p>{item.suggestion || 'Sin contenido'}</p>
                </div>
              )}

              <div className="mt-2 flex items-center gap-2">
                {item.status !== 'revisado' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, 'revisado')}
                    className="text-xs px-2.5 py-1 rounded-lg border border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold"
                  >
                    Marcar revisado
                  </button>
                ) : null}
                {item.status !== 'resuelto' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, 'resuelto')}
                    className="text-xs px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold"
                  >
                    Marcar resuelto
                  </button>
                ) : null}
              </div>
            </article>
              ))}
            </div>
          )}

          {filtered.length > PAGE_SIZE ? (
            <div className="flex items-center justify-between pt-2 border-t border-cyan-100">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
              >
                ← Anterior
              </button>
              <span className="text-xs text-slate-500">Página {page + 1} de {totalPages} · {filtered.length} incidencias</span>
              <button
                type="button"
                disabled={(page + 1) >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
              >
                Siguiente →
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}