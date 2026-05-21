import { useState, useEffect, useMemo } from 'react';
import { Package, PlusCircle, Trash2, Settings, ToggleLeft, ToggleRight, X, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

const PAGE_SIZE = 8;

function normalizeItems(report) {
  if (Array.isArray(report.items) && report.items.length > 0) {
    return report.items
      .map((item) => ({
        name: item?.name || item?.productName || 'Sin nombre',
        category: item?.category || 'Sin categoría',
        quantity: Number(item?.quantity ?? item?.quantityAvailable ?? 0),
      }))
      .filter((item) => item.name && Number.isFinite(item.quantity));
  }

  if (report.productName) {
    return [{
      name: report.productName,
      category: report.category || 'Sin categoría',
      quantity: Number(report.quantityAvailable ?? 0),
    }];
  }

  return [];
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

function TypesSection({ token, types, onRefresh }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await api.createStockType(token, { name: form.name.trim() });
      setForm({ name: '' });
      toast.success('Producto agregado');
      onRefresh();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleToggle = async (type) => {
    try { await api.updateStockType(token, type.id, { isActive: !type.isActive }); onRefresh(); }
    catch (err) { toast.error(err.message); }
  };

  const handleRename = async (type) => {
    if (!editName.trim()) return;
    try { await api.updateStockType(token, type.id, { name: editName.trim() }); setEditId(null); onRefresh(); }
    catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (type) => {
    if (!window.confirm(`¿Eliminar producto "${type.name}"?`)) return;
    try { await api.deleteStockType(token, type.id); toast.success('Producto eliminado'); onRefresh(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5 mb-5">
      <h4 className="font-semibold text-cyan-900 flex items-center gap-2 mb-3">
        <Settings size={16} /> Productos del formulario (configurable)
      </h4>
      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          placeholder="Ej. Pasteles completos…"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          maxLength={200}
        />
        <button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60">
          <PlusCircle size={16} />
        </button>
      </form>
      <ul className="space-y-2">
        {types.map((t) => (
          <li key={t.id} className="flex items-center gap-2">
            {editId === t.id ? (
              <>
                <input
                  autoFocus
                  className="flex-1 border border-cyan-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRename(t); if (e.key === 'Escape') setEditId(null); }}
                />
                <button onClick={() => handleRename(t)} className="text-cyan-700 text-xs font-semibold px-2">Guardar</button>
                <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
              </>
            ) : (
              <>
                <span className={`flex-1 text-sm ${t.isActive ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{t.name}</span>
                <button onClick={() => { setEditId(t.id); setEditName(t.name); }} className="text-xs text-cyan-600 hover:underline">Editar</button>
                <button onClick={() => handleToggle(t)} title={t.isActive ? 'Desactivar' : 'Activar'}>
                  {t.isActive ? <ToggleRight size={20} className="text-cyan-600" /> : <ToggleLeft size={20} className="text-gray-400" />}
                </button>
                <button onClick={() => handleDelete(t)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
              </>
            )}
          </li>
        ))}
        {types.length === 0 && <li className="text-xs text-gray-400">Sin productos configurados aún.</li>}
      </ul>
    </div>
  );
}

function ReportRow({ report, isAdmin, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const items = normalizeItems(report);

  return (
    <div className="border border-cyan-100 rounded-xl overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-4 px-4 py-3 bg-white cursor-pointer hover:bg-cyan-50/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex flex-col w-36 shrink-0">
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-wide">Folio</span>
          <span className="font-mono text-sm font-semibold text-gray-900 mt-1">{report.reportNumber}</span>
        </div>
        <div className="flex flex-col w-28 shrink-0">
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-wide">Fecha</span>
          <span className="text-sm font-semibold text-gray-900 mt-1">{formatDate(report.reportDate)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-wide">Sucursal / Usuario</span>
          <span className="text-sm font-semibold bg-cyan-100 text-cyan-900 rounded-full px-3 py-1 mt-1 w-max">{report.submittedByName || 'Sin sucursal'}</span>
        </div>
        <div className="flex flex-col ml-auto text-right">
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-wide">Total</span>
          <span className="text-sm font-semibold text-gray-900 mt-1">{items.length} producto{items.length !== 1 ? 's' : ''}</span>
        </div>
        {expanded ? <ChevronUp size={18} className="text-gray-500 ml-2" /> : <ChevronDown size={18} className="text-gray-500 ml-2" />}
        {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(report.id); }}
            className="text-red-400 hover:text-red-600 ml-2"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-cyan-100 bg-cyan-50/30 px-4 py-3">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span>Folio: <span className="font-bold text-gray-900">{report.reportNumber}</span></span>
            <span>Fecha reporte: <span className="font-bold text-gray-900">{formatDate(report.reportDate)}</span></span>
            <span>Creado: <span className="font-bold text-gray-900">{formatDate(report.createdAt)}</span></span>
          </div>
          {items.length > 0 ? (
            <div className="space-y-5">
              {Object.entries(items.reduce((acc, item) => {
                const cat = item.category || 'Sin categoría';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
              }, {})).map(([cat, catItems]) => (
                <div key={cat}>
                  <h4 className="text-sm font-extrabold text-cyan-900 uppercase mb-4 border-b-2 border-cyan-200 pb-2">
                    {cat} <span className="bg-cyan-100 text-cyan-800 rounded-full px-2 py-0.5 text-xs ml-1">{catItems.length}</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {catItems.map((item, i) => (
                      <div key={i} className="bg-white rounded-xl border border-cyan-200 px-4 py-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                        <p className="text-base font-bold text-gray-900 break-words leading-tight">{item.name}</p>
                        <div className="flex justify-between items-end mt-4 border-t border-cyan-100 pt-3">
                          <span className="text-sm font-bold text-cyan-800 uppercase tracking-wide">Cantidad</span>
                          <span className="text-2xl font-extrabold text-cyan-700 tabular-nums leading-none">{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Sin productos registrados.</p>
          )}
          {report.generalNotes && (
            <p className="text-xs text-gray-500 mt-2 italic">{report.generalNotes}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function StockReportsPanel({ token, isAdmin = false }) {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [types, setTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTypesModal, setShowTypesModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const reqs = [api.listStockReports(token)];
      if (isAdmin) {
        reqs.push(api.listStockTypes(token));
        reqs.push(api.listUsers(token).catch(() => []));
      }
      const results = await Promise.all(reqs);
      setReports(results[0]);
      if (isAdmin) {
        setTypes(results[1] || []);
        setUsers(results[2] || []);
      }
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const branchOptions = useMemo(() => {
    let opts = [];
    if (isAdmin && users.length > 0) {
      const sucursalUsers = users.filter((u) => u.roles && u.roles.includes('sucursal'));
      opts = sucursalUsers.map((u) => u.fullName || u.username);
    }
    const reportBranches = reports.map((r) => r.submittedByName).filter(Boolean);
    const combined = Array.from(new Set([...opts, ...reportBranches]));
    return combined.sort((a, b) => a.localeCompare(b, 'es'));
  }, [reports, users, isAdmin]);

  const filteredReports = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return reports.filter((r) => {
      if (branchFilter && r.submittedByName !== branchFilter) return false;

      const dateKey = toDayStamp(r.reportDate || r.createdAt);
      if (fromDate && dateKey && dateKey < fromDate) return false;
      if (toDate && dateKey && dateKey > toDate) return false;

      if (!q) return true;
      const itemText = normalizeItems(r).map((it) => it.name).join(' ');
      const haystack = `${r.reportNumber || ''} ${r.submittedByName || ''} ${itemText}`.toLowerCase();
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
  }, [searchText, branchFilter, fromDate, toDate]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este reporte?')) return;
    try { await api.deleteStockReport(token, id); toast.success('Reporte eliminado'); fetchAll(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="font-heading font-semibold text-cyan-900 text-xl flex items-center gap-2">
          <Package size={20} /> Reportes de Existencias
        </h3>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowTypesModal(true)}
            className="inline-flex items-center gap-2 border border-cyan-200 rounded-xl px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
          >
            <Settings size={14} /> Configurar productos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar folio, sucursal, enviado por o producto..."
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
          <Package size={36} strokeWidth={1.5} />
          <p className="text-sm">Sin reportes de existencias aún.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pagedReports.map((r) => (
            <ReportRow key={r.id} report={r} isAdmin={isAdmin} onDelete={handleDelete} />
          ))}
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

      {isAdmin && showTypesModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowTypesModal(false); }}
        >
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-cyan-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-100">
              <h4 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
                <Settings size={16} /> Productos del formulario
              </h4>
              <button
                type="button"
                onClick={() => setShowTypesModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <TypesSection token={token} types={types} onRefresh={fetchAll} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
