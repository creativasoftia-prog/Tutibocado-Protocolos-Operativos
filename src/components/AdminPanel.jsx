import React from 'react';
import {
  PlusCircle,
  UserPlus,
  ShieldPlus,
  RefreshCcw,
  FolderKanban,
  Users,
  KeyRound,
  Tags,
  Pencil,
  Trash2,
  XCircle,
  Eye,
  X,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Package,
  ShieldAlert,
  MonitorX,
  Scale,
  FileText,
  Truck,
  MessageSquare,
  ShoppingBag,
  Megaphone,
  Wrench,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
  MessagesSquare,
  Thermometer,
  Flame,
  Droplets,
  Building2,
  ClipboardList,
  CreditCard,
  Clock,
  Star,
  Bug,
  ChefHat,
  BarChart2,
  DollarSign,
  Phone,
  MapPin,
  Lock,
  AlertOctagon,
  Coffee,
  HeartHandshake,
  Stethoscope,
  Wifi,
  Clipboard,
  Recycle,
  UserCheck,
  Briefcase,
  Battery,
} from 'lucide-react';

// ── Iconos disponibles para elegir ────────────────────────────────────────────
const ICON_OPTIONS = [
  // ── Operaciones ───────────────────────────────────────────────────────────
  { key: 'Package',       label: 'Caja · Operativo general',            Component: Package,        color: 'text-blue-500' },
  { key: 'ClipboardList', label: 'Lista · Inventario / Checklist',      Component: ClipboardList,  color: 'text-blue-600' },
  { key: 'Clipboard',     label: 'Tablilla · Bitácora / Registro',      Component: Clipboard,      color: 'text-slate-600' },
  { key: 'Briefcase',     label: 'Maletín · Corporativo / Negocio',     Component: Briefcase,      color: 'text-slate-700' },
  { key: 'Clock',         label: 'Reloj · Tiempos / Turnos',            Component: Clock,          color: 'text-indigo-500' },
  { key: 'Star',          label: 'Estrella · Calidad / Estándar',       Component: Star,           color: 'text-yellow-500' },
  // ── Infraestructura ───────────────────────────────────────────────────────
  { key: 'Zap',           label: 'Rayo · Electricidad / Energía',       Component: Zap,            color: 'text-amber-500' },
  { key: 'Battery',       label: 'Batería · Suministro / UPS',          Component: Battery,        color: 'text-amber-600' },
  { key: 'Wifi',          label: 'Wifi · Red / Conectividad',           Component: Wifi,           color: 'text-sky-500' },
  { key: 'Building2',     label: 'Edificio · Sucursal / Instalaciones', Component: Building2,      color: 'text-stone-600' },
  { key: 'Droplets',      label: 'Gotas · Agua / Limpieza',             Component: Droplets,       color: 'text-blue-400' },
  { key: 'Thermometer',   label: 'Termómetro · Temperatura / Frío',     Component: Thermometer,    color: 'text-cyan-600' },
  { key: 'Flame',         label: 'Llama · Fuego / Emergencia',          Component: Flame,          color: 'text-red-500' },
  // ── Insumos y logística ───────────────────────────────────────────────────
  { key: 'ShoppingBag',   label: 'Bolsa · Insumos / Consumibles',       Component: ShoppingBag,    color: 'text-green-500' },
  { key: 'Truck',         label: 'Camión · Logística / Entregas',       Component: Truck,          color: 'text-orange-500' },
  { key: 'Recycle',       label: 'Reciclaje · Devoluciones / Retorno',  Component: Recycle,        color: 'text-green-600' },
  // ── Tecnología y pagos ────────────────────────────────────────────────────
  { key: 'MonitorX',      label: 'Monitor · Tecnología / Soporte',      Component: MonitorX,       color: 'text-purple-500' },
  { key: 'CreditCard',    label: 'Tarjeta · Terminal / Pagos',          Component: CreditCard,     color: 'text-violet-500' },
  // ── Personas y comunicación ───────────────────────────────────────────────
  { key: 'Users',         label: 'Grupo · Capital Humano / Personal',   Component: Users,          color: 'text-indigo-500' },
  { key: 'UserCheck',     label: 'Usuario ✓ · Verificación / Acceso',   Component: UserCheck,      color: 'text-emerald-500' },
  { key: 'Phone',         label: 'Teléfono · Comunicación / Llamadas',  Component: Phone,          color: 'text-teal-500' },
  { key: 'MessageSquare', label: 'Mensaje · Atención al Cliente',       Component: MessageSquare,  color: 'text-pink-500' },
  { key: 'Coffee',        label: 'Café · Servicio / Atención',          Component: Coffee,         color: 'text-amber-700' },
  { key: 'HeartHandshake',label: 'Apoyo · Servicio especial / VIP',     Component: HeartHandshake, color: 'text-rose-500' },
  // ── Cocina y alimentos ────────────────────────────────────────────────────
  { key: 'ChefHat',       label: 'Gorro · Cocina / Preparación',        Component: ChefHat,        color: 'text-orange-600' },
  { key: 'Bug',           label: 'Insecto · Plagas / Higiene',          Component: Bug,            color: 'text-lime-600' },
  // ── Seguridad y salud ─────────────────────────────────────────────────────
  { key: 'ShieldCheck',   label: 'Escudo ✓ · Sanidad / Cumplimiento',   Component: ShieldCheck,    color: 'text-emerald-500' },
  { key: 'ShieldAlert',   label: 'Escudo ! · Seguridad / Alerta',       Component: ShieldAlert,    color: 'text-red-600' },
  { key: 'Lock',          label: 'Candado · Acceso / Seguridad',        Component: Lock,           color: 'text-slate-600' },
  { key: 'Stethoscope',   label: 'Estetoscopio · Salud / Médico',       Component: Stethoscope,    color: 'text-green-600' },
  { key: 'AlertOctagon',  label: 'Octágono · Urgente / Emergencia',     Component: AlertOctagon,   color: 'text-red-700' },
  // ── Finanzas y gobierno ───────────────────────────────────────────────────
  { key: 'DollarSign',    label: 'Signo $ · Caja / Efectivo',           Component: DollarSign,     color: 'text-emerald-600' },
  { key: 'BarChart2',     label: 'Barras · Ventas / Indicadores',       Component: BarChart2,      color: 'text-cyan-700' },
  { key: 'Scale',         label: 'Balanza · Gobierno / Regulatorio',    Component: Scale,          color: 'text-slate-600' },
  { key: 'FileText',      label: 'Archivo · Finanzas / Documentos',     Component: FileText,       color: 'text-cyan-600' },
  // ── Promociones y generales ───────────────────────────────────────────────
  { key: 'Megaphone',     label: 'Altavoz · Comunicados / Promos',      Component: Megaphone,      color: 'text-orange-500' },
  { key: 'MapPin',        label: 'Pin · Ubicación / Sucursal',          Component: MapPin,         color: 'text-red-400' },
  { key: 'Wrench',        label: 'Llave · Maquinaria / Mantenimiento',  Component: Wrench,         color: 'text-teal-600' },
  { key: 'AlertTriangle', label: 'Triángulo · General / Sin clasificar',Component: AlertTriangle,  color: 'text-gray-500' },
];

