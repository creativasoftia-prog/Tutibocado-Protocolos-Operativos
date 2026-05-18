import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// ── constantes ────────────────────────────────────────────────────────────────
const DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// ── helpers ───────────────────────────────────────────────────────────────────
const parseDate = (str) => {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
};

const toStr = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const formatDisplay = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
};

// Genera exactamente 42 celdas (6 semanas) para el mes dado, empezando en lunes
const getMonthCells = (year, month) => {
  const firstDow = new Date(year, month, 1).getDay(); // 0=Dom
  const leadingDays = (firstDow + 6) % 7;             // cuántos días prev. mostrar
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells = [];

  // Días del mes anterior
  for (let i = leadingDays - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({ y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), cur: false });
  }
  // Días del mes actual
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ y: year, m: month, d, cur: true });
  }
  // Días del mes siguiente para completar 42
  let nextDay = 1;
  while (cells.length < 42) {
    const nd = new Date(year, month + 1, nextDay++);
    cells.push({ y: nd.getFullYear(), m: nd.getMonth(), d: nd.getDate(), cur: false });
  }

  return cells;
};

// ── componente ────────────────────────────────────────────────────────────────
/**
 * @param {string}   value          YYYY-MM-DD
 * @param {function} onChange       (YYYY-MM-DD) => void
 * @param {string}   max            YYYY-MM-DD (inclusive)
 * @param {string}   min            YYYY-MM-DD (inclusive)
 * @param {string}   placeholder    texto de placeholder
 * @param {string}   label          micro-etiqueta encima del campo
 * @param {boolean}  compact        modo inline: sin borde/fondo propio
 * @param {'left'|'right'} align    lado al que se abre el dropdown
 * @param {string}   inputClassName clases extra al contenedor del trigger
 */
export default function DatePicker({
  value = '',
  onChange,
  max = '',
  min = '',
  placeholder = 'dd/mm/aaaa',
  label = '',
  compact = false,
  align = 'left',
  inputClassName = '',
}) {
  const parsed = parseDate(value);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.year ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? new Date().getMonth());
  const ref = useRef(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  // Sincronizar vista cuando cambia el value externamente
  useEffect(() => {
    if (value) {
      const p = parseDate(value);
      if (p) { setViewYear(p.year); setViewMonth(p.month); }
    }
  }, [value]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  const cells = useMemo(() => getMonthCells(viewYear, viewMonth), [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const cellStr = (c) => toStr(c.y, c.m, c.d);
  const isDisabled = (c) => {
    const s = cellStr(c);
    return (max && s > max) || (min && s < min);
  };

  const handleSelect = (c) => {
    if (isDisabled(c)) return;
    onChange(cellStr(c));
    setOpen(false);
  };

  const handleToday = () => {
    if ((max && todayStr > max) || (min && todayStr < min)) return;
    onChange(todayStr);
    setOpen(false);
  };

  const displayed = formatDisplay(value);

  // ── render del trigger ──────────────────────────────────────────────────────
  const trigger = compact ? (
    // Modo inline: solo texto, sin borde (el borde es del contenedor padre)
    <div
      className={`flex flex-col cursor-pointer select-none ${inputClassName}`}
      onClick={() => setOpen((o) => !o)}
    >
      {label && (
        <span className="text-[9px] font-semibold text-cyan-500 uppercase tracking-wide leading-none mb-0.5">
          {label}
        </span>
      )}
      <span className={`text-sm leading-tight w-[125px] truncate ${displayed ? 'text-[#164E63]' : 'text-slate-400'}`}>
        {displayed ?? placeholder}
      </span>
    </div>
  ) : (
    // Modo estándar: botón con borde y ícono
    <div className={`space-y-0.5 ${inputClassName}`}>
      {label && (
        <span className="text-[9px] font-semibold text-cyan-500 uppercase tracking-wide pl-0.5">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-3 py-2 border rounded-xl text-sm text-left bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
          open ? 'border-cyan-400 ring-2 ring-cyan-400' : 'border-cyan-200 hover:border-cyan-300'
        }`}
      >
        <Calendar size={14} className="text-cyan-500 shrink-0" />
        <span className={displayed ? 'text-[#164E63]' : 'text-slate-400'}>
          {displayed ?? placeholder}
        </span>
      </button>
    </div>
  );

  // ── dropdown ────────────────────────────────────────────────────────────────
  const dropdown = open && (
    <div
      className={`absolute z-50 mt-1.5 w-72 bg-white border border-cyan-100 rounded-2xl shadow-2xl overflow-hidden ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {/* Encabezado mes/año */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-cyan-600">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-lg hover:bg-cyan-500 text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white capitalize tracking-wide">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-lg hover:bg-cyan-500 text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="p-3">
        {/* Cabeceras de días */}
        <div className="grid grid-cols-7 mb-1.5">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-cyan-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Celdas de días */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((c, i) => {
            const s = cellStr(c);
            const disabled = isDisabled(c);
            const selected = value === s;
            const isToday = s === todayStr;

            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(c)}
                className={[
                  'h-8 w-full rounded-lg text-sm font-medium transition-colors',
                  !c.cur ? 'text-slate-300' : '',
                  c.cur && !selected && !disabled ? 'hover:bg-cyan-100 text-[#164E63]' : '',
                  selected ? 'bg-cyan-600 text-white shadow-sm font-bold' : '',
                  isToday && !selected ? 'ring-1 ring-cyan-400 text-cyan-700 font-bold' : '',
                  disabled ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer',
                ].filter(Boolean).join(' ')}
              >
                {c.d}
              </button>
            );
          })}
        </div>

        {/* Pie: Borrar / Hoy */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-cyan-100">
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false); }}
            className="text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors"
          >
            Borrar
          </button>
          <button
            type="button"
            onClick={handleToday}
            disabled={Boolean((max && todayStr > max) || (min && todayStr < min))}
            className="text-xs text-cyan-600 hover:text-cyan-800 font-bold transition-colors disabled:opacity-40"
          >
            Hoy
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={ref}>
      {trigger}
      {dropdown}
    </div>
  );
}
