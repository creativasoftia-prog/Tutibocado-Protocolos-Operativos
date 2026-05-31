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
import ProtocolIncidentsPanel from './protocols/ProtocolIncidentsPanel';
import DatePicker from './DatePicker';

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
const ROLE_PAGE_SIZE = 8;
const USER_PAGE_SIZE = 8;
const CATEGORY_PAGE_SIZE = 8;

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

const emptyRole = { 
  name: '', 
  description: '',
  permissions: {
    categoryIds: [],
    protocolIds: []
  }
};

const emptyUser = {
  fullName: '',
  email: '',
  password: '',
  roleNames: ['sucursal'],
  isActive: true,
  branchName: ''
};

const emptyCategory = { name: '' };

const emptyEmployee = {
  employeeCode: '',
  fullName: '',
  email: '',
  phone: '',
  position: '',
  hireDate: '',
  isActive: true,
  notes: '',
};

const EMPLOYEE_PAGE_SIZE = 10;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminPanel({
  token,
  isAdmin = true,
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
  onUpdateRole,
  onDeleteRole,
}) {
  const [activeSection, setActiveSection] = React.useState(isAdmin ? 'protocols' : 'employees');

  const [protocolForm, setProtocolForm] = React.useState(emptyProtocol);
  const [protocolFormError, setProtocolFormError] = React.useState('');
  const [editingProtocolId, setEditingProtocolId] = React.useState('');
  const [showProtocolModal, setShowProtocolModal] = React.useState(false);
  const [protocolPreviewTab, setProtocolPreviewTab] = React.useState(false);
  const [protocolPage, setProtocolPage] = React.useState(0);

  const [roleForm, setRoleForm] = React.useState(emptyRole);
  const [roleFormError, setRoleFormError] = React.useState('');
  const [editingRoleName, setEditingRoleName] = React.useState('');
  const [rolePage, setRolePage] = React.useState(0);
  const [roleSearch, setRoleSearch] = React.useState('');

  const [userForm, setUserForm] = React.useState(emptyUser);
  const [userFormError, setUserFormError] = React.useState('');
  const [editingUserId, setEditingUserId] = React.useState(null);
  const [userPage, setUserPage] = React.useState(0);
  const [userSearch, setUserSearch] = React.useState('');

  const [categoryForm, setCategoryForm] = React.useState(emptyCategory);
  const [categoryFormError, setCategoryFormError] = React.useState('');
  const [editingCategoryId, setEditingCategoryId] = React.useState('');
  const [categoryPage, setCategoryPage] = React.useState(0);
  const [categorySearch, setCategorySearch] = React.useState('');

  const [employeeForm, setEmployeeForm] = React.useState(emptyEmployee);
  const [employeeFormError, setEmployeeFormError] = React.useState('');
  const [editingEmployeeId, setEditingEmployeeId] = React.useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = React.useState(false);
  const [employeePage, setEmployeePage] = React.useState(0);
  const [employeeSearch, setEmployeeSearch] = React.useState('');
  const [viewingEmployee, setViewingEmployee] = React.useState(null);


  const setProtocolField = (field, value) => {
    setProtocolForm((prev) => ({ ...prev, [field]: value }));
  };

  const normalizeCategory = (value) =>
    String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const getCategoryPrefix = (categoryName) => {
    const category = normalizeCategory(categoryName);

    if (category.includes('infraestructura')) return 'E';
    if (category.includes('insumos')) return 'I';
    if (category.includes('logistica')) return 'L';
    if (category.includes('tecnologia') || category.includes('soporte')) return 'S';
    if (category.includes('capital humano') || category.includes('recursos humanos')) return 'H';
    if (category.includes('sanidad')) return 'M';
    if (category.includes('gubernamentales') || category.includes('autoridad')) return 'A';
    if (category.includes('finanzas')) return 'F';
    if (category.includes('cliente')) return 'C';
    return 'PR';
  };

  const getSuggestedProtocolCode = (categoryName) => {
    const prefix = getCategoryPrefix(categoryName);
    const pattern = new RegExp(`^${prefix}-(\\d{2,4})$`, 'i');

    const maxCurrent = protocols
      .map((item) => String(item.code || '').trim().match(pattern))
      .filter(Boolean)
      .map((match) => Number(match[1] || 0))
      .reduce((max, value) => Math.max(max, value), 0);

    return `${prefix}-${String(maxCurrent + 1).padStart(2, '0')}`;
  };

  const suggestedProtocolCode = React.useMemo(
    () => getSuggestedProtocolCode(protocolForm.type),
    [protocolForm.type, protocols]
  );

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
    setProtocolFormError('');
    setEditingProtocolId('');
    setShowProtocolModal(false);
    setProtocolPreviewTab(false);
  };

  const resetUserForm = () => {
    setUserForm(emptyUser);
    setUserFormError('');
    setEditingUserId(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategory);
    setCategoryFormError('');
    setEditingCategoryId('');
  };

  const resetEmployeeForm = () => {
    setEmployeeForm(emptyEmployee);
    setEmployeeFormError('');
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
      position: emp.position || '',
      hireDate: emp.hireDate ? String(emp.hireDate).slice(0, 10) : '',
      isActive: emp.isActive !== false,
      notes: emp.notes || '',
    });
    setShowEmployeeModal(true);
  };

  const submitEmployee = async (e) => {
    e.preventDefault();
    setEmployeeFormError('');

    const normalizedEmail = employeeForm.email.trim();
    const normalizedPhone = employeeForm.phone.replace(/\D/g, '');

    if (employeeForm.fullName.trim().length < 3) {
      setEmployeeFormError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }

    if (normalizedEmail && !EMAIL_REGEX.test(normalizedEmail)) {
      setEmployeeFormError('Ingresa un correo electrónico válido.');
      return;
    }

    if (normalizedPhone && normalizedPhone.length !== 10) {
      setEmployeeFormError('El teléfono debe contener exactamente 10 dígitos.');
      return;
    }

    const payload = {
      ...employeeForm,
      employeeCode: editingEmployeeId ? employeeForm.employeeCode : '',
      fullName: employeeForm.fullName.trim(),
      email: normalizedEmail || null,
      phone: normalizedPhone || null,
      position: employeeForm.position || null,
      hireDate: employeeForm.hireDate || null,
      notes: employeeForm.notes || null,
    };
    if (editingEmployeeId) {
      await onUpdateEmployee(editingEmployeeId, payload);
    } else {
      await onCreateEmployee(payload);
    }
    resetEmployeeForm();
  };

  const removeEmployee = async (emp) => {
    if (!window.confirm(`¿Eliminar a ${emp.fullName}? Esta acción no se puede deshacer.`)) return;
    await onDeleteEmployee(emp.id);
  };

  const submitRole = async (event) => {
    event.preventDefault();
    setRoleFormError('');

    if (roleForm.name.trim().length < 3) {
      setRoleFormError('El nombre del rol debe tener al menos 3 caracteres.');
      return;
    }

    if (roleForm.description.trim().length < 3) {
      setRoleFormError('La descripción del rol debe tener al menos 3 caracteres.');
      return;
    }

    const payload = { 
      name: roleForm.name.trim(), 
      description: roleForm.description.trim(),
      permissions: roleForm.permissions
    };
    if (editingRoleName) {
      await onUpdateRole(editingRoleName, payload);
    } else {
      await onCreateRole(payload);
    }

    setRoleForm(emptyRole);
    setEditingRoleName('');
  };

  const startEditRole = (role) => {
    setEditingRoleName(role.name);
    setRoleForm({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || { categoryIds: [], protocolIds: [] }
    });
    setRoleFormError('');
  };

  const cancelEditRole = () => {
    setEditingRoleName('');
    setRoleForm(emptyRole);
    setRoleFormError('');
  };

  const removeRole = async (role) => {
    const assignedUsersCount = users.filter((user) => user.roles?.includes(role.name)).length;
    const categoriesCount = role.permissions?.categoryIds?.length || 0;
    const protocolsCount = role.permissions?.protocolIds?.length || 0;
    const isEmptyRole = assignedUsersCount === 0 && categoriesCount === 0 && protocolsCount === 0;

    if (!isEmptyRole) {
      window.alert('Solo se pueden eliminar roles vacíos (sin usuarios ni permisos asignados).');
      return;
    }

    const approved = window.confirm(`¿Eliminar rol ${role.name}?`);
    if (!approved) return;
    await onDeleteRole(role.name);
    if (editingRoleName === role.name) {
      cancelEditRole();
    }
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    setCategoryFormError('');

    if (categoryForm.name.trim().length < 3) {
      setCategoryFormError('La categoría debe tener al menos 3 caracteres.');
      return;
    }

    const payload = { name: categoryForm.name.trim() };

    if (editingCategoryId) {
      await onUpdateCategory(editingCategoryId, payload);
    } else {
      await onCreateCategory(payload);
    }

    resetCategoryForm();
  };

  const submitUser = async (event) => {
    event.preventDefault();
    setUserFormError('');

    if (userForm.fullName.trim().length < 3) {
      setUserFormError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }

    if (!EMAIL_REGEX.test(userForm.email.trim())) {
      setUserFormError('Ingresa un correo electrónico válido.');
      return;
    }

    if (!editingUserId && userForm.password.trim().length < 6) {
      setUserFormError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (editingUserId && userForm.password && userForm.password.trim().length > 0 && userForm.password.trim().length < 6) {
      setUserFormError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!userForm.roleNames.length) {
      setUserFormError('Debes seleccionar al menos un rol para el usuario.');
      return;
    }

    const payload = {
      ...userForm,
      fullName: userForm.fullName.trim(),
      email: userForm.email.trim(),
      password: userForm.password || '',
      roleNames: userForm.roleNames
    };

    if (editingUserId) {
      await onUpdateUser(editingUserId, payload);
    } else {
      await onCreateUser(payload);
    }

    resetUserForm();
  };

  const submitProtocol = async (event) => {
    event.preventDefault();
    setProtocolFormError('');

    const availableRoleNames = roles.map((role) => role.name);
    const sanitizedVisibleRoles = protocolForm.visibleForRoles
      .map((item) => item.trim())
      .filter((item) => item && availableRoleNames.includes(item));

    const payload = {
      ...protocolForm,
      code: protocolForm.code.trim(),
      name: protocolForm.name.trim(),
      description: protocolForm.description.trim(),
      trigger: protocolForm.trigger.trim(),
      responsible: protocolForm.responsible.trim(),
      priority: protocolForm.priority.trim(),
      type: protocolForm.type.trim(),
      communicationRules: protocolForm.communicationRules.trim(),
      closingCriteria: protocolForm.closingCriteria.trim(),
      recommendations: protocolForm.recommendations.trim(),
      areas: protocolForm.areas.map((item) => item.trim()).filter(Boolean),
      textSteps: protocolForm.textSteps.map((step) => step.trim()).filter(Boolean),
      visibleForRoles: sanitizedVisibleRoles.length ? sanitizedVisibleRoles : availableRoleNames.slice(0, 1)
    };

    if (payload.description.length < 8) {
      setProtocolFormError('La descripción debe tener al menos 8 caracteres.');
      return;
    }

    if (payload.trigger.length < 5) {
      setProtocolFormError('La situación detonante debe tener al menos 5 caracteres.');
      return;
    }

    if (payload.textSteps.some((item) => item.length < 5)) {
      setProtocolFormError('Cada paso operativo debe tener al menos 5 caracteres.');
      return;
    }

    if (editingProtocolId) {
      await onUpdateProtocol(editingProtocolId, payload);
    } else {
      await onCreateProtocol(payload);
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
      isActive: Boolean(user.isActive),
      branchName: user.branchName || ''
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
    if (editingProtocolId === protocol.id) resetProtocolForm();
  };

  const removeUser = async (user) => {
    const approved = window.confirm(`Eliminar perfil de ${user.fullName}?`);
    if (!approved) return;
    await onDeleteUser(user.id);
    if (editingUserId === user.id) resetUserForm();
  };

  const removeCategory = async (category) => {
    const approved = window.confirm(`Eliminar categoria ${category.name}?`);
    if (!approved) return;
    await onDeleteCategory(category.id);
    if (editingCategoryId === category.id) resetCategoryForm();
  };

  const NAV_ITEMS = isAdmin
    ? [
        { key: 'protocols',  label: 'Protocolos', Icon: FolderKanban, count: protocols.length },
        { key: 'protocolIncidents', label: 'Incidencias', Icon: ClipboardList, count: null },
        { key: 'users',      label: 'Perfiles',   Icon: Users,        count: users.length },
        { key: 'employees',  label: 'Colaboradores',  Icon: UserCheck,    count: employees?.length || 0 },
        { key: 'categories', label: 'Categorías', Icon: Tags,         count: categories.length },
        { key: 'roles',      label: 'Roles',      Icon: KeyRound,     count: roles.length },
      ]
    : [
        { key: 'employees', label: 'Colaboradores', Icon: UserCheck, count: employees?.length || 0 },
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
            <ShieldPlus size={20} /> {editingRoleName ? 'Editar rol' : 'Crear rol'}
          </h3>
          <form onSubmit={submitRole} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input required minLength={3} maxLength={80} value={roleForm.name} onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nombre del rol" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
              <input required minLength={3} maxLength={300} value={roleForm.description} onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descripcion" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
              <div className="flex items-center gap-2">
                <button className="bg-cyan-600 text-white rounded-lg font-semibold px-4 py-2.5 flex-1">
                  {editingRoleName ? 'Guardar cambios' : 'Guardar rol'}
                </button>
                {editingRoleName ? (
                  <button type="button" onClick={cancelEditRole} className="bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold px-4 py-2.5">
                    Cancelar
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-4 border border-cyan-100 rounded-xl overflow-hidden">
              <div className="bg-cyan-50/50 px-4 py-2 border-b border-cyan-100">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-800">Permisos del Rol (Protocolos y Categorías)</p>
              </div>
              <div className="p-4 bg-white space-y-3">
                {categories.map((cat) => {
                  const catProtocols = protocols.filter(p => p.type === cat.name);
                  const isCatSelected = roleForm.permissions.categoryIds.includes(cat.numericId);
                  
                  return (
                    <div key={cat.id} className="border border-slate-100 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded border-cyan-300 text-cyan-600 focus:ring-cyan-500"
                            checked={isCatSelected} 
                            onChange={() => {
                              const nextCatIds = isCatSelected 
                                ? roleForm.permissions.categoryIds.filter(id => id !== cat.numericId)
                                : [...roleForm.permissions.categoryIds, cat.numericId];
                              
                              // Si marcamos categoría, limpiamos protocolos individuales de esa categoría para evitar redundancia
                              const nextProtoIds = isCatSelected 
                                ? roleForm.permissions.protocolIds 
                                : roleForm.permissions.protocolIds.filter(pid => !catProtocols.some(cp => cp.numericId === pid));

                              setRoleForm(prev => ({
                                ...prev,
                                permissions: { categoryIds: nextCatIds, protocolIds: nextProtoIds }
                              }));
                            }} 
                          />
                          <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">{catProtocols.length}</span>
                        </label>
                        <p className="text-[10px] text-slate-400 italic">
                          {isCatSelected ? 'Acceso total concedido' : 'Selección granular'}
                        </p>
                      </div>

                      <div className={`p-3 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ${isCatSelected ? 'opacity-50' : ''}`}>
                        {catProtocols.map((proto) => {
                          const isProtoSelected = isCatSelected || roleForm.permissions.protocolIds.includes(proto.numericId);
                          return (
                            <label key={proto.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-50 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded border-cyan-200 text-cyan-600 focus:ring-cyan-500 disabled:opacity-50"
                                disabled={isCatSelected}
                                checked={isProtoSelected}
                                onChange={() => {
                                  if (isCatSelected) return;
                                  const exists = roleForm.permissions.protocolIds.includes(proto.numericId);
                                  const nextProtoIds = exists 
                                    ? roleForm.permissions.protocolIds.filter(id => id !== proto.numericId)
                                    : [...roleForm.permissions.protocolIds, proto.numericId];
                                  
                                  setRoleForm(prev => ({
                                    ...prev,
                                    permissions: { ...prev.permissions, protocolIds: nextProtoIds }
                                  }));
                                }}
                              />
                              <span className="text-xs text-slate-700 truncate" title={proto.name}>
                                <span className="font-mono text-[10px] text-cyan-600 mr-1">{proto.code}</span>
                                {proto.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
          {roleFormError ? <p className="mt-2 text-sm text-rose-700">{roleFormError}</p> : null}
          <div className="mt-5 border-t border-cyan-100 pt-4">
            <p className="text-sm font-semibold text-cyan-800 mb-2">Roles actuales</p>
            <div className="relative mb-3">
              <input
                type="text"
                value={roleSearch}
                onChange={(e) => { setRoleSearch(e.target.value); setRolePage(0); }}
                placeholder="Buscar rol por nombre o descripción..."
                className="w-full pl-9 pr-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            {(() => {
              const q = roleSearch.toLowerCase().trim();
              const filteredRoles = roles.filter((role) =>
                !q ||
                role.name?.toLowerCase().includes(q) ||
                role.description?.toLowerCase().includes(q)
              );
              const paginatedRoles = filteredRoles.slice(rolePage * ROLE_PAGE_SIZE, (rolePage + 1) * ROLE_PAGE_SIZE);

              if (filteredRoles.length === 0) {
                return <p className="text-sm text-slate-400 text-center py-6">Sin roles para mostrar.</p>;
              }

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {paginatedRoles.map((role) => (
                      <div key={`role-chip-${role.name}`} className="inline-flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-800 text-sm">
                        <div>
                          <p className="font-semibold">{role.name}</p>
                          <p className="text-xs text-cyan-700">{role.description || 'Sin descripción'}</p>
                          {(() => {
                            const assignedUsersCount = users.filter((user) => user.roles?.includes(role.name)).length;
                            const categoriesCount = role.permissions?.categoryIds?.length || 0;
                            const protocolsCount = role.permissions?.protocolIds?.length || 0;
                            const isEmptyRole = assignedUsersCount === 0 && categoriesCount === 0 && protocolsCount === 0;

                            if (isEmptyRole) {
                              return <p className="text-[11px] text-emerald-700 mt-1">Rol vacío. Se puede eliminar.</p>;
                            }

                            return (
                              <p className="text-[11px] text-amber-700 mt-1">
                                No vacío: usuarios {assignedUsersCount}, categorías {categoriesCount}, protocolos {protocolsCount}
                              </p>
                            );
                          })()}
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => startEditRole(role)} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900">
                            <Pencil size={13} /> Editar
                          </button>
                          {(() => {
                            const assignedUsersCount = users.filter((user) => user.roles?.includes(role.name)).length;
                            const categoriesCount = role.permissions?.categoryIds?.length || 0;
                            const protocolsCount = role.permissions?.protocolIds?.length || 0;
                            const canDelete = assignedUsersCount === 0 && categoriesCount === 0 && protocolsCount === 0;

                            return (
                              <button
                                type="button"
                                onClick={() => removeRole(role)}
                                disabled={!canDelete}
                                title={canDelete ? 'Eliminar rol' : 'Solo se pueden eliminar roles vacíos'}
                                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                                  canDelete
                                    ? 'text-rose-700 hover:text-rose-900'
                                    : 'text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                <Trash2 size={13} /> Eliminar
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredRoles.length > ROLE_PAGE_SIZE ? (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-100">
                      <button
                        type="button"
                        disabled={rolePage === 0}
                        onClick={() => setRolePage((p) => p - 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
                      >
                        <ChevronLeft size={15} /> Anterior
                      </button>
                      <span className="text-xs text-slate-500">Página {rolePage + 1} de {Math.ceil(filteredRoles.length / ROLE_PAGE_SIZE)} · {filteredRoles.length} roles</span>
                      <button
                        type="button"
                        disabled={(rolePage + 1) * ROLE_PAGE_SIZE >= filteredRoles.length}
                        onClick={() => setRolePage((p) => p + 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
                      >
                        Siguiente <ChevronRight size={15} />
                      </button>
                    </div>
                  ) : null}
                </>
              );
            })()}
          </div>
        </section>
      ) : null}

      {activeSection === 'categories' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-cyan-900 text-xl mb-4 flex items-center gap-2">
            <Tags size={20} /> Gestion de categorias
          </h3>
          <form onSubmit={submitCategory} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input required minLength={3} maxLength={120} value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })} placeholder="Nombre de categoria" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
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
          {categoryFormError ? <p className="mt-2 text-sm text-rose-700">{categoryFormError}</p> : null}

          <div className="mt-5 border-t border-cyan-100 pt-4">
            <div className="relative mb-3">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => { setCategorySearch(e.target.value); setCategoryPage(0); }}
                placeholder="Buscar categoría..."
                className="w-full pl-9 pr-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>

            {(() => {
              const q = categorySearch.toLowerCase().trim();
              const filteredCategories = categories.filter((category) =>
                !q ||
                category.name?.toLowerCase().includes(q)
              );
              const paginatedCategories = filteredCategories.slice(categoryPage * CATEGORY_PAGE_SIZE, (categoryPage + 1) * CATEGORY_PAGE_SIZE);

              if (filteredCategories.length === 0) {
                return <p className="text-sm text-slate-400 text-center py-6">Sin categorías para mostrar.</p>;
              }

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {paginatedCategories.map((category) => (
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

                  {filteredCategories.length > CATEGORY_PAGE_SIZE ? (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-100">
                      <button
                        type="button"
                        disabled={categoryPage === 0}
                        onClick={() => setCategoryPage((p) => p - 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
                      >
                        <ChevronLeft size={15} /> Anterior
                      </button>
                      <span className="text-xs text-slate-500">Página {categoryPage + 1} de {Math.ceil(filteredCategories.length / CATEGORY_PAGE_SIZE)} · {filteredCategories.length} categorías</span>
                      <button
                        type="button"
                        disabled={(categoryPage + 1) * CATEGORY_PAGE_SIZE >= filteredCategories.length}
                        onClick={() => setCategoryPage((p) => p + 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
                      >
                        Siguiente <ChevronRight size={15} />
                      </button>
                    </div>
                  ) : null}
                </>
              );
            })()}
          </div>
        </section>
      ) : null}

      {activeSection === 'users' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-cyan-900 text-xl mb-4 flex items-center gap-2">
            <UserPlus size={20} /> {editingUserId ? 'Editar perfil' : 'Crear perfil'}
          </h3>
          <form onSubmit={submitUser} className="space-y-3">
            {userForm.roleNames.includes('sucursal') ? (
              <div>
                <label className="block text-sm font-semibold text-cyan-800 mb-1">Nombre de sucursal <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  minLength={2}
                  maxLength={120}
                  required
                  value={userForm.branchName}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, branchName: e.target.value, fullName: e.target.value }))}
                  placeholder="Ej. Sucursal Centro, Sucursal Norte..."
                  className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm"
                />
              </div>
            ) : (
              <input required minLength={3} maxLength={160} value={userForm.fullName} onChange={(e) => setUserForm((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Nombre completo" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input required type="email" autoComplete="email" value={userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Correo" className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
              <input type="password" minLength={editingUserId ? 0 : 6} autoComplete="new-password" value={userForm.password} onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))} placeholder={editingUserId ? 'Nueva contrasena (opcional)' : 'Contrasena'} className="px-3 py-2.5 border border-cyan-200 rounded-lg" />
            </div>
            {userFormError ? <p className="text-sm text-rose-700">{userFormError}</p> : null}
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
            <div className="relative mb-3">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setUserPage(0); }}
                placeholder="Buscar usuario por nombre, correo o rol..."
                className="w-full pl-9 pr-3 py-2.5 border border-cyan-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>

            {(() => {
              const q = userSearch.toLowerCase().trim();
              const filteredUsers = users.filter((user) =>
                !q ||
                user.fullName?.toLowerCase().includes(q) ||
                user.email?.toLowerCase().includes(q) ||
                user.roles?.join(' ').toLowerCase().includes(q)
              );
              const paginatedUsers = filteredUsers.slice(userPage * USER_PAGE_SIZE, (userPage + 1) * USER_PAGE_SIZE);

              if (filteredUsers.length === 0) {
                return <p className="text-sm text-slate-400 text-center py-6">Sin usuarios para mostrar.</p>;
              }

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {paginatedUsers.map((user) => (
                      <div key={user.email} className="rounded-lg border border-slate-200 px-3 py-2 bg-slate-50">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-800">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                            <p className="text-xs text-cyan-700">Roles: {user.roles.join(', ')}</p>
                            {user.branchName && (
                              <p className="text-xs text-emerald-700 mt-0.5">Sucursal: {user.branchName}</p>
                            )}
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

                  {filteredUsers.length > USER_PAGE_SIZE ? (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-100">
                      <button
                        type="button"
                        disabled={userPage === 0}
                        onClick={() => setUserPage((p) => p - 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
                      >
                        <ChevronLeft size={15} /> Anterior
                      </button>
                      <span className="text-xs text-slate-500">Página {userPage + 1} de {Math.ceil(filteredUsers.length / USER_PAGE_SIZE)} · {filteredUsers.length} usuarios</span>
                      <button
                        type="button"
                        disabled={(userPage + 1) * USER_PAGE_SIZE >= filteredUsers.length}
                        onClick={() => setUserPage((p) => p + 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-40 hover:bg-cyan-50"
                      >
                        Siguiente <ChevronRight size={15} />
                      </button>
                    </div>
                  ) : null}
                </>
              );
            })()}
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

      {activeSection === 'protocolIncidents' ? <ProtocolIncidentsPanel token={token} /> : null}

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
                  {protocolFormError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
                      {protocolFormError}
                    </div>
                  ) : null}

                  {/* Fila 1: Código, Nombre, Categoría */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Código</label>
                      <input value={protocolForm.code} onChange={(e) => setProtocolField('code', e.target.value.toUpperCase())} placeholder="Ej. E-01, H-03, F-12" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-400">Sugerido por categoría: {suggestedProtocolCode}</p>
                        <button
                          type="button"
                          onClick={() => setProtocolField('code', suggestedProtocolCode)}
                          className="text-xs font-semibold text-cyan-700 hover:text-cyan-900"
                        >
                          Usar sugerencia
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Nombre del protocolo</label>
                      <input required minLength={3} value={protocolForm.name} onChange={(e) => setProtocolField('name', e.target.value)} placeholder="Ej. Apertura de caja" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
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
                      <textarea required minLength={8} value={protocolForm.description} onChange={(e) => setProtocolField('description', e.target.value)} placeholder="Objetivo del protocolo" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Situación detonante</label>
                      <textarea required minLength={5} value={protocolForm.trigger} onChange={(e) => setProtocolField('trigger', e.target.value)} placeholder="¿Qué activa este protocolo?" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                  </div>

                  {/* Responsable, prioridad */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Responsable</label>
                      <input required minLength={3} value={protocolForm.responsible} onChange={(e) => setProtocolField('responsible', e.target.value)} placeholder="Área o rol" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
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
                          <input required minLength={2} value={area} onChange={(e) => setProtocolAreaAt(index, e.target.value)} placeholder={`Área ${index + 1}`} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
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
                            minLength={5}
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
                      <textarea required minLength={5} value={protocolForm.communicationRules} onChange={(e) => setProtocolField('communicationRules', e.target.value)} placeholder="A quién y cómo se reporta" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Criterios de cierre</label>
                      <textarea required minLength={5} value={protocolForm.closingCriteria} onChange={(e) => setProtocolField('closingCriteria', e.target.value)} placeholder="Cuándo se da por terminado" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Recomendaciones</label>
                      <textarea required minLength={5} value={protocolForm.recommendations} onChange={(e) => setProtocolField('recommendations', e.target.value)} placeholder="Buenas prácticas y advertencias" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm" />
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

      {/* ── Sección Colaboradores ───────────────────────────────────────────── */}
      {activeSection === 'employees' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h3 className="font-heading font-semibold text-cyan-900 text-xl flex items-center gap-2">
              <Users size={20} /> Colaboradores
            </h3>
            <button
              type="button"
              onClick={() => { resetEmployeeForm(); setShowEmployeeModal(true); }}
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors"
            >
              <PlusCircle size={16} /> Nuevo colaborador
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
                  {(employees || []).length === 0 ? 'No hay colaboradores registrados.' : 'Sin resultados para esa búsqueda.'}
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
                            {[emp.position, emp.hireDate ? `Ingreso: ${emp.hireDate}` : null].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setViewingEmployee(emp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                            title="Ver detalle"
                          >
                            <Eye size={14} />
                          </button>
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
                      Página {employeePage + 1} de {Math.ceil(filtered.length / EMPLOYEE_PAGE_SIZE)} · {filtered.length} colaboradores
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

      {/* ── Modal colaborador ───────────────────────────────────────────────── */}
      {showEmployeeModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) resetEmployeeForm(); }}
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-100 shrink-0">
              <h2 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
                {editingEmployeeId ? <Pencil size={18} /> : <PlusCircle size={18} />}
                {editingEmployeeId ? 'Editar colaborador' : 'Nuevo colaborador'}
              </h2>
              <button type="button" onClick={resetEmployeeForm} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5">
              <form id="employee-modal-form" onSubmit={submitEmployee} className="space-y-4">
                {/* Vista previa del código */}
                {!editingEmployeeId && employeeForm.fullName.trim().length >= 1 && (
                  <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-xl px-3 py-2.5">
                    <span className="text-xs text-cyan-600 font-semibold uppercase tracking-wide">Código que se generará:</span>
                    <span className="font-mono text-sm font-bold text-cyan-800">
                      TB-{employeeForm.fullName.trim().split(/\s+/).slice(0, 3).map((w) => w[0]?.toUpperCase() ?? '').join('')}-###
                    </span>
                    <span className="text-xs text-slate-400">(el número se asigna al guardar)</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Código (solo visible en edición) */}
                  {editingEmployeeId && (
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Código de colaborador</label>
                      <input
                        value={employeeForm.employeeCode}
                        readOnly
                        className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm bg-slate-50 text-cyan-700 font-mono font-bold"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Nombre completo *</label>
                    <input
                      required
                      minLength={3}
                      value={employeeForm.fullName}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="Nombre completo del colaborador"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Puesto</label>
                    <input
                      value={employeeForm.position}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, position: e.target.value }))}
                      placeholder="Ej. Cajero, Encargado de tienda"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Correo electrónico</label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Teléfono</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="\d{10}"
                      maxLength={10}
                      value={employeeForm.phone}
                      onChange={(e) => setEmployeeForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="10 dígitos"
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                    <p className="text-xs text-slate-400">Ejemplo: 5512345678</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Fecha de ingreso</label>
                    <DatePicker
                      value={employeeForm.hireDate}
                      onChange={(v) => setEmployeeForm((p) => ({ ...p, hireDate: v }))}
                      max={new Date().toISOString().slice(0, 10)}
                      placeholder="¿Cuándo ingresó a la empresa?"
                    />
                  </div>
                </div>
                {employeeFormError ? <p className="text-sm text-rose-700">{employeeFormError}</p> : null}

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
                  Colaborador activo (puede enviar reportes)
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
                {editingEmployeeId ? 'Guardar cambios' : 'Registrar colaborador'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal detalle colaborador (solo lectura) ────────────────────────── */}
      {viewingEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm py-6 px-3 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setViewingEmployee(null); }}
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-100">
              <h2 className="font-heading font-bold text-cyan-900 text-lg flex items-center gap-2">
                <Eye size={18} /> Detalle del colaborador
              </h2>
              <button type="button" onClick={() => setViewingEmployee(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Encabezado: código + estado */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-base font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1.5 rounded-xl">
                  {viewingEmployee.employeeCode}
                </span>
                {viewingEmployee.isActive ? (
                  <span className="text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full">Activo</span>
                ) : (
                  <span className="text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-600 px-2.5 py-1 rounded-full">Inactivo</span>
                )}
              </div>

              {/* Campos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre completo</p>
                  <p className="text-sm font-semibold text-slate-800">{viewingEmployee.fullName || '—'}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Puesto</p>
                  <p className="text-sm text-slate-700">{viewingEmployee.position || '—'}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Correo electrónico</p>
                  <p className="text-sm text-slate-700 break-all">{viewingEmployee.email || '—'}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Teléfono</p>
                  <p className="text-sm text-slate-700">{viewingEmployee.phone || '—'}</p>
                </div>
                <div className="space-y-0.5 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fecha de ingreso</p>
                  <p className="text-sm text-slate-700">{viewingEmployee.hireDate || '—'}</p>
                </div>
                {viewingEmployee.notes && (
                  <div className="space-y-0.5 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notas / Observaciones</p>
                    <p className="text-sm text-slate-700 whitespace-pre-line">{viewingEmployee.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-cyan-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 rounded-xl border border-cyan-200 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors"
              >
                Cerrar
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