const iconByKey = (key) => ICON_OPTIONS.find((i) => i.key === key) || ICON_OPTIONS[ICON_OPTIONS.length - 1];

const PRIORITY_BADGE = {
  'Crítica': 'bg-red-100 text-red-700 border-red-200',
  'Alta':    'bg-orange-100 text-orange-700 border-orange-200',
  'Media':   'bg-blue-100 text-blue-700 border-blue-200',
  'Baja':    'bg-gray-100 text-gray-600 border-gray-200',
};

// ── Vista previa de protocolo ──────────────────────────────────────────────────
function ProtocolPreview({ form }) {
  const icon = iconByKey(form.icon || '');
  const IconComp = icon.Component;
  const steps = form.textSteps.filter(Boolean);

  return (
    <div className="rounded-2xl overflow-hidden border border-cyan-200 shadow-md text-sm">
      {/* Cabecera */}
      <div className="bg-gradient-to-r from-cyan-900 to-cyan-700 text-white px-6 py-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-white text-cyan-900 px-3 py-1 rounded-lg font-black text-xs tracking-widest">
            {form.code || 'X-00'}
          </span>
          <span className="bg-cyan-800/70 border border-cyan-600/40 px-3 py-1 rounded-lg text-xs font-semibold">
            {form.type || 'Categoría'}
          </span>
          {form.priority && (
            <span className={`px-3 py-1 rounded-lg font-bold text-xs border ${
              form.priority === 'Crítica' ? 'bg-red-500/20 text-red-100 border-red-400/30' :
              form.priority === 'Alta'    ? 'bg-orange-500/20 text-orange-100 border-orange-400/30' :
              'bg-blue-500/20 text-blue-100 border-blue-400/30'}`}>
              Prioridad {form.priority}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <IconComp size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold leading-tight">{form.name || 'Nombre del protocolo'}</h3>
            <p className="text-cyan-200 text-xs mt-0.5">{form.description || 'Descripción del protocolo...'}</p>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white space-y-4">
        {/* Situación detonante */}
        {form.trigger && (
          <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-xl px-4 py-3">
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <AlertCircle size={13} /> Situación detonante
            </p>
            <p className="text-orange-900 text-xs leading-relaxed">{form.trigger}</p>
          </div>
        )}

        {/* Responsable y áreas */}
        <div className="flex flex-wrap gap-2 text-xs">
          {form.responsible && (
            <span className="bg-cyan-50 border border-cyan-200 text-cyan-800 px-2.5 py-1 rounded-lg font-medium">
              👤 {form.responsible}
            </span>
          )}
          {form.areas.filter(Boolean).map((a, i) => (
            <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
              {a}
            </span>
          ))}
        </div>

        {/* Pasos */}
        {steps.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Pasos operativos
            </p>
            {steps.slice(0, 4).map((step, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-700 text-xs leading-relaxed">{step}</p>
              </div>
            ))}
            {steps.length > 4 && (
              <p className="text-xs text-cyan-500 font-medium pl-7">+{steps.length - 4} pasos más...</p>
            )}
          </div>
        )}

        {/* Comunicación / cierre */}
        {(form.communicationRules || form.closingCriteria) && (
          <div className="grid grid-cols-1 gap-2">
            {form.communicationRules && (
              <div className="bg-sky-50 border border-sky-100 rounded-xl px-3 py-2.5">
                <p className="text-xs font-bold text-sky-700 flex items-center gap-1.5 mb-1">
                  <MessagesSquare size={12} /> Comunicación
                </p>
                <p className="text-xs text-sky-900 leading-relaxed">{form.communicationRules}</p>
              </div>
            )}
            {form.closingCriteria && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 size={12} /> Criterios de cierre
                </p>
                <p className="text-xs text-emerald-900 leading-relaxed">{form.closingCriteria}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


const PROTOCOL_PAGE_SIZE = 10;

const emptyProtocol = {
  code: '',
  name: '',
  description: '',
  trigger: '',
  responsible: '',
  areas: ['Operaciones'],
  priority: 'Media',
  type: 'Operativo',
  icon: '',
  textSteps: [''],
  communicationRules: '',
  closingCriteria: '',
  recommendations: '',
  visibleForRoles: ['supervisor', 'sucursal']
};

const emptyRole = { name: '', description: '' };

const emptyUser = {
  fullName: '',
  email: '',
  password: '',
  roleNames: ['sucursal'],
  isActive: true
};

const emptyCategory = { name: '' };

const emptyEmployee = {
  employeeCode: '',
  fullName: '',
  email: '',
  phone: '',
  department: '',
  branch: '',
  position: '',
  shift: '',
  isActive: true,
  notes: '',
};

const EMPLOYEE_PAGE_SIZE = 10;

export default function AdminPanel({
  roles,
  users,
  protocols,
  categories,
  onRefresh,
  onCreateRole,
  onCreateUser,
  onCreateProtocol,
  onUpdateProtocol,
  onDeleteProtocol,
  onUpdateUser,
  onDeleteUser,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  employees,
  onCreateEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) {
  const [activeSection, setActiveSection] = React.useState('protocols');

  const [protocolForm, setProtocolForm] = React.useState(emptyProtocol);
  const [editingProtocolId, setEditingProtocolId] = React.useState('');
  const [showProtocolModal, setShowProtocolModal] = React.useState(false);
  const [protocolPreviewTab, setProtocolPreviewTab] = React.useState(false);
  const [protocolPage, setProtocolPage] = React.useState(0);

  const [roleForm, setRoleForm] = React.useState(emptyRole);

  const [userForm, setUserForm] = React.useState(emptyUser);
  const [editingUserId, setEditingUserId] = React.useState(null);

  const [categoryForm, setCategoryForm] = React.useState(emptyCategory);
  const [editingCategoryId, setEditingCategoryId] = React.useState('');

  const [employeeForm, setEmployeeForm] = React.useState(emptyEmployee);
  const [editingEmployeeId, setEditingEmployeeId] = React.useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = React.useState(false);
  const [employeePage, setEmployeePage] = React.useState(0);
  const [employeeSearch, setEmployeeSearch] = React.useState('');

  const [feedback, setFeedback] = React.useState('');

  const setProtocolField = (field, value) => {
    setProtocolForm((prev) => ({ ...prev, [field]: value }));
  };

  const setProtocolAreaAt = (index, value) => {
    const next = [...protocolForm.areas];
    next[index] = value;
    setProtocolField('areas', next);
  };

  const addProtocolArea = () => {
    setProtocolField('areas', [...protocolForm.areas, '']);
  };

  const removeProtocolArea = (index) => {
    const next = protocolForm.areas.filter((_, itemIndex) => itemIndex !== index);
    setProtocolField('areas', next.length ? next : ['']);
  };

  const sectionButtonClass = (isActive) =>
    `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-cyan-600 text-white shadow-sm'
        : 'bg-white text-cyan-800 border border-cyan-100 hover:bg-cyan-50'
    }`;

  const toggleRoleValue = (name, targetKey) => {
    const current = targetKey === 'protocol' ? protocolForm.visibleForRoles : userForm.roleNames;
    const setter =
      targetKey === 'protocol'
        ? setProtocolField
        : (key, value) => setUserForm((prev) => ({ ...prev, [key]: value }));

    const next = current.includes(name) ? current.filter((item) => item !== name) : [...current, name];
    setter(targetKey === 'protocol' ? 'visibleForRoles' : 'roleNames', next);
  };

  const resetProtocolForm = () => {
    setProtocolForm(emptyProtocol);
    setEditingProtocolId('');
    setShowProtocolModal(false);
    setProtocolPreviewTab(false);
  };

  const resetUserForm = () => {
    setUserForm(emptyUser);
    setEditingUserId(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategory);
    setEditingCategoryId('');
  };

  const resetEmployeeForm = () => {
    setEmployeeForm(emptyEmployee);
    setEditingEmployeeId(null);
    setShowEmployeeModal(false);
  };

  const startEditEmployee = (emp) => {
    setEditingEmployeeId(emp.id);
    setEmployeeForm({
      employeeCode: emp.employeeCode || '',
      fullName: emp.fullName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      department: emp.department || '',
      branch: emp.branch || '',
      position: emp.position || '',
      shift: emp.shift || '',
      isActive: emp.isActive !== false,
      notes: emp.notes || '',
    });
    setShowEmployeeModal(true);
  };

  const submitEmployee = async (e) => {
    e.preventDefault();
    const payload = {
      ...employeeForm,
      email: employeeForm.email || null,
      phone: employeeForm.phone || null,
      department: employeeForm.department || null,
      branch: employeeForm.branch || null,
      position: employeeForm.position || null,
      shift: employeeForm.shift || null,
      notes: employeeForm.notes || null,
    };
    if (editingEmployeeId) {
      await onUpdateEmployee(editingEmployeeId, payload);
      setFeedback('Empleado actualizado correctamente.');
    } else {
      await onCreateEmployee(payload);
      setFeedback('Empleado registrado correctamente.');
    }
    resetEmployeeForm();
  };

  const removeEmployee = async (emp) => {
    if (!window.confirm(`¿Eliminar a ${emp.fullName}? Esta acción no se puede deshacer.`)) return;
    await onDeleteEmployee(emp.id);
    setFeedback('Empleado eliminado.');
  };

  const submitRole = async (event) => {
    event.preventDefault();
    await onCreateRole(roleForm);
    setRoleForm(emptyRole);
    setFeedback('Rol creado correctamente.');
  };

  const submitCategory = async (event) => {
    event.preventDefault();

    if (editingCategoryId) {
      await onUpdateCategory(editingCategoryId, categoryForm);
      setFeedback('Categoria actualizada correctamente.');
    } else {
      await onCreateCategory(categoryForm);
      setFeedback('Categoria creada correctamente.');
    }

    resetCategoryForm();
  };

  const submitUser = async (event) => {
    event.preventDefault();

    if (editingUserId) {
      await onUpdateUser(editingUserId, userForm);
      setFeedback('Perfil actualizado correctamente.');
    } else {
      await onCreateUser(userForm);
      setFeedback('Perfil de usuario creado correctamente.');
    }

    resetUserForm();
  };

  const submitProtocol = async (event) => {
    event.preventDefault();

    const payload = {
      ...protocolForm,
      areas: protocolForm.areas.map((item) => item.trim()).filter(Boolean),
      textSteps: protocolForm.textSteps.map((step) => step.trim()).filter(Boolean)
    };

    if (editingProtocolId) {
      await onUpdateProtocol(editingProtocolId, payload);
      setFeedback('Protocolo actualizado correctamente.');
    } else {
      await onCreateProtocol(payload);
      setFeedback('Protocolo creado y visible segun roles seleccionados.');
    }

    resetProtocolForm(); // closes modal too
  };

  const startEditProtocol = (protocol) => {
    setEditingProtocolId(protocol.id);
    setProtocolForm({
      code: protocol.code,
      name: protocol.name,
      description: protocol.description,
      trigger: protocol.trigger,
      responsible: protocol.responsible,
      areas: protocol.areas?.length ? protocol.areas : ['Operaciones'],
      priority: protocol.priority,
      type: protocol.type,
      icon: protocol.icon || '',
      textSteps: protocol.textSteps?.length ? protocol.textSteps : [''],
      communicationRules: protocol.communicationRules || '',
      closingCriteria: protocol.closingCriteria || '',
      recommendations: protocol.recommendations || '',
      visibleForRoles: protocol.visibleForRoles?.length ? protocol.visibleForRoles : ['sucursal']
    });
    setShowProtocolModal(true);
    setProtocolPreviewTab(false);
    setActiveSection('protocols');
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setUserForm({
      fullName: user.fullName,
      email: user.email,
      password: '',
      roleNames: user.roles?.length ? user.roles : ['sucursal'],
      isActive: Boolean(user.isActive)
    });
    setActiveSection('users');
  };

  const startEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ name: category.name });
    setActiveSection('categories');
  };

  const removeProtocol = async (protocol) => {
    const approved = window.confirm(`Eliminar protocolo ${protocol.code} - ${protocol.name}?`);
    if (!approved) return;
    await onDeleteProtocol(protocol.id);
    setFeedback('Protocolo eliminado correctamente.');
    if (editingProtocolId === protocol.id) resetProtocolForm();
  };

  const removeUser = async (user) => {
    const approved = window.confirm(`Eliminar perfil de ${user.fullName}?`);
    if (!approved) return;
    await onDeleteUser(user.id);
    setFeedback('Perfil eliminado correctamente.');
    if (editingUserId === user.id) resetUserForm();
  };

  const removeCategory = async (category) => {
    const approved = window.confirm(`Eliminar categoria ${category.name}?`);
    if (!approved) return;
    await onDeleteCategory(category.id);
    setFeedback('Categoria eliminada correctamente.');
    if (editingCategoryId === category.id) resetCategoryForm();
  };

  const NAV_ITEMS = [
    { key: 'protocols',  label: 'Protocolos', Icon: FolderKanban, count: protocols.length },
    { key: 'users',      label: 'Perfiles',   Icon: Users,        count: users.length },
    { key: 'employees',  label: 'Empleados',  Icon: UserCheck,    count: employees?.length || 0 },
    { key: 'categories', label: 'Categorías', Icon: Tags,         count: categories.length },
    { key: 'roles',      label: 'Roles',      Icon: KeyRound,     count: roles.length },
  ];

  return (
    <div className="space-y-4">

      {/* ── Header — siempre visible en todas las secciones ───────────── */}
      <div className="bg-gradient-to-r from-cyan-800 to-cyan-600 text-white rounded-2xl border border-cyan-700 shadow-lg p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-heading font-bold">Panel administrador</h2>
            <p className="text-sm text-cyan-100">Gestion automatizada y editable de protocolos, usuarios y categorias.</p>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-200/40 rounded-lg text-cyan-50 hover:bg-cyan-500/30"
          >
            <RefreshCcw size={16} />
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-cyan-100">Roles</p>
            <p className="text-2xl font-bold">{roles.length}</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-cyan-100">Usuarios</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-cyan-100">Protocolos</p>
            <p className="text-2xl font-bold">{protocols.length}</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-cyan-100">Categorias</p>
            <p className="text-2xl font-bold">{categories.length}</p>
          </div>
        </div>
      </div>

      {feedback ? (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{feedback}</p>
      ) : null}

      {/* ── Sidebar + contenido ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] gap-5 items-start">

        {/* Navegación móvil */}
        <div className="md:hidden bg-white rounded-2xl border border-cyan-100 shadow-sm p-2 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {NAV_ITEMS.map(({ key, label, Icon: NavIcon, count }) => (
              <button
                key={`mobile-${key}`}
                onClick={() => setActiveSection(key)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeSection === key
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-800'
                }`}
              >
                <NavIcon size={14} />
                {label}
                {count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeSection === key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar de navegación */}
        <aside className="hidden md:flex flex-col w-full shrink-0 sticky top-4 rounded-2xl border border-cyan-100 shadow-sm overflow-hidden bg-white">
          <div className="bg-gradient-to-b from-cyan-700 to-cyan-600 px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-200 mb-0.5">Panel Admin</p>
            <p className="text-white font-heading font-bold text-base leading-tight">Administración</p>
          </div>
          <div className="p-2 flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ key, label, Icon: NavIcon, count }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                  activeSection === key
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <NavIcon size={15} />
                  {label}
                </span>
                {count !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 min-w-[1.5rem] text-center ${
                    activeSection === key ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>{count}</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="min-w-0 space-y-4">

      {activeSection === 'roles' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-cyan-900 text-xl mb-4 flex items-center gap-2">
            <ShieldPlus size={20} /> Crear rol
          </h3>
          <form onSubmit={submitRole} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input required value={roleForm.name} onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nombre del rol" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
            <input required value={roleForm.description} onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descripcion" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
            <button className="bg-cyan-600 text-white rounded-lg font-semibold px-4 py-2.5">Guardar rol</button>
          </form>
          <div className="mt-5 border-t border-cyan-100 pt-4">
            <p className="text-sm font-semibold text-cyan-800 mb-2">Roles actuales</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <span key={`role-chip-${role.name}`} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-800 text-sm">
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeSection === 'categories' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-cyan-900 text-xl mb-4 flex items-center gap-2">
            <Tags size={20} /> Gestion de categorias
          </h3>
          <form onSubmit={submitCategory} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input required value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })} placeholder="Nombre de categoria" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
            <div className="md:col-span-2 flex flex-wrap gap-2">
              <button className="bg-cyan-600 text-white rounded-lg font-semibold px-4 py-2.5">
                {editingCategoryId ? 'Guardar cambios' : 'Crear categoria'}
              </button>
              {editingCategoryId ? (
                <button type="button" onClick={resetCategoryForm} className="bg-white text-slate-700 rounded-lg border border-slate-200 font-semibold px-4 py-2.5">
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>

          <div className="mt-5 border-t border-cyan-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category.id} className="rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{category.name}</p>
                  <p className="text-xs text-slate-500">Protocolos relacionados: {category.protocolsCount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => startEditCategory(category)} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900">
                    <Pencil size={14} /> Editar
                  </button>
                  <button type="button" onClick={() => removeCategory(category)} className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900">
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeSection === 'users' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-cyan-900 text-xl mb-4 flex items-center gap-2">
            <UserPlus size={20} /> {editingUserId ? 'Editar perfil' : 'Crear perfil'}
          </h3>
          <form onSubmit={submitUser} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input required value={userForm.fullName} onChange={(e) => setUserForm((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Nombre completo" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
              <input required type="email" value={userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Correo" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
              <input type="password" value={userForm.password} onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))} placeholder={editingUserId ? 'Nueva contrasena (opcional)' : 'Contrasena'} className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-cyan-800">
              <input type="checkbox" checked={userForm.isActive} onChange={(e) => setUserForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
              Usuario activo
            </label>
            <div>
              <p className="text-sm font-semibold text-cyan-800 mb-2">Roles del usuario</p>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <label key={role.name} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-800 text-sm">
                    <input type="checkbox" checked={userForm.roleNames.includes(role.name)} onChange={() => toggleRoleValue(role.name, 'user')} />
                    {role.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="bg-cyan-600 text-white rounded-lg font-semibold px-4 py-2.5">
                {editingUserId ? 'Guardar cambios' : 'Crear perfil'}
              </button>
              {editingUserId ? (
                <button type="button" onClick={resetUserForm} className="bg-white text-slate-700 rounded-lg border border-slate-200 font-semibold px-4 py-2.5 inline-flex items-center gap-1">
                  <XCircle size={14} /> Cancelar edicion
                </button>
              ) : null}
            </div>
          </form>

          <div className="mt-5 border-t border-cyan-100 pt-4">
            <p className="text-sm font-semibold text-cyan-800 mb-2">Perfiles creados</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {users.map((user) => (
                <div key={user.email} className="rounded-lg border border-slate-200 px-3 py-2 bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{user.fullName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <p className="text-xs text-cyan-700">Roles: {user.roles.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => startEditUser(user)} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900">
                        <Pencil size={14} /> Editar
                      </button>
                      <button type="button" onClick={() => removeUser(user)} className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900">
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeSection === 'protocols' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          {/* Encabezado + botón nuevo */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h3 className="font-heading font-semibold text-cyan-900 text-xl flex items-center gap-2">
              <FolderKanban size={20} /> Protocolos
            </h3>
            <button
              type="button"
              onClick={() => { resetProtocolForm(); setShowProtocolModal(true); }}
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors"
            >
              <PlusCircle size={16} /> Nuevo protocolo
            </button>
          </div>

          {/* Lista paginada */}
          {protocols.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No hay protocolos creados.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {protocols
                  .slice(protocolPage * PROTOCOL_PAGE_SIZE, (protocolPage + 1) * PROTOCOL_PAGE_SIZE)
                  .map((protocol) => {
                    const iconOpt = iconByKey(protocol.icon || '');
                    const IconComp = iconOpt.Component;
                    return (
                      <div key={protocol.id} className="rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
                              <IconComp size={16} className={iconOpt.color} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 text-sm truncate">{protocol.code} — {protocol.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span className="text-xs text-slate-400">{protocol.type}</span>
                                {protocol.priority && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${PRIORITY_BADGE[protocol.priority] || PRIORITY_BADGE['Media']}`}>
                                    {protocol.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              title="Editar"
                              onClick={() => startEditProtocol(protocol)}
                              className="p-1.5 rounded-lg text-cyan-700 hover:bg-cyan-50 hover:text-cyan-900 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              title="Eliminar"
                              onClick={() => removeProtocol(protocol)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Paginacion */}
              {protocols.length > PROTOCOL_PAGE_SIZE && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-100">
                  <button
                    type="button"
                    disabled={protocolPage === 0}
                    onClick={() => setProtocolPage((p) => p - 1)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-50"
                  >
                    <ChevronLeft size={15} /> Anterior
                  </button>
                  <span className="text-xs text-slate-500">
                    Página {protocolPage + 1} de {Math.ceil(protocols.length / PROTOCOL_PAGE_SIZE)}
                    {' '}· {protocols.length} protocolos
                  </span>
                  <button
                    type="button"
                    disabled={(protocolPage + 1) * PROTOCOL_PAGE_SIZE >= protocols.length}
                    onClick={() => setProtocolPage((p) => p + 1)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-50"
                  >
                    Siguiente <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      ) : null}

      {/* ── Modal crear/editar protocolo ──────────────────────────────────────── */}
      {showProtocolModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) resetProtocolForm(); }}
        >
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-100 shrink-0">
              <h2 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
                {editingProtocolId ? <Pencil size={18} /> : <PlusCircle size={18} />}
                {editingProtocolId ? 'Editar protocolo' : 'Nuevo protocolo'}
              </h2>
              <div className="flex items-center gap-2">
                {/* Tab: Formulario / Vista previa */}
                <div className="flex bg-slate-100 rounded-lg p-0.5 text-sm">
                  <button
                    type="button"
                    onClick={() => setProtocolPreviewTab(false)}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${!protocolPreviewTab ? 'bg-white text-cyan-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Formulario
                  </button>
                  <button
                    type="button"
                    onClick={() => setProtocolPreviewTab(true)}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${protocolPreviewTab ? 'bg-white text-cyan-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Eye size={13} /> Vista previa
                  </button>
                </div>
                <button
                  type="button"
                  onClick={resetProtocolForm}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {protocolPreviewTab ? (
                <ProtocolPreview form={protocolForm} />
              ) : (
                <form id="protocol-modal-form" onSubmit={submitProtocol} className="space-y-4">
                  {/* Fila 1: Código, Nombre, Categoría */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Código</label>
                      <input required value={protocolForm.code} onChange={(e) => setProtocolField('code', e.target.value)} placeholder="Ej. E-01" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Nombre del protocolo</label>
                      <input required value={protocolForm.name} onChange={(e) => setProtocolField('name', e.target.value)} placeholder="Ej. Apertura de caja" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Categoría / tipo</label>
                      <select required value={protocolForm.type} onChange={(e) => setProtocolField('type', e.target.value)} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm">
                        {categories.length === 0 && <option value="">Sin categorías</option>}
                        {protocolForm.type && !categories.some((c) => c.name === protocolForm.type) && (
                          <option value={protocolForm.type}>{protocolForm.type}</option>
                        )}
                        {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Descripción y detonante */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Descripción</label>
                      <textarea required value={protocolForm.description} onChange={(e) => setProtocolField('description', e.target.value)} placeholder="Objetivo del protocolo" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Situación detonante</label>
                      <textarea required value={protocolForm.trigger} onChange={(e) => setProtocolField('trigger', e.target.value)} placeholder="¿Qué activa este protocolo?" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                  </div>

                  {/* Responsable, prioridad */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Responsable</label>
                      <input required value={protocolForm.responsible} onChange={(e) => setProtocolField('responsible', e.target.value)} placeholder="Área o rol" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Prioridad</label>
                      <select value={protocolForm.priority} onChange={(e) => setProtocolField('priority', e.target.value)} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm">
                        <option>Baja</option><option>Media</option><option>Alta</option><option>Crítica</option>
                      </select>
                    </div>
                  </div>

                  {/* Selector de icono */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800 block">Ícono del protocolo</label>
                    <div className="grid grid-cols-7 gap-2">
                      {ICON_OPTIONS.map(({ key, label, Component: IconC, color }) => (
                        <button
                          key={key}
                          type="button"
                          title={label}
                          onClick={() => setProtocolField('icon', key)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                            protocolForm.icon === key
                              ? 'border-cyan-500 bg-cyan-50 shadow-sm scale-105'
                              : 'border-transparent bg-slate-50 hover:bg-white hover:border-cyan-200'
                          }`}
                        >
                          <IconC size={20} className={color} />
                          <span className="text-[9px] text-slate-500 leading-tight text-center line-clamp-2">{label.split('/')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Áreas */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800 mb-2">Áreas notificadas</p>
                    <div className="space-y-2">
                      {protocolForm.areas.map((area, index) => (
                        <div key={`area-${index}`} className="flex items-center gap-2">
                          <input required value={area} onChange={(e) => setProtocolAreaAt(index, e.target.value)} placeholder={`Área ${index + 1}`} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                          <button type="button" onClick={() => removeProtocolArea(index)} className="px-2.5 py-2 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold shrink-0">Quitar</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={addProtocolArea} className="mt-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900">+ Área</button>
                  </div>

                  {/* Pasos */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800 mb-2">Pasos operativos</p>
                    <div className="space-y-2">
                      {protocolForm.textSteps.map((step, index) => (
                        <div key={`step-${index}`} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs shrink-0">{index + 1}</span>
                          <input
                            required
                            value={step}
                            onChange={(e) => { const next = [...protocolForm.textSteps]; next[index] = e.target.value; setProtocolField('textSteps', next); }}
                            placeholder={`Paso ${index + 1}`}
                            className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                          />
                          {protocolForm.textSteps.length > 1 && (
                            <button type="button" onClick={() => setProtocolField('textSteps', protocolForm.textSteps.filter((_, i) => i !== index))} className="px-2.5 py-2 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold shrink-0">Quitar</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setProtocolField('textSteps', [...protocolForm.textSteps, ''])} className="mt-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900">+ Paso</button>
                  </div>

                  {/* Comunicación, cierre, recomendaciones */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Comunicación</label>
                      <textarea required value={protocolForm.communicationRules} onChange={(e) => setProtocolField('communicationRules', e.target.value)} placeholder="A quién y cómo se reporta" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Criterios de cierre</label>
                      <textarea required value={protocolForm.closingCriteria} onChange={(e) => setProtocolField('closingCriteria', e.target.value)} placeholder="Cuándo se da por terminado" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Recomendaciones</label>
                      <textarea required value={protocolForm.recommendations} onChange={(e) => setProtocolField('recommendations', e.target.value)} placeholder="Buenas prácticas y advertencias" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                  </div>

                  {/* Roles visibles */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800 mb-2">Visible para roles</p>
                    <div className="flex flex-wrap gap-2">
                      {roles.map((role) => (
                        <label key={`protocol-role-${role.name}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-800 text-sm cursor-pointer hover:bg-cyan-100">
                          <input type="checkbox" checked={protocolForm.visibleForRoles.includes(role.name)} onChange={() => toggleRoleValue(role.name, 'protocol')} />
                          {role.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-cyan-100 shrink-0 bg-slate-50/70 rounded-b-2xl">
              <button type="button" onClick={resetProtocolForm} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white transition-colors">
                <X size={14} /> Cancelar
              </button>
              <div className="flex items-center gap-2">
                {!protocolPreviewTab && (
                  <button type="button" onClick={() => setProtocolPreviewTab(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-cyan-200 text-cyan-700 font-semibold text-sm hover:bg-cyan-50 transition-colors">
                    <Eye size={14} /> Previsualizar
                  </button>
                )}
                <button
                  type="submit"
                  form="protocol-modal-form"
                  className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold px-5 py-2.5 text-sm shadow-sm transition-colors"
                >
                  {editingProtocolId ? 'Guardar cambios' : 'Crear protocolo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Sección Empleados ────────────────────────────────────────────────── */}
      {activeSection === 'employees' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h3 className="font-heading font-semibold text-cyan-900 text-xl flex items-center gap-2">
              <Users size={20} /> Empleados
            </h3>
            <button
              type="button"
              onClick={() => { resetEmployeeForm(); setShowEmployeeModal(true); }}
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors"
            >
              <PlusCircle size={16} /> Nuevo empleado
            </button>
          </div>

          {/* Búsqueda rápida */}
          <div className="relative mb-3">
            <input
              type="text"
              value={employeeSearch}
              onChange={(e) => { setEmployeeSearch(e.target.value); setEmployeePage(0); }}
              placeholder="Buscar por nombre, código, departamento..."
              className="w-full pl-9 pr-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>

          {/* Lista paginada */}
          {(() => {
            const q = employeeSearch.toLowerCase();
            const filtered = (employees || []).filter((e) =>
              !q ||
              e.fullName?.toLowerCase().includes(q) ||
              e.employeeCode?.toLowerCase().includes(q) ||
              e.department?.toLowerCase().includes(q) ||
              e.branch?.toLowerCase().includes(q) ||
              e.position?.toLowerCase().includes(q)
            );
            const paginated = filtered.slice(employeePage * EMPLOYEE_PAGE_SIZE, (employeePage + 1) * EMPLOYEE_PAGE_SIZE);

            if (filtered.length === 0) {
              return (
                <p className="text-sm text-slate-400 text-center py-8">
                  {(employees || []).length === 0 ? 'No hay empleados registrados.' : 'Sin resultados para esa búsqueda.'}
                </p>
              );
            }

            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {paginated.map((emp) => (
                    <div key={emp.id} className="rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded">{emp.employeeCode}</span>
                            {!emp.isActive && (
                              <span className="text-xs bg-rose-50 border border-rose-200 text-rose-600 px-2 py-0.5 rounded">Inactivo</span>
                            )}
                          </div>
                          <p className="font-semibold text-slate-800 text-sm mt-0.5">{emp.fullName}</p>
                          <p className="text-xs text-slate-400">
                            {[emp.position, emp.branch, emp.department].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditEmployee(emp)}
                            className="p-1.5 rounded-lg text-cyan-700 hover:bg-cyan-50 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeEmployee(emp)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filtered.length > EMPLOYEE_PAGE_SIZE && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-100">
                    <button
                      type="button"
                      disabled={employeePage === 0}
                      onClick={() => setEmployeePage((p) => p - 1)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
                    >
                      <ChevronLeft size={15} /> Anterior
                    </button>
                    <span className="text-xs text-slate-500">
                      Página {employeePage + 1} de {Math.ceil(filtered.length / EMPLOYEE_PAGE_SIZE)} · {filtered.length} empleados
                    </span>
                    <button
                      type="button"
                      disabled={(employeePage + 1) * EMPLOYEE_PAGE_SIZE >= filtered.length}
                      onClick={() => setEmployeePage((p) => p + 1)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
                    >
                      Siguiente <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </section>
      ) : null}

      {/* ── Modal empleado ───────────────────────────────────────────────────── */}
      {showEmployeeModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) resetEmployeeForm(); }}
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-100 shrink-0">
              <h2 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
                {editingEmployeeId ? <Pencil size={18} /> : <PlusCircle size={18} />}
                {editingEmployeeId ? 'Editar empleado' : 'Nuevo empleado'}
              </h2>
              <button type="button" onClick={resetEmployeeForm} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5">
              <form id="employee-modal-form" onSubmit={submitEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Código de empleado</label>
                    <input
                      value={employeeForm.employeeCode}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, employeeCode: e.target.value }))}
                      placeholder="Ej. EMP-001 (auto si se deja vacío)"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                    />
                    <p className="text-xs text-slate-400">Se genera automáticamente si no lo defines.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Nombre completo *</label>
                    <input
                      required
                      value={employeeForm.fullName}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="Nombre completo del empleado"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Correo electrónico</label>
                    <input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Teléfono</label>
                    <input
                      value={employeeForm.phone}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="Ej. 55 1234 5678"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Puesto</label>
                    <input
                      value={employeeForm.position}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, position: e.target.value }))}
                      placeholder="Ej. Cajero, Encargado de tienda"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Departamento</label>
                    <input
                      value={employeeForm.department}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, department: e.target.value }))}
                      placeholder="Ej. Operaciones, Ventas"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Sucursal</label>
                    <input
                      value={employeeForm.branch}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, branch: e.target.value }))}
                      placeholder="Ej. Sucursal Centro"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Turno</label>
                    <input
                      value={employeeForm.shift}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, shift: e.target.value }))}
                      placeholder="Ej. Matutino, Vespertino"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Notas internas</label>
                  <textarea
                    rows={2}
                    value={employeeForm.notes}
                    onChange={(e) => setEmployeeForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Observaciones o información adicional (solo visible para admin y RH)"
                    className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm resize-none"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-cyan-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={employeeForm.isActive}
                    onChange={(e) => setEmployeeForm((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  Empleado activo (puede enviar reportes)
                </label>
              </form>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-cyan-100 shrink-0 bg-slate-50/70 rounded-b-2xl">
              <button type="button" onClick={resetEmployeeForm} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white">
                <X size={14} /> Cancelar
              </button>
              <button
                type="submit"
                form="employee-modal-form"
                className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold px-5 py-2.5 text-sm shadow-sm"
              >
                {editingEmployeeId ? 'Guardar cambios' : 'Registrar empleado'}
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}