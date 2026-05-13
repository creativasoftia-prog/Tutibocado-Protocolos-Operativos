import React, { createContext, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { createToastHelpers, TOAST_DURATIONS } from '../utils/toast';

const ToastContext = createContext(null);

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="fixed top-20 right-4 z-[70] space-y-2 w-[min(92vw,360px)] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm flex items-start gap-2 transition-all duration-200 ${
            toast.closing ? 'toast-exit opacity-0 translate-y-1 scale-[0.98]' : 'toast-enter opacity-100 translate-y-0 scale-100'
          } ${
            toast.type === 'error'
              ? 'bg-red-50/95 border-red-200 text-red-800'
              : toast.type === 'warning'
                ? 'bg-amber-50/95 border-amber-200 text-amber-800'
                : toast.type === 'info'
                  ? 'bg-cyan-50/95 border-cyan-200 text-cyan-800'
                  : 'bg-emerald-50/95 border-emerald-200 text-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info size={16} className="mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          )}
          <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
          <button
            type="button"
            aria-label="Cerrar notificación"
            onClick={() => onClose(toast.id)}
            className="ml-1 p-1 rounded-md hover:bg-black/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, closing: true } : item)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 220);
  };

  const pushToast = (message, type = 'success', durationMs) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type, closing: false }]);
    const timeout = durationMs || TOAST_DURATIONS[type] || TOAST_DURATIONS.success;
    setTimeout(() => {
      removeToast(id);
    }, timeout);
  };

  const value = useMemo(() => createToastHelpers(pushToast), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}
