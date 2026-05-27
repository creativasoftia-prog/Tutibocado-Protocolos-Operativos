import { useState } from 'react';
import { X, ClipboardCheck, PlusCircle, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

const FORM_TYPES = [
  { key: 'demanda_no_atendida', label: 'Demanda No Atendida' },
  { key: 'baja_demanda', label: 'Baja Demanda' },
  { key: 'mas_vendidos', label: 'Más Vendidos Semanalmente' },
];

const CATEGORIES = ['Pastel', 'Bebida', 'Otro'];
const REASONS_MAP = { no_piden: 'No lo piden', ignorado: 'Lo ignoran' };
const SHIFTS = ['Mañana', 'Tarde'];

function DemandaRow({ item, onChange, onRemove }) {
  return (
    <div className="flex flex-wrap gap-2 items-start bg-gray-50 rounded-xl p-2">
      <input
        className="flex-1 min-w-32 border border-cyan-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        placeholder="Producto…"
        value={item.product}
        onChange={(e) => onChange({ ...item, product: e.target.value })}
        maxLength={200}
      />
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => {
          const checked = (item.categories || []).includes(c);
          return (
            <label key={c} className={`text-xs cursor-pointer px-2 py-1 rounded-lg border ${checked ? 'bg-cyan-100 border-cyan-400 text-cyan-800 font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => {
                const cats = checked ? item.categories.filter((x) => x !== c) : [...(item.categories || []), c];
                onChange({ ...item, categories: cats });
              }} /> {c}
            </label>
          );
        })}
      </div>
      <input
        type="number"
        min={1}
        className="w-20 border border-cyan-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        placeholder="Veces"
        value={item.timesRequested}
        onChange={(e) => onChange({ ...item, timesRequested: parseInt(e.target.value, 10) || 1 })}
      />
      <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 mt-1"><Trash2 size={14} /></button>
    </div>
  );
}

function BajaRow({ item, onChange, onRemove }) {
  return (
    <div className="flex flex-wrap gap-2 items-start bg-gray-50 rounded-xl p-2">
      <input
        className="flex-1 min-w-40 border border-cyan-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        placeholder="Producto…"
        value={item.product}
        onChange={(e) => onChange({ ...item, product: e.target.value })}
        maxLength={200}
      />
      <div className="flex gap-2">
        {Object.entries(REASONS_MAP).map(([k, v]) => {
          const checked = (item.reasons || []).includes(k);
          return (
            <label key={k} className={`text-xs cursor-pointer px-2 py-1 rounded-lg border ${checked ? 'bg-cyan-100 border-cyan-400 text-cyan-800 font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => {
                const reasons = checked ? item.reasons.filter((x) => x !== k) : [...(item.reasons || []), k];
                onChange({ ...item, reasons });
              }} /> {v}
            </label>
          );
        })}
      </div>
      <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 mt-1"><Trash2 size={14} /></button>
    </div>
  );
}

