import { useState, useEffect, useMemo } from 'react';
import { ClipboardCheck, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

const PAGE_SIZE = 8;

const TABS = [
  { key: '', label: 'Todos' },
  { key: 'demanda_no_atendida', label: 'Demanda No Atendida' },
  { key: 'baja_demanda', label: 'Baja Demanda' },
  { key: 'mas_vendidos', label: 'Más Vendidos' },
];

const TYPE_BADGE = {
  demanda_no_atendida: 'bg-orange-100 text-orange-700',
  baja_demanda: 'bg-blue-100 text-blue-700',
  mas_vendidos: 'bg-violet-100 text-violet-700',
};

const TYPE_LABELS = {
  demanda_no_atendida: 'Demanda No Atendida',
  baja_demanda: 'Baja Demanda',
  mas_vendidos: 'Más Vendidos',
};

function safeParseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatDate(value) {
  if (!value) return '—';
  const normalized = String(value).includes('T') ? value : `${value}T12:00:00`;
  const dt = new Date(normalized);
  if (Number.isNaN(dt.getTime())) return String(value);
  return dt.toLocaleDateString('es-MX');
}

function toDayStamp(value) {
  if (!value) return '';
  const d = new Date(String(value).includes('T') ? value : `${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function ItemsPreview({ formType, items, metadata }) {
  const parsedItems = safeParseJson(items, []);
  const parsedMeta = safeParseJson(metadata, null);
  if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
    return <span className="text-gray-400 text-xs">Sin productos</span>;
  }

  return (
    <ul className="text-xs space-y-1 mt-1 max-h-40 overflow-y-auto pr-1">
      {parsedItems.map((it, i) => (
        <li key={i} className="text-gray-700 leading-relaxed">
          {formType === 'demanda_no_atendida' && (
            <>
              <span className="font-medium">{it.product}</span>
              {it.categories?.length > 0 && <span className="text-gray-500 ml-1">({it.categories.join(', ')})</span>}
              {it.timesRequested > 1 && <span className="text-orange-600 ml-1">×{it.timesRequested}</span>}
            </>
          )}
          {formType === 'baja_demanda' && (
            <>
              <span className="font-medium">{it.product}</span>
              {it.reasons?.length > 0 && <span className="text-gray-500 ml-1">— {it.reasons.map((r) => r === 'no_piden' ? 'No lo piden' : 'Lo ignoran').join(', ')}</span>}
            </>
          )}
          {formType === 'mas_vendidos' && (
            <>
              <span className="text-gray-400 font-mono mr-1">#{i + 1}</span>
              <span className="font-medium">{it.product}</span>
              {it.stars > 0 && <span className="text-yellow-500 ml-1">{'★'.repeat(it.stars)}</span>}
            </>
          )}
        </li>
      ))}
      {formType === 'mas_vendidos' && parsedMeta?.soldOut?.happened && (
        <li className="text-red-600 font-medium mt-1">Agotado: {parsedMeta.soldOut.which || '(no especificado)'}</li>
      )}
    </ul>
  );
}

function ReportRow({ report, onDelete, isAdmin }) {
  const [expanded, setExpanded] = useState(false);
  const itemCount = (() => {
    try { return safeParseJson(report.items, [])?.length ?? 0; }
    catch { return 0; }
  })();

  return (
    <>
      <tr className="hover:bg-cyan-50/40 transition-colors">
        <td className="px-3 py-2 font-mono text-xs text-gray-500">{report.reportNumber}</td>
        <td className="px-3 py-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${TYPE_BADGE[report.formType] || 'bg-gray-100 text-gray-600'}`}>
            {TYPE_LABELS[report.formType] || report.formType}
          </span>
        </td>
        <td className="px-3 py-2 text-gray-700">{report.reportDate ? new Date(report.reportDate + 'T12:00:00').toLocaleDateString('es-MX') : '—'}</td>
        <td className="px-3 py-2 text-gray-600 capitalize">{report.formType === 'mas_vendidos' ? (report.periodLabel || '—') : (report.shift || '—')}</td>
        <td className="px-3 py-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 font-medium"
          >
            {itemCount} producto{itemCount !== 1 ? 's' : ''}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </td>
        <td className="px-3 py-2 text-gray-600">{report.branchName || '—'}</td>
        <td className="px-3 py-2 text-gray-600">{report.encargadoName || report.submittedByName || '—'}</td>
        <td className="px-3 py-2">
          {isAdmin && (
            <button onClick={() => onDelete(report.id, report.formType)} className="text-red-400 hover:text-red-600" title="Eliminar">
              <Trash2 size={14} />
            </button>
          )}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="px-3 pb-3 pt-0 bg-cyan-50/30">
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
              <span>Fecha reporte: <span className="font-medium text-gray-700">{formatDate(report.reportDate)}</span></span>
              <span>Enviado: <span className="font-medium text-gray-700">{formatDate(report.createdAt)}</span></span>
            </div>
            <ItemsPreview formType={report.formType} items={report.items} metadata={report.metadata} />
            {report.managerNote && <p className="text-xs text-gray-500 italic mt-2">{report.managerNote}</p>}
          </td>
        </tr>
      )}
    </>
  );
}

