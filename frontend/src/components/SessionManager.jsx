import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { AlertTriangle, LogOut, RefreshCw } from 'lucide-react';

export default function SessionManager({ token, onRenew, onLogout }) {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRenewing, setIsRenewing] = useState(false);

  const checkSession = useCallback(() => {
    if (!token) return;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadData = JSON.parse(atob(payloadBase64));
      const exp = payloadData.exp;
      const now = Math.floor(Date.now() / 1000);
      const remaining = exp - now;

      if (remaining <= 0) {
        // Expirado
        onLogout();
      } else if (remaining <= 300) { // 5 minutos = 300 segundos
        setTimeLeft(remaining);
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    } catch (e) {
      console.error('Error parsing token:', e);
      onLogout();
    }
  }, [token, onLogout]);

  useEffect(() => {
    if (!token) {
      setShowModal(false);
      return;
    }

    checkSession();
    const interval = setInterval(checkSession, 1000);

    return () => clearInterval(interval);
  }, [token, checkSession]);

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      const result = await api.renew(token);
      onRenew(result.token);
      setShowModal(false);
    } catch (error) {
      console.error('Error renewing token:', error);
      onLogout();
    } finally {
      setIsRenewing(false);
    }
  };

  if (!showModal) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Tu sesión está por expirar
        </h2>
        
        <p className="text-slate-600 mb-6">
          Por seguridad, tu sesión se cerrará automáticamente en:
        </p>
        
        <div className="text-5xl font-black text-amber-500 mb-8 tracking-tighter">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRenew}
            disabled={isRenewing}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={isRenewing ? 'animate-spin' : ''} />
            {isRenewing ? 'Renovando...' : 'Extender Sesión'}
          </button>
          
          <button
            onClick={onLogout}
            disabled={isRenewing}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
