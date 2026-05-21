import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, LayoutPanelTop, Users, UserCheck, FileText, X, ClipboardList, BarChart2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProtocolDetail from './components/ProtocolDetail';
import AuthView from './components/AuthView';
import AdminPanel from './components/AdminPanel';
import HRDashboard from './components/hr/HRDashboard';
import MyReportsView from './components/hr/MyReportsView';
import ReportForm from './components/hr/ReportForm';
import ReportsView from './components/ReportsView';
import NotificationBell from './components/NotificationBell';
import { api } from './api/client';
import { useToast } from './context/ToastContext';

function App() {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tb_token') || '');
  const [user, setUser] = useState(null);
  const [protocols, setProtocols] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('dashboard');
  const [reportsTab, setReportsTab] = useState('existencias');
  const [myReportsTab, setMyReportsTab] = useState('incidencias');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [actionError, setActionError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const toast = useToast();

  const isAdmin = useMemo(() => user?.roles?.includes('administrador'), [user]);
  const isCapitalHumano = useMemo(() => user?.roles?.includes('capital_humano'), [user]);
  const isSucursal = useMemo(() => user?.roles?.includes('sucursal'), [user]);
  const isSupervisor = useMemo(() => user?.roles?.includes('supervisor'), [user]);
  const canManageEmployees = useMemo(() => isAdmin || isCapitalHumano, [isAdmin, isCapitalHumano]);
  const canReceiveNotifications = useMemo(
    () => user?.roles?.some((r) => ['administrador', 'capital_humano', 'supervisor', 'sucursal'].includes(r)),
    [user]
  );

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
      toast.success('Sesión iniciada correctamente.');
    } catch (error) {
      setAuthError(error.message || 'No se pudo iniciar sesion');
      toast.error(error.message || 'No se pudo iniciar sesion');
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
      toast.error(error.message || 'No fue posible refrescar datos');
    }
  };

  const handleCreateRole = async (payload) => {
    try {
      await api.createRole(token, payload);
      await refreshAdminData();
      toast.success('Rol creado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo crear el rol');
      toast.error(error.message || 'No se pudo crear el rol');
      throw error;
    }
  };

  const handleUpdateRole = async (roleName, payload) => {
    try {
      await api.updateRole(token, roleName, payload);
      await refreshAdminData();
      toast.success('Rol actualizado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar el rol');
      toast.error(error.message || 'No se pudo actualizar el rol');
      throw error;
    }
  };

  const handleDeleteRole = async (roleName) => {
    try {
      await api.deleteRole(token, roleName);
      await refreshAdminData();
      toast.success('Rol eliminado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar el rol');
      toast.error(error.message || 'No se pudo eliminar el rol');
      throw error;
    }
  };

  const handleCreateUser = async (payload) => {
    try {
      await api.createUser(token, payload);
      await refreshAdminData();
      toast.success('Perfil creado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo crear el perfil');
      toast.error(error.message || 'No se pudo crear el perfil');
      throw error;
    }
  };

  const handleCreateProtocol = async (payload) => {
    try {
      await api.createProtocol(token, payload);
      await refreshAdminData();
      toast.success('Protocolo creado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo crear el protocolo');
      toast.error(error.message || 'No se pudo crear el protocolo');
      throw error;
    }
  };

  const handleUpdateProtocol = async (protocolId, payload) => {
    try {
      await api.updateProtocol(token, protocolId, payload);
      await refreshAdminData();
      toast.success('Protocolo actualizado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar el protocolo');
      toast.error(error.message || 'No se pudo actualizar el protocolo');
      throw error;
    }
  };

  const handleDeleteProtocol = async (protocolId) => {
    try {
      await api.deleteProtocol(token, protocolId);
      await refreshAdminData();
      toast.success('Protocolo eliminado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar el protocolo');
      toast.error(error.message || 'No se pudo eliminar el protocolo');
      throw error;
    }
  };

  const handleCreateProtocolIncident = async (payload) => {
    try {
      await api.createProtocolIncident(token, payload);
      toast.success('Registro de protocolo enviado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo registrar la incidencia del protocolo');
      toast.error(error.message || 'No se pudo registrar la incidencia del protocolo');
      throw error;
    }
  };

  const handleUpdateUser = async (userId, payload) => {
    try {
      await api.updateUser(token, userId, payload);
      await refreshAdminData();
      toast.success('Perfil actualizado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar el perfil');
      toast.error(error.message || 'No se pudo actualizar el perfil');
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.deleteUser(token, userId);
      await refreshAdminData();
      toast.success('Perfil eliminado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar el perfil');
      toast.error(error.message || 'No se pudo eliminar el perfil');
      throw error;
    }
  };

  const handleCreateCategory = async (payload) => {
    try {
      await api.createCategory(token, payload);
      await refreshAdminData();
      toast.success('Categoría creada correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo crear la categoria');
      toast.error(error.message || 'No se pudo crear la categoria');
      throw error;
    }
  };

  const handleUpdateCategory = async (categoryId, payload) => {
    try {
      await api.updateCategory(token, categoryId, payload);
      await refreshAdminData();
      toast.success('Categoría actualizada correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar la categoria');
      toast.error(error.message || 'No se pudo actualizar la categoria');
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.deleteCategory(token, categoryId);
      await refreshAdminData();
      toast.success('Categoría eliminada correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar la categoria');
      toast.error(error.message || 'No se pudo eliminar la categoria');
      throw error;
    }
  };

  // ── Colaboradores ─────────────────────────────────────────────────────────
  const handleCreateEmployee = async (payload) => {
    try {
      await api.createEmployee(token, payload);
      await refreshAdminData();
      toast.success('Colaborador registrado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo registrar el colaborador');
      toast.error(error.message || 'No se pudo registrar el colaborador');
      throw error;
    }
  };

  const handleUpdateEmployee = async (employeeId, payload) => {
    try {
      await api.updateEmployee(token, employeeId, payload);
      await refreshAdminData();
      toast.success('Colaborador actualizado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo actualizar el colaborador');
      toast.error(error.message || 'No se pudo actualizar el colaborador');
      throw error;
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await api.deleteEmployee(token, employeeId);
      await refreshAdminData();
      toast.success('Colaborador eliminado correctamente.');
    } catch (error) {
      setActionError(error.message || 'No se pudo eliminar el colaborador');
      toast.error(error.message || 'No se pudo eliminar el colaborador');
      throw error;
    }
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-[#ECFEFF] text-[#164E63]">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-cyan-100 shadow-sm px-6 py-4">
          <div className="max-w-[1500px] mx-auto flex items-center gap-3">
            <img
              src="/logopngtutti.png"
              alt="Tutibocado"
              className="h-14 w-auto sm:h-16 object-contain drop-shadow-sm"
            />
            <div>
              <h1 className="font-heading font-semibold text-xl leading-tight">Tutti Bocado</h1>
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
            <img
              src="/logopngtutti.png"
              alt="Tutibocado"
              className="h-14 w-auto sm:h-16 object-contain drop-shadow-sm"
            />
            <div>
              <h1 className="font-heading font-semibold text-xl leading-tight">Tutti Bocado</h1>
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
                  onClick={() => { setSelectedProtocol(null); setView('reports'); }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'reports' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <BarChart2 size={16} /> Reportes
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
                  onClick={() => { setSelectedProtocol(null); setView('admin'); }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'admin' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <UserCheck size={16} /> Colaboradores
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
            ) : isSupervisor ? (
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
                  onClick={() => { setSelectedProtocol(null); setView('reports'); }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'reports' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <BarChart2 size={16} /> Reportes
                </button>
              </div>
            ) : isSucursal ? (
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
                  onClick={() => { setSelectedProtocol(null); setView('myreports'); }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'myreports' ? 'bg-cyan-600 text-white' : 'text-cyan-800 hover:bg-cyan-50'
                  }`}
                >
                  <ClipboardList size={16} /> Mis Reportes
                </button>
              </div>
            ) : null}

            {/* Campana de notificaciones para admin, capital_humano, supervisor y sucursal */}
            {canReceiveNotifications && (
              <NotificationBell
                token={token}
                onNotificationClick={(n) => {
                  // hr_report → admin/capital_humano van al panel HR; sucursal va a sus reportes
                  if (n.entityType === 'hr_report') {
                    setSelectedProtocol(null);
                    if (isAdmin || isCapitalHumano) setView('hr');
                    else if (isSucursal) {
                      setMyReportsTab('incidencias');
                      setView('myreports');
                    }
                  }
                  // stock_report → abrir existencias en el destino correcto
                  if (n.entityType === 'stock_report') {
                    setSelectedProtocol(null);
                    if (isAdmin || isCapitalHumano || isSupervisor) {
                      setReportsTab('existencias');
                      setView('reports');
                    } else if (isSucursal) {
                      setMyReportsTab('existencias');
                      setView('myreports');
                    }
                  }
                  // operational_report → abrir operativos en el destino correcto
                  if (n.entityType === 'operational_report') {
                    setSelectedProtocol(null);
                    if (isAdmin || isCapitalHumano || isSupervisor) {
                      setReportsTab('operativos');
                      setView('reports');
                    } else if (isSucursal) {
                      setMyReportsTab('operativos');
                      setView('myreports');
                    }
                  }
                  // protocol_incident → vuelve al dashboard de protocolos
                  if (n.entityType === 'protocol_incident') {
                    setSelectedProtocol(null);
                    setView('dashboard');
                  }
                }}
              />
            )}

            {/* Botón reportar visible para todos los roles */}
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-3 py-2 text-sm font-semibold shadow-sm transition-colors"
              title="Enviar una incidencia de personal"
            >
              <FileText size={15} /> Incidencia de Personal
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

        {view === 'reports' && (isAdmin || isSupervisor || isCapitalHumano) ? (
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <ReportsView token={token} isAdmin={isAdmin} initialTab={reportsTab} />
          </div>
        ) : null}

        {view === 'admin' && (isAdmin || isCapitalHumano) ? (
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <AdminPanel
              token={token}
              isAdmin={isAdmin}
              roles={roles}
              users={users}
              protocols={protocols}
              categories={categories}
              employees={employees}
              onRefresh={refreshAdminData}
              onCreateRole={handleCreateRole}
              onUpdateRole={handleUpdateRole}
              onDeleteRole={handleDeleteRole}
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

        {view === 'myreports' && isSucursal ? (
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <MyReportsView token={token} initialTab={myReportsTab} />
          </div>
        ) : null}

        {view !== 'admin' && view !== 'hr' && view !== 'myreports' && view !== 'reports' && selectedProtocol ? (
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <ProtocolDetail
              protocol={selectedProtocol}
              onBack={() => setSelectedProtocol(null)}
              onCreateProtocolIncident={handleCreateProtocolIncident}
            />
          </div>
        ) : null}

        {view !== 'admin' && view !== 'hr' && view !== 'myreports' && view !== 'reports' && !selectedProtocol ? (
          <Dashboard protocols={protocols} onSelect={setSelectedProtocol} />
        ) : null}
      </main>

      {/* Modal de reporte para todos los colaboradores */}
      {showReportModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowReportModal(false); }}
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-100">
              <h2 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
                <FileText size={18} /> Incidencia de Personal
              </h2>
              <button type="button" onClick={() => setShowReportModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <ReportForm
                token={token}
                onSuccess={() => {
                  setShowReportModal(false);
                  toast.success('Reporte enviado correctamente.');
                }}
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
