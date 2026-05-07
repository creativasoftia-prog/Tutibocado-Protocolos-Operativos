import React from 'react';
import {
  PlusCircle,
  UserPlus,
  ShieldPlus,
  RefreshCcw,
  LayoutGrid,
  FolderKanban,
  Users,
  KeyRound,
  Tags,
  Pencil,
  Trash2,
  XCircle
} from 'lucide-react';

const emptyProtocol = {
  code: '',
  name: '',
  description: '',
  trigger: '',
  responsible: '',
  areas: ['Operaciones'],
  priority: 'Media',
  type: 'Operativo',
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
  onDeleteCategory
}) {
  const [activeSection, setActiveSection] = React.useState('overview');

  const [protocolForm, setProtocolForm] = React.useState(emptyProtocol);
  const [editingProtocolId, setEditingProtocolId] = React.useState('');

  const [roleForm, setRoleForm] = React.useState(emptyRole);

  const [userForm, setUserForm] = React.useState(emptyUser);
  const [editingUserId, setEditingUserId] = React.useState(null);

  const [categoryForm, setCategoryForm] = React.useState(emptyCategory);
  const [editingCategoryId, setEditingCategoryId] = React.useState('');

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
  };

  const resetUserForm = () => {
    setUserForm(emptyUser);
    setEditingUserId(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategory);
    setEditingCategoryId('');
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

    resetProtocolForm();
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
      textSteps: protocol.textSteps?.length ? protocol.textSteps : [''],
      communicationRules: protocol.communicationRules || '',
      closingCriteria: protocol.closingCriteria || '',
      recommendations: protocol.recommendations || '',
      visibleForRoles: protocol.visibleForRoles?.length ? protocol.visibleForRoles : ['sucursal']
    });
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

  return (
    <div className="space-y-6">
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

      <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          <button className={sectionButtonClass(activeSection === 'overview')} onClick={() => setActiveSection('overview')}>
            <LayoutGrid size={16} /> Resumen
          </button>
          <button className={sectionButtonClass(activeSection === 'roles')} onClick={() => setActiveSection('roles')}>
            <KeyRound size={16} /> Roles
          </button>
          <button className={sectionButtonClass(activeSection === 'users')} onClick={() => setActiveSection('users')}>
            <Users size={16} /> Perfiles
          </button>
          <button className={sectionButtonClass(activeSection === 'categories')} onClick={() => setActiveSection('categories')}>
            <Tags size={16} /> Categorias
          </button>
          <button className={sectionButtonClass(activeSection === 'protocols')} onClick={() => setActiveSection('protocols')}>
            <FolderKanban size={16} /> Protocolos
          </button>
        </div>
      </section>

      {activeSection === 'overview' ? (
        <section className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-cyan-900 text-xl mb-2">Flujo automatizado con libertad de edicion</h3>
          <p className="text-cyan-700 text-sm mb-4">Puedes crear, editar o eliminar cada entidad en su modulo. Las relaciones entre categorias y protocolos se mantienen automaticamente.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4">
              <p className="font-semibold text-cyan-900 mb-1">Categorias flexibles</p>
              <p className="text-sm text-cyan-700">Renombra o crea nuevas categorias y usalas al editar protocolos.</p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4">
              <p className="font-semibold text-cyan-900 mb-1">Usuarios editables</p>
              <p className="text-sm text-cyan-700">Actualiza nombre, correo, estado, contrasena y roles en cualquier momento.</p>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4">
              <p className="font-semibold text-cyan-900 mb-1">Protocolos vivos</p>
              <p className="text-sm text-cyan-700">Edita contenido, pasos y visibilidad por rol sin rigidez.</p>
            </div>
          </div>
        </section>
      ) : null}

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
          <h3 className="font-heading font-semibold text-cyan-900 text-xl mb-4 flex items-center gap-2">
            <PlusCircle size={20} /> {editingProtocolId ? 'Editar protocolo' : 'Herramienta para crear protocolos'}
          </h3>

          <form onSubmit={submitProtocol} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Codigo</label>
                <input required value={protocolForm.code} onChange={(e) => setProtocolField('code', e.target.value)} placeholder="Ej. E-01" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Nombre del protocolo</label>
                <input required value={protocolForm.name} onChange={(e) => setProtocolField('name', e.target.value)} placeholder="Ej. Apertura de caja" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Categoria o tipo</label>
                <select
                  required
                  value={protocolForm.type}
                  onChange={(e) => setProtocolField('type', e.target.value)}
                  className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg"
                >
                  {categories.length === 0 ? <option value="">No hay categorias creadas</option> : null}
                  {protocolForm.type && !categories.some((category) => category.name === protocolForm.type) ? (
                    <option value={protocolForm.type}>{protocolForm.type}</option>
                  ) : null}
                  {categories.map((category) => (
                    <option key={`type-${category.id}`} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-cyan-700">Selecciona una categoria existente. Si falta una, creala en la seccion Categorias.</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Descripcion</label>
              <textarea required value={protocolForm.description} onChange={(e) => setProtocolField('description', e.target.value)} placeholder="Describe el objetivo del protocolo" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Situacion detonante</label>
              <textarea required value={protocolForm.trigger} onChange={(e) => setProtocolField('trigger', e.target.value)} placeholder="Que evento activa este protocolo" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Responsable</label>
                <input required value={protocolForm.responsible} onChange={(e) => setProtocolField('responsible', e.target.value)} placeholder="Area o rol responsable" className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Prioridad</label>
                <select value={protocolForm.priority} onChange={(e) => setProtocolField('priority', e.target.value)} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg">
                  <option>Baja</option>
                  <option>Media</option>
                  <option>Alta</option>
                  <option>Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-cyan-800 mb-2">Areas notificadas (una o muchas)</p>
              <div className="space-y-2">
                {protocolForm.areas.map((area, index) => (
                  <div key={`area-${index}`} className="flex items-center gap-2">
                    <input
                      required
                      value={area}
                      onChange={(e) => setProtocolAreaAt(index, e.target.value)}
                      placeholder={`Area ${index + 1}`}
                      className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeProtocolArea(index)}
                      className="px-2.5 py-2 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addProtocolArea} className="mt-2 text-sm font-semibold text-cyan-700">
                + Agregar area
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-cyan-800 mb-2">Pasos del protocolo</p>
              <div className="space-y-2">
                {protocolForm.textSteps.map((step, index) => (
                  <input
                    key={`step-${index}`}
                    required
                    value={step}
                    onChange={(e) => {
                      const next = [...protocolForm.textSteps];
                      next[index] = e.target.value;
                      setProtocolField('textSteps', next);
                    }}
                    placeholder={`Paso ${index + 1}`}
                    className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg"
                  />
                ))}
              </div>
              <button type="button" onClick={() => setProtocolField('textSteps', [...protocolForm.textSteps, ''])} className="mt-2 text-sm font-semibold text-cyan-700">
                + Agregar paso
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Reglas de comunicacion</label>
              <textarea required value={protocolForm.communicationRules} onChange={(e) => setProtocolField('communicationRules', e.target.value)} placeholder="Como se comunica y a quien se reporta" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Criterios de cierre</label>
              <textarea required value={protocolForm.closingCriteria} onChange={(e) => setProtocolField('closingCriteria', e.target.value)} placeholder="Cuando se considera finalizado" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Recomendaciones</label>
              <textarea required value={protocolForm.recommendations} onChange={(e) => setProtocolField('recommendations', e.target.value)} placeholder="Buenas practicas y advertencias" rows={2} className="w-full px-3 py-2.5 border border-cyan-200 rounded-lg" />
            </div>

            <div>
              <p className="text-sm font-semibold text-cyan-800 mb-2">Visible para roles</p>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <label key={`protocol-role-${role.name}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-800 text-sm">
                    <input type="checkbox" checked={protocolForm.visibleForRoles.includes(role.name)} onChange={() => toggleRoleValue(role.name, 'protocol')} />
                    {role.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="bg-cyan-600 text-white rounded-lg font-semibold px-4 py-2.5">
                {editingProtocolId ? 'Guardar cambios' : 'Guardar protocolo'}
              </button>
              {editingProtocolId ? (
                <button type="button" onClick={resetProtocolForm} className="bg-white text-slate-700 rounded-lg border border-slate-200 font-semibold px-4 py-2.5 inline-flex items-center gap-1">
                  <XCircle size={14} /> Cancelar edicion
                </button>
              ) : null}
            </div>
          </form>

          <div className="mt-5 border-t border-cyan-100 pt-4">
            <p className="text-sm font-semibold text-cyan-800 mb-2">Protocolos existentes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {protocols.map((protocol) => (
                <div key={protocol.id} className="rounded-lg border border-slate-200 px-3 py-2 bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{protocol.code} - {protocol.name}</p>
                      <p className="text-xs text-slate-500">Categoria: {protocol.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => startEditProtocol(protocol)} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900">
                        <Pencil size={14} /> Editar
                      </button>
                      <button type="button" onClick={() => removeProtocol(protocol)} className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900">
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
    </div>
  );
}
