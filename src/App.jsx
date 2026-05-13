import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, LayoutPanelTop, Users, FileText, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProtocolDetail from './components/ProtocolDetail';
import AuthView from './components/AuthView';
import AdminPanel from './components/AdminPanel';
import HRDashboard from './components/hr/HRDashboard';
import ReportForm from './components/hr/ReportForm';
import { api } from './api/client';

function App() {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tb_token') || '');
  const [user, setUser] = useState(null);
  const [protocols, setProtocols] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [actionError, setActionError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);

  const isAdmin = useMemo(() => user?.roles?.includes('administrador'), [user]);
  const isCapitalHumano = useMemo(() => user?.roles?.includes('capital_humano'), [user]);
  const canManageEmployees = useMemo(() => isAdmin || isCapitalHumano, [isAdmin, isCapitalHumano]);

  const loadSessionData = async (sessionToken) => {
    if (!sessionToken) return;

    const [me, visibleProtocols, availableRoles] = await Promise.all([
      api.me(sessionToken),
      api.listProtocols(sessionToken),
      api.listRoles(sessionToken)
    ]);

    setUser(me);
    setProtocols(visibleProtocols);
    setRoles(availableRoles);

    if (me.roles.includes('administrador') || me.roles.includes('capital_humano')) {
      const [loadedUsers, loadedCategories, loadedEmployees] = await Promise.all([
        me.roles.includes('administrador') ? api.listUsers(sessionToken) : Promise.resolve([]),
        me.roles.includes('administrador') ? api.listCategories(sessionToken) : Promise.resolve([]),
        api.listEmployees(sessionToken),
      ]);
      setUsers(loadedUsers);
      setCategories(loadedCategories);
      setEmployees(loadedEmployees);
    } else {
      setUsers([]);
      setCategories([]);
      setEmployees([]);
    }
  };

  useEffect(() => {
    if (!token) return;

    loadSessionData(token).catch(() => {
      localStorage.removeItem('tb_token');
      setToken('');
      setUser(null);
      setProtocols([]);
      setRoles([]);
      setUsers([]);
      setCategories([]);
      setEmployees([]);
      setSelectedProtocol(null);
      setView('dashboard');
    });
  }, [token]);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setAuthError('');

    try {
      const result = await api.login(credentials);
      localStorage.setItem('tb_token', result.token);
      setToken(result.token);
      setView('dashboard');
    } catch (error) {
      setAuthError(error.message || 'No se pudo iniciar sesion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tb_token');
    setToken('');
    setUser(null);
    setProtocols([]);
    setRoles([]);
    setUsers([]);
    setCategories([]);
    setEmployees([]);
    setSelectedProtocol(null);
    setView('dashboard');
  };

  const refreshAdminData = async () => {
    if (!token) return;
    setActionError('');

    try {
      await loadSessionData(token);
    } catch (error) {
      setActionError(error.message || 'No fue posible refrescar datos');
    }
  };

  const handleCreateRole = async (payload) => {
    try {
      await api.createRole(token, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo crear el rol');
      throw error;
    }
  };

  const handleCreateUser = async (payload) => {
    try {
      await api.createUser(token, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo crear el perfil');
      throw error;
    }
  };

  const handleCreateProtocol = async (payload) => {
    try {
      await api.createProtocol(token, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo crear el protocolo');
      throw error;
    }
  };

  const handleUpdateProtocol = async (protocolId, payload) => {
    try {
      await api.updateProtocol(token, protocolId, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar el protocolo');
      throw error;
    }
  };

  const handleDeleteProtocol = async (protocolId) => {
    try {
      await api.deleteProtocol(token, protocolId);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar el protocolo');
      throw error;
    }
  };

  const handleUpdateUser = async (userId, payload) => {
    try {
      await api.updateUser(token, userId, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar el perfil');
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.deleteUser(token, userId);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar el perfil');
      throw error;
    }
  };

  const handleCreateCategory = async (payload) => {
    try {
      await api.createCategory(token, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo crear la categoria');
      throw error;
    }
  };

  const handleUpdateCategory = async (categoryId, payload) => {
    try {
      await api.updateCategory(token, categoryId, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar la categoria');
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.deleteCategory(token, categoryId);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar la categoria');
      throw error;
    }
  };

  // ── Empleados ──────────────────────────────────────────────────────────────
  const handleCreateEmployee = async (payload) => {
    try {
      await api.createEmployee(token, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo registrar el empleado');
      throw error;
    }
  };

  const handleUpdateEmployee = async (employeeId, payload) => {
    try {
      await api.updateEmployee(token, employeeId, payload);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar el empleado');
      throw error;
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await api.deleteEmployee(token, employeeId);
      await refreshAdminData();
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar el empleado');
      throw error;
    }
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-[#ECFEFF] text-[#164E63]">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-cyan-100 shadow-sm px-6 py-4">
          <div className="max-w-[1500px] mx-auto flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-heading font-bold text-xl shadow-md">
              T
            </div>
            <div>
              <h1 className="font-heading font-semibold text-xl leading-tight">Tutibocado</h1>
              <p className="text-xs text-cyan-700 font-medium tracking-wide uppercase">Protocolos Operativos</p>
            </div>
          </div>
        </header>

        <main>
          <AuthView onLogin={handleLogin} isLoading={isLoading} error={authError} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECFEFF] text-[#164E63]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-cyan-100 shadow-sm px-6 py-4">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setSelectedProtocol(null);
              setView('dashboard');
            }}
          >
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-heading font-bold text-xl shadow-md">
              T
            </div>
            <div>
              <h1 className="font-heading font-semibold text-xl leading-tight">Tutibocado</h1>
              <p className="text-xs text-cyan-700 font-medium tracking-wide uppercase">Protocolos Operativos</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-sm font-medium ml-auto">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-cyan-900 font-semibold leading-tight">{user.fullName}</span>
              <span className="text-xs text-cyan-600">{user.roles.join(' · ')}</span>
            </div>

            {isAdmin ? (
              <div className="inline-flex rounded-xl p-1 bg-white border border-cyan-100 shadow-sm">
                <button
                  onClick={() => {
                    setSelectedProtocol(null);
                    setView('dashboard');
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'dashboard' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <LayoutPanelTop size={16} /> Protocolos
                </button>
                <button
                  onClick={() => {
                    setSelectedProtocol(null);
                    setView('admin');
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'admin' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <ShieldCheck size={16} /> Admin
                </button>
                <button
                  onClick={() => {
                    setSelectedProtocol(null);
                    setView('hr');
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'hr' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <Users size={16} /> Capital Humano
                </button>
              </div>
            ) : isCapitalHumano ? (
              <div className="inline-flex rounded-xl p-1 bg-white border border-cyan-100 shadow-sm">
                <button
                  onClick={() => { setSelectedProtocol(null); setView('dashboard'); }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'dashboard' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <LayoutPanelTop size={16} /> Protocolos
                </button>
                <button
                  onClick={() => { setSelectedProtocol(null); setView('hr'); }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'hr' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <Users size={16} /> Capital Humano
                </button>
              </div>
            ) : null}

            {/* Botón reportar visible para todos los roles */}
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-3 py-2 text-sm font-semibold shadow-sm transition-colors"
              title="Enviar un reporte a Capital Humano"
            >
              <FileText size={15} /> Reportar
            </button>

            <button
              onClick={handleLogout}
              className="bg-white text-cyan-700 px-3 py-1.5 rounded-full border border-cyan-200 hover:bg-cyan-50"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        {actionError ? (
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
              {actionError}
            </div>
          </div>
        ) : null}

        {view === 'admin' && isAdmin ? (
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <AdminPanel
              roles={roles}
              users={users}
              protocols={protocols}
              categories={categories}
              employees={employees}
              onRefresh={refreshAdminData}
              onCreateRole={handleCreateRole}
              onCreateUser={handleCreateUser}
              onCreateProtocol={handleCreateProtocol}
              onUpdateProtocol={handleUpdateProtocol}
              onDeleteProtocol={handleDeleteProtocol}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onCreateEmployee={handleCreateEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
          </div>
        ) : null}

        {view === 'hr' && (isAdmin || isCapitalHumano) ? (
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <HRDashboard token={token} />
          </div>
        ) : null}

        {view !== 'admin' && view !== 'hr' && selectedProtocol ? (
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <ProtocolDetail protocol={selectedProtocol} onBack={() => setSelectedProtocol(null)} />
          </div>
        ) : null}

        {view !== 'admin' && view !== 'hr' && !selectedProtocol ? (
          <Dashboard protocols={protocols} onSelect={setSelectedProtocol} />
        ) : null}
      </main>

      {/* Modal de reporte para todos los empleados */}
      {showReportModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowReportModal(false); }}
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-100">
              <h2 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
                <FileText size={18} /> Enviar reporte a Capital Humano
              </h2>
              <button type="button" onClick={() => setShowReportModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <ReportForm
                token={token}
                onSuccess={() => setShowReportModal(false)}
                onCancel={() => setShowReportModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
