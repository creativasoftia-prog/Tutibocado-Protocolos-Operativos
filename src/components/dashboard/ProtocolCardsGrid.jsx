import React from 'react';
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Package,
  ShieldAlert,
  MonitorX,
  Users,
  Scale,
  FileText,
  ChevronRight,
  Truck,
  MessageSquare,
  ShoppingBag,
  Megaphone,
  Wrench
} from 'lucide-react';

const getIcon = (type) => {
  switch (type) {
    case 'Infraestructura': return <Zap className="text-amber-500" size={24} />;
    case 'Operativo': return <Package className="text-blue-500" size={24} />;
    case 'Insumos y consumibles': return <ShoppingBag className="text-green-500" size={24} />;
    case 'Logística': return <Truck className="text-orange-500" size={24} />;
    case 'Atención al Cliente': return <MessageSquare className="text-pink-500" size={24} />;
    case 'Tecnología/Soporte': return <MonitorX className="text-purple-500" size={24} />;
    case 'Capital Humano':
    case 'Recursos Humanos': return <Users className="text-indigo-500" size={24} />;
    case 'Sanidad': return <ShieldCheck className="text-emerald-500" size={24} />;
    case 'Visitas de Dependencias Gubernamentales':
    case 'Asuntos Gubernamentales': return <Scale className="text-slate-600" size={24} />;
    case 'Finanzas': return <FileText className="text-cyan-600" size={24} />;
    case 'Seguridad': return <ShieldAlert className="text-red-600" size={24} />;
    case 'Promociones': return <Megaphone className="text-orange-500" size={24} />;
    case 'Equipos y Maquinaria': return <Wrench className="text-teal-600" size={24} />;
    default: return <AlertTriangle className="text-gray-500" size={24} />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Crítica': return 'bg-red-100 text-red-700 border-red-200';
    case 'Alta': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Media': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function ProtocolCardsGrid({ protocols, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1700px]:grid-cols-5 gap-6">
      {protocols.map((protocol) => (
        <div
          key={protocol.id}
          onClick={() => onSelect(protocol)}
          className="group glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-cyan-300 flex flex-col h-full bg-white/80"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-50 rounded-xl group-hover:bg-cyan-100 transition-colors">
              {getIcon(protocol.type)}
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getPriorityColor(protocol.priority)}`}>
              {protocol.priority}
            </span>
          </div>

          <div className="mb-2">
            <span className="text-xs font-bold text-cyan-500 tracking-wider mb-1 block">
              {protocol.code} • {protocol.type}
            </span>
            <h3 className="font-heading font-semibold text-lg text-slate-800 leading-tight group-hover:text-cyan-700 transition-colors">
              {protocol.name}
            </h3>
          </div>

          <p className="text-sm text-slate-600 mb-6 flex-grow line-clamp-3">
            <span className="font-semibold text-slate-700">Situación:</span> {protocol.trigger}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Resp: <span className="text-slate-700">{protocol.responsible.split('/')[0]}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white text-cyan-600 transition-colors">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      ))}

      {protocols.length === 0 && (
        <div className="col-span-full py-12 text-center text-cyan-700 glass-card rounded-2xl">
          <Search size={48} className="mx-auto text-cyan-300 mb-4" />
          <p className="text-lg font-medium">No se encontraron protocolos</p>
          <p className="text-sm text-cyan-600">Intenta con otros términos de búsqueda o cambia el filtro</p>
        </div>
      )}
    </div>
  );
}
