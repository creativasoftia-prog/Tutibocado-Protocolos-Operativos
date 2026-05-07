import React from 'react';
import { Shield, LogIn } from 'lucide-react';

export default function AuthView({ onLogin, isLoading, error }) {
  const [email, setEmail] = React.useState('admin@tutibocado.local');
  const [password, setPassword] = React.useState('Admin123!');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-cyan-100 shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-cyan-600 rounded-xl text-white flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-cyan-900">Acceso al sistema</h2>
            <p className="text-cyan-700 text-sm">Ingresa con tu perfil para ver protocolos segun tu rol.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-cyan-800 mb-1">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-cyan-800 mb-1">Contrasena</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            {isLoading ? 'Entrando...' : 'Iniciar sesion'}
          </button>
        </form>

        <p className="text-xs text-cyan-700 mt-5 bg-cyan-50 border border-cyan-100 rounded-lg px-3 py-2">
          Demo inicial: administrador, supervisor, logistica y sucursal.
        </p>
      </div>
    </div>
  );
}
