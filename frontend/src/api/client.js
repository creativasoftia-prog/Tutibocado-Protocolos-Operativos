const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4100/api';

const request = async (path, { method = 'GET', token, body } = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const fieldErrors = data?.errors?.fieldErrors || {};
    const firstFieldError = Object.values(fieldErrors).find((items) => Array.isArray(items) && items.length > 0);
    const detail = firstFieldError ? firstFieldError[0] : '';
    const message = detail ? `${data.message || 'Request failed'}: ${detail}` : (data.message || 'Request failed');
    throw new Error(message);
  }

  return data;
};

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),
  listUsers: (token) => request('/auth/users', { token }),
  createUser: (token, payload) => request('/auth/users', { method: 'POST', token, body: payload }),
  updateUser: (token, userId, payload) => request(`/auth/users/${userId}`, { method: 'PUT', token, body: payload }),
  deleteUser: (token, userId) => request(`/auth/users/${userId}`, { method: 'DELETE', token }),
  listRoles: (token) => request('/roles', { token }),
  createRole: (token, payload) => request('/roles', { method: 'POST', token, body: payload }),
  updateRole: (token, roleName, payload) => request(`/roles/${encodeURIComponent(roleName)}`, { method: 'PUT', token, body: payload }),
  deleteRole: (token, roleName) => request(`/roles/${encodeURIComponent(roleName)}`, { method: 'DELETE', token }),
  listProtocols: (token) => request('/protocols', { token }),
  createProtocol: (token, payload) => request('/protocols', { method: 'POST', token, body: payload }),
  updateProtocol: (token, protocolId, payload) => request(`/protocols/${protocolId}`, { method: 'PUT', token, body: payload }),
  deleteProtocol: (token, protocolId) => request(`/protocols/${protocolId}`, { method: 'DELETE', token }),
  listCategories: (token) => request('/protocols/categories/list', { token }),
  createCategory: (token, payload) => request('/protocols/categories', { method: 'POST', token, body: payload }),
  updateCategory: (token, categoryId, payload) => request(`/protocols/categories/${categoryId}`, { method: 'PUT', token, body: payload }),
  deleteCategory: (token, categoryId) => request(`/protocols/categories/${categoryId}`, { method: 'DELETE', token }),

  // ── Colaboradores ─────────────────────────────────────────────────────────
  listEmployees: (token) => request('/employees', { token }),
  createEmployee: (token, payload) => request('/employees', { method: 'POST', token, body: payload }),
  updateEmployee: (token, employeeId, payload) => request(`/employees/${employeeId}`, { method: 'PUT', token, body: payload }),
  deleteEmployee: (token, employeeId) => request(`/employees/${employeeId}`, { method: 'DELETE', token }),
  validateEmployee: (token, code) => request(`/employees/validate/${encodeURIComponent(code)}`, { token }),

  // ── Reportes RH ────────────────────────────────────────────────────────────
  listHrReports: (token, { status, employeeId } = {}) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (employeeId) params.set('employeeId', employeeId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/hr-reports${qs}`, { token });
  },
  getHrReport: (token, id) => request(`/hr-reports/${id}`, { token }),
  createHrReport: (token, payload) => request('/hr-reports', { method: 'POST', token, body: payload }),
  updateHrReportStatus: (token, id, payload) => request(`/hr-reports/${id}/status`, { method: 'PATCH', token, body: payload }),
  deleteHrReport: (token, id) => request(`/hr-reports/${id}`, { method: 'DELETE', token }),

  // ── Incidencias de protocolos ─────────────────────────────────────────────
  createProtocolIncident: (token, payload) => request('/protocol-incidents', { method: 'POST', token, body: payload }),
  listProtocolIncidents: (token, { status, entryType, protocolId, employeeId } = {}) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (entryType) params.set('entryType', entryType);
    if (protocolId) params.set('protocolId', protocolId);
    if (employeeId) params.set('employeeId', employeeId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/protocol-incidents${qs}`, { token });
  },
  getProtocolIncidentsSummary: (token) => request('/protocol-incidents/summary', { token }),
  updateProtocolIncidentStatus: (token, id, payload) => request(`/protocol-incidents/${id}/status`, { method: 'PATCH', token, body: payload }),

  // ── Notificaciones ─────────────────────────────────────────────────────────
  listNotifications: (token) => request('/notifications', { token }),
  getUnreadCount: (token) => request('/notifications/unread-count', { token }),
  markNotificationRead: (token, id) => request(`/notifications/${id}/read`, { method: 'PATCH', token }),
  markAllNotificationsRead: (token) => request('/notifications/read-all', { method: 'PATCH', token }),

  // ── Mis reportes (sucursal) ────────────────────────────────────────────────
  getMyReports: (token) => request('/hr-reports/my', { token }),

  // ── Existencias ────────────────────────────────────────────────────────────
  listStockTypes: (token, onlyActive) => request(`/stock-reports/types${onlyActive ? '?onlyActive=true' : ''}`, { token }),
  createStockType: (token, payload) => request('/stock-reports/types', { method: 'POST', token, body: payload }),
  updateStockType: (token, id, payload) => request(`/stock-reports/types/${id}`, { method: 'PUT', token, body: payload }),
  deleteStockType: (token, id) => request(`/stock-reports/types/${id}`, { method: 'DELETE', token }),
  listStockReports: (token) => request('/stock-reports', { token }),
  getMyStockReports: (token) => request('/stock-reports/my', { token }),
  createStockReport: (token, payload) => request('/stock-reports', { method: 'POST', token, body: payload }),
  deleteStockReport: (token, id) => request(`/stock-reports/${id}`, { method: 'DELETE', token }),

  // ── Reportes Operativos ────────────────────────────────────────────────────
  listOperationalReports: (token, formType) => request(`/operational-reports${formType ? `?formType=${formType}` : ''}`, { token }),
  getMyOperationalReports: (token) => request('/operational-reports/my', { token }),
  createOperationalReport: (token, payload) => request('/operational-reports', { method: 'POST', token, body: payload }),
  deleteOperationalReport: (token, id) => request(`/operational-reports/${id}`, { method: 'DELETE', token }),
};
