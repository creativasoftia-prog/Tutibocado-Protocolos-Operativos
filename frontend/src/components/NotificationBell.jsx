import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, X, CheckCheck, FileText, Lightbulb, ClipboardList } from 'lucide-react';
import { api } from '../api/client';

const TYPE_CONFIG = {
  reporte: {
    label: 'Reporte',
    Icon: FileText,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  sugerencia: {
    label: 'Sugerencia',
    Icon: Lightbulb,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  documentacion: {
    label: 'Documentación',
    Icon: ClipboardList,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
};

const POLL_INTERVAL_MS = 30_000;

export default function NotificationBell({ token, onNotificationClick }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const fetchCount = useCallback(async () => {
    try {
      const { count } = await api.getUnreadCount(token);
      setUnreadCount(count);
    } catch {
      // silencioso — no interrumpir la UX si el endpoint falla
    }
  }, [token]);

  const fetchAll = useCallback(async () => {
    try {
      const data = await api.listNotifications(token);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch {}
  }, [token]);

  // Poll para actualizar el badge sin abrir el panel
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchCount]);

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const onOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchAll();
  };

  const handleMarkAll = async () => {
    try {
      await api.markAllNotificationsRead(token);
      setNotifications([]);
      setUnreadCount(0);
    } catch {}
  };

  // Click en una notificación: la elimina del servidor y la quita de la lista
  const handleClickNotification = async (n) => {
    try {
      await api.markNotificationRead(token, n.id);
    } catch {}
    setNotifications((prev) => prev.filter((notif) => notif.id !== n.id));
    setUnreadCount((c) => Math.max(0, c - 1));
    setOpen(false);
    onNotificationClick?.(n);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-xl bg-white border border-cyan-100 shadow-sm hover:bg-cyan-50 transition-colors"
        title="Notificaciones"
      >
        <Bell size={18} className="text-cyan-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl border border-cyan-100 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-100 bg-cyan-50/60">
            <h4 className="font-semibold text-cyan-900 text-sm">Notificaciones</h4>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-900 font-semibold transition-colors"
                >
                  <CheckCheck size={13} /> Marcar todas
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">Sin notificaciones</p>
            ) : (
              notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.reporte;
                const Icon = cfg.Icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClickNotification(n)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3"
                  >
                    {/* Type icon */}
                    <div
                      className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.border} border`}
                    >
                      <Icon size={14} className={cfg.color} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs leading-snug text-slate-800 ${!n.isRead ? 'font-bold' : 'font-medium'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="mt-1 w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                        )}
                      </div>
                      {n.body && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{n.body}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">{formatDate(n.createdAt)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
