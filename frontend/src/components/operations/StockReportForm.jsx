import { useState, useEffect } from 'react';
import { X, Package, RefreshCw, PlusCircle, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function StockReportForm({ token, onClose, onCreated }) {
  const toast = useToast();
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [rows, setRows] = useState([{ id: Date.now(), stockTypeId: '', typeName: '', productName: '', quantity: '' }]);
  const [reportDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [generalNotes, setGeneralNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoadingTypes(true);
    api.listStockTypes(token, true)
      .then((data) => {
        setTypes(data);
      })
      .catch(() => toast.error('No se pudieron cargar los productos sugeridos'))
      .finally(() => setLoadingTypes(false));
  }, []);

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { id: Date.now() + Math.random(), stockTypeId: '', typeName: '', productName: '', quantity: '' }]);
  };

  const removeRow = (id) => {
    setRows((prev) => {
      if (prev.length === 1) return [{ id: Date.now(), stockTypeId: '', typeName: '', productName: '', quantity: '' }];
      return prev.filter((row) => row.id !== id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const typeById = new Map(types.map((t) => [String(t.id), t]));

    const items = rows
      .map((row) => {
        const cleanProductName = row.productName.trim();
        const parsedQty = parseInt(row.quantity, 10);
        if (!cleanProductName || Number.isNaN(parsedQty) || parsedQty < 0) return null;

        const matchedType = row.stockTypeId ? typeById.get(String(row.stockTypeId)) : null;
        const typeName = matchedType?.name || row.typeName || null;
        return {
          stockTypeId: matchedType?.id,
          category: typeName,
          name: cleanProductName,
          quantity: parsedQty,
        };
      })
      .filter(Boolean);

    if (items.length === 0) {
      toast.error('Ingresa al menos un producto con nombre y cantidad');
      return;
    }

    setSaving(true);
    try {
      const report = await api.createStockReport(token, {
        items,
        generalNotes: generalNotes.trim() || null,
        reportDate,
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
            <Package size={20} /> Reporte de Existencias
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Fecha para el día de hoy <span className="text-red-500">*</span>
            </label>
            <input
              readOnly
              type="date"
              className="w-full border border-cyan-100 bg-cyan-50/50 text-cyan-800/70 rounded-xl px-3 py-2 text-sm focus:outline-none cursor-not-allowed select-none"
              value={reportDate}
            />
          </div>

          {/* Lista de productos */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Productos <span className="text-red-500">*</span>
            </label>

            {loadingTypes ? (
              <div className="flex items-center justify-center py-8 text-cyan-400">
                <RefreshCw size={18} className="animate-spin mr-2" />
                <span className="text-sm">Cargando sugerencias…</span>
              </div>
            ) : (
              <div className="space-y-2">
                <datalist id="stock-product-suggestions">
                  {types.map((t) => (
                    <option key={t.id} value={t.name} />
                  ))}
                </datalist>
                <table className="w-full text-sm">
                  <thead className="bg-cyan-50">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-cyan-800 w-[58%]">Nombre del producto</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-cyan-800 w-40">Categoría</th>
                      <th className="text-center px-4 py-2 text-xs font-semibold text-cyan-800 w-32">Cantidad</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-cyan-50/30'}>
                        <td className="px-4 py-2.5">
                          <input
                            type="text"
                            placeholder="Ej. Pastel de chocolate, Galletas de avena..."
                            className="w-full border border-cyan-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                            value={row.productName}
                            onChange={(e) => updateRow(row.id, 'productName', e.target.value)}
                            maxLength={200}
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <select
                            value={row.stockTypeId || ''}
                            onChange={(e) => {
                              const selected = types.find((t) => String(t.id) === e.target.value);
                              updateRow(row.id, 'stockTypeId', e.target.value);
                              updateRow(row.id, 'typeName', selected?.name || '');
                            }}
                            className="w-full border border-cyan-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          >
                            <option value="">Sin categoría</option>
                            {types.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            min={0}
                            placeholder="—"
                            className="w-full border border-cyan-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-cyan-300"
                            value={row.quantity}
                            onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            className="text-red-400 hover:text-red-600"
                            title="Quitar fila"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={addRow}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-900"
                >
                  <PlusCircle size={14} /> Agregar otro producto
                </button>
              </div>
            )}
          </div>

          {/* Notas generales */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notas generales (opcional)</label>
            <textarea
              rows={2}
              className="w-full border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-none"
              placeholder="Observaciones o comentarios adicionales…"
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
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
              disabled={saving || loadingTypes}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <><RefreshCw size={14} className="animate-spin" /> Enviando…</> : 'Enviar reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
