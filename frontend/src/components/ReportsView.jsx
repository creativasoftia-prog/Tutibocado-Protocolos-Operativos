import { useEffect, useState } from 'react';
import { Package, ClipboardCheck } from 'lucide-react';
import StockReportsPanel from './operations/StockReportsPanel';
import OperationalReportsPanel from './operations/OperationalReportsPanel';

const TABS = [
  { key: 'existencias', label: 'Existencias', Icon: Package },
  { key: 'operativos', label: 'Reportes Operativos', Icon: ClipboardCheck },
];

export default function ReportsView({ token, isAdmin = false, initialTab = 'existencias' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (TABS.some((tab) => tab.key === initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-cyan-900">Reportes de Sucursales</h2>
        <p className="text-sm text-cyan-700 mt-0.5">
          {isAdmin ? 'Consulta y gestiona los reportes enviados por las sucursales.' : 'Consulta los reportes enviados por las sucursales.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-cyan-100 pb-3">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white text-cyan-700 border border-cyan-200 hover:bg-cyan-50'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'existencias' && (
        <StockReportsPanel token={token} isAdmin={isAdmin} />
      )}
      {activeTab === 'operativos' && (
        <OperationalReportsPanel token={token} isAdmin={isAdmin} />
      )}
    </div>
  );
}