export default function OperationalReportsPanel({ token, isAdmin = false }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  const fetchReports = async (formType) => {
    setLoading(true);
    try {
      const data = await api.listOperationalReports(token, formType || undefined);
      setReports(data);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(activeTab); }, [activeTab]);

  const branchOptions = useMemo(() => {
    const opts = Array.from(new Set(reports.map((r) => r.branchName).filter(Boolean)));
    return opts.sort((a, b) => a.localeCompare(b, 'es'));
  }, [reports]);

  const filteredReports = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return reports.filter((r) => {
      if (branchFilter && r.branchName !== branchFilter) return false;

      const dateKey = toDayStamp(r.reportDate || r.createdAt);
      if (fromDate && dateKey && dateKey < fromDate) return false;
      if (toDate && dateKey && dateKey > toDate) return false;

      if (!q) return true;
      const items = safeParseJson(r.items, []);
      const itemText = Array.isArray(items) ? items.map((it) => it?.product || it?.name || '').join(' ') : '';
      const haystack = `${r.reportNumber || ''} ${r.branchName || ''} ${r.encargadoName || ''} ${r.submittedByName || ''} ${TYPE_LABELS[r.formType] || r.formType || ''} ${itemText}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [reports, searchText, branchFilter, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const pagedReports = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, page]);

  useEffect(() => {
    setPage(1);
  }, [searchText, branchFilter, fromDate, toDate, activeTab]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleDelete = async (id, formType) => {
    if (!window.confirm(`¿Eliminar este reporte de ${TYPE_LABELS[formType] || formType}?`)) return;
    try { await api.deleteOperationalReport(token, id); toast.success('Reporte eliminado'); fetchReports(activeTab); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
      <h3 className="font-heading font-semibold text-cyan-900 text-xl flex items-center gap-2 mb-5">
        <ClipboardCheck size={20} /> Reportes Operativos
      </h3>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-cyan-100 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'bg-cyan-600 text-white' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar folio, sucursal, encargado o producto..."
          className="md:col-span-2 border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border border-cyan-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <option value="">Todas las sucursales</option>
          {branchOptions.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <button
          type="button"
          onClick={() => { setSearchText(''); setBranchFilter(''); setFromDate(''); setToDate(''); }}
          className="border border-cyan-200 rounded-xl px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 max-w-sm">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          title="Desde"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          title="Hasta"
        />
      </div>

      {!loading && (
        <p className="text-xs text-gray-500 mb-3">
          Mostrando {pagedReports.length} de {filteredReports.length} reportes.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 text-center py-8">Cargando reportes…</p>
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
          <ClipboardCheck size={36} strokeWidth={1.5} />
          <p className="text-sm">Sin reportes operativos para este filtro.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cyan-50 text-cyan-800 text-xs uppercase tracking-wide">
                <th className="text-left px-3 py-2 font-semibold rounded-tl-lg">N°</th>
                <th className="text-left px-3 py-2 font-semibold">Tipo</th>
                <th className="text-left px-3 py-2 font-semibold">Fecha</th>
                <th className="text-left px-3 py-2 font-semibold">Turno/Período</th>
                <th className="text-left px-3 py-2 font-semibold">Productos</th>
                <th className="text-left px-3 py-2 font-semibold">Sucursal</th>
                <th className="text-left px-3 py-2 font-semibold">Encargado</th>
                <th className="px-3 py-2 rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody>
              {pagedReports.map((r) => (
                <ReportRow key={r.id} report={r} onDelete={handleDelete} isAdmin={isAdmin} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredReports.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-500">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border border-cyan-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-cyan-700 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="border border-cyan-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-cyan-700 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