function VendidoRow({ item, rank, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center bg-gray-50 rounded-xl p-2">
      <span className="text-xs text-gray-400 w-5 text-center font-mono">#{rank}</span>
      <input
        className="flex-1 border border-cyan-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        placeholder="Producto…"
        value={item.product}
        onChange={(e) => onChange({ ...item, product: e.target.value })}
        maxLength={200}
      />
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange({ ...item, stars: s })}
            className={`text-sm ${s <= (item.stars || 0) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
          >★</button>
        ))}
      </div>
      <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
    </div>
  );
}

export default function OperationalReportForm({ token, onClose, onCreated }) {
  const toast = useToast();
  const today = new Date().toISOString().slice(0, 10);

  const [formType, setFormType] = useState('demanda_no_atendida');
  const [reportDate, setReportDate] = useState(today);
  const [shift, setShift] = useState('');
  const [periodLabel, setPeriodLabel] = useState('');
  const [encargadoName, setEncargadoName] = useState('');
  const [managerNote, setManagerNote] = useState('');
  const [items, setItems] = useState([]);
  const [soldOut, setSoldOut] = useState({ happened: false, which: '' });
  const [saving, setSaving] = useState(false);

  const makeNewItem = () => {
    if (formType === 'demanda_no_atendida') return { product: '', categories: [], timesRequested: 1 };
    if (formType === 'baja_demanda') return { product: '', reasons: [] };
    return { product: '', stars: 0 };
  };

  const addItem = () => setItems((prev) => [...prev, makeNewItem()]);
  const updateItem = (i, val) => setItems((prev) => prev.map((x, j) => (j === i ? val : x)));
  const removeItem = (i) => setItems((prev) => prev.filter((_, j) => j !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Agrega al menos un producto'); return; }
    if (items.some((it) => !it.product?.trim())) { toast.error('Todos los productos deben tener nombre'); return; }
    setSaving(true);
    try {
      const report = await api.createOperationalReport(token, {
        formType,
        reportDate,
        shift: shift || null,
        periodLabel: periodLabel.trim() || null,
        items,
        metadata: formType === 'mas_vendidos' ? { soldOut } : null,
        managerNote: managerNote.trim() || null,
        encargadoName: encargadoName.trim() || null,
      });
      toast.success(`Reporte ${report.reportNumber} enviado`);
      onCreated?.(report);
      onClose?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isMasVendidos = formType === 'mas_vendidos';
  const maxItems = isMasVendidos ? 5 : 20;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
            <ClipboardCheck size={20} /> Recomendaciones de la semana y demandas de los clientes
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de reporte <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {FORM_TYPES.map((ft) => (
                <button
                  key={ft.key}
                  type="button"
                  onClick={() => { setFormType(ft.key); setItems([]); }}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${formType === ft.key ? 'bg-cyan-600 text-white' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'}`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha y Turno/Período */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-36">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha <span className="text-red-500">*</span></label>
              <input
                type="date"
                required
                className="w-full border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
            {!isMasVendidos ? (
              <div className="flex-1 min-w-28">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Turno</label>
                <select
                  className="w-full border border-cyan-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                >
                  <option value="">— Selecciona —</option>
                  {SHIFTS.map((s) => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                </select>
              </div>
            ) : (
              <div className="flex-1 min-w-44">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Período (semana)</label>
                <input
                  className="w-full border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="Ej. Del 12 al 18 de mayo"
                  value={periodLabel}
                  onChange={(e) => setPeriodLabel(e.target.value)}
                  maxLength={100}
                />
              </div>
            )}
          </div>

          {/* Ítems */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-600">
                {formType === 'demanda_no_atendida' && 'Productos no atendidos'}
                {formType === 'baja_demanda' && 'Productos con baja demanda'}
                {formType === 'mas_vendidos' && `Top ${maxItems} más vendidos`}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              {items.length < maxItems && (
                <button type="button" onClick={addItem} className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center gap-1 font-semibold">
                  <PlusCircle size={14} /> Agregar
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((item, i) => (
                formType === 'demanda_no_atendida' ? (
                  <DemandaRow key={i} item={item} onChange={(v) => updateItem(i, v)} onRemove={() => removeItem(i)} />
                ) : formType === 'baja_demanda' ? (
                  <BajaRow key={i} item={item} onChange={(v) => updateItem(i, v)} onRemove={() => removeItem(i)} />
                ) : (
                  <VendidoRow key={i} item={item} rank={i + 1} onChange={(v) => updateItem(i, v)} onRemove={() => removeItem(i)} />
                )
              ))}
              {items.length === 0 && (
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full border-2 border-dashed border-cyan-200 rounded-xl py-4 text-sm text-cyan-600 hover:border-cyan-400 hover:bg-cyan-50 transition-colors"
                >
                  + Agregar primer producto
                </button>
              )}
            </div>
          </div>

          {/* Agotado (solo Más Vendidos) */}
          {isMasVendidos && (
            <div className="bg-red-50 rounded-xl p-3 space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={soldOut.happened}
                  onChange={(e) => setSoldOut({ ...soldOut, happened: e.target.checked })}
                  className="accent-red-500"
                />
                <span className="font-medium text-red-700">¿Hubo producto agotado?</span>
              </label>
              {soldOut.happened && (
                <input
                  className="w-full border border-red-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="¿Cuál(es) producto(s)?"
                  value={soldOut.which}
                  onChange={(e) => setSoldOut({ ...soldOut, which: e.target.value })}
                  maxLength={300}
                />
              )}
            </div>
          )}

          {/* Encargado */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre del encargado</label>
            <input
              className="w-full border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="Nombre…"
              value={encargadoName}
              onChange={(e) => setEncargadoName(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* Nota */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nota del encargado (opcional)</label>
            <textarea
              rows={2}
              className="w-full border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-none"
              placeholder="Observaciones…"
              value={managerNote}
              onChange={(e) => setManagerNote(e.target.value)}
              maxLength={1000}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-cyan-200 rounded-xl py-2.5 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <PlusCircle size={16} /> {saving ? 'Enviando…' : 'Enviar reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
