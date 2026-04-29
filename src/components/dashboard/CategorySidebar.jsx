import React from 'react';
import {
  Filter,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Package,
  ShieldAlert,
  MonitorX,
  Users,
  Scale,
  FileText,
  Truck,
  MessageSquare,
  ShoppingBag,
  Megaphone,
  Wrench
} from 'lucide-react';

const getSidebarIcon = (type, isActive = false) => {
  const iconClass = isActive ? 'text-white' : 'text-cyan-700';

  switch (type) {
    case 'Todos': return <Filter className={iconClass} size={18} />;
    case 'Infraestructura': return <Zap className={iconClass} size={18} />;
    case 'Operativo': return <Package className={iconClass} size={18} />;
    case 'Insumos y consumibles': return <ShoppingBag className={iconClass} size={18} />;
    case 'Logística': return <Truck className={iconClass} size={18} />;
    case 'Atención al Cliente': return <MessageSquare className={iconClass} size={18} />;
    case 'Tecnología/Soporte': return <MonitorX className={iconClass} size={18} />;
    case 'Capital Humano':
    case 'Recursos Humanos': return <Users className={iconClass} size={18} />;
    case 'Sanidad': return <ShieldCheck className={iconClass} size={18} />;
    case 'Visitas de Dependencias Gubernamentales':
    case 'Asuntos Gubernamentales': return <Scale className={iconClass} size={18} />;
    case 'Finanzas': return <FileText className={iconClass} size={18} />;
    case 'Seguridad': return <ShieldAlert className={iconClass} size={18} />;
    case 'Promociones': return <Megaphone className={iconClass} size={18} />;
    case 'Equipos y Maquinaria': return <Wrench className={iconClass} size={18} />;
    default: return <AlertTriangle className={iconClass} size={18} />;
  }
};

export default function CategorySidebar({
  categories,
  activeFilter,
  onSelectFilter,
  sticky = true,
  className = ''
}) {
  return (
    <aside
      className={`bg-white/90 border border-cyan-100 rounded-2xl p-4 shadow-sm ${
        sticky ? 'lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-hidden' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2 mb-4 px-2">
        <Filter size={18} className="text-cyan-600" />
        <span className="text-sm font-semibold text-cyan-800">Categorías</span>
      </div>

      <div className={`space-y-2 pr-1 ${sticky ? 'lg:max-h-[calc(100vh-13rem)] lg:overflow-y-auto' : 'max-h-80 overflow-y-auto'}`}>
        {categories.map((cat) => {
          const isActive = activeFilter === cat;

          return (
            <button
              key={cat}
              onClick={() => onSelectFilter(cat)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all border ${
                isActive
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                  : 'bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300'
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-cyan-500/40' : 'bg-cyan-50'}`}>
                {getSidebarIcon(cat, isActive)}
              </span>
              <span className="leading-tight">{cat}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
