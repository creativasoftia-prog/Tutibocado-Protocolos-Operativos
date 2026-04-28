import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, ShieldCheck, Zap, Package, ShieldAlert, MonitorX, Users, Scale, FileText, ChevronRight } from 'lucide-react';

// Icon mapping based on protocol type
const getIcon = (type) => {
  switch (type) {
    case 'Infraestructura': return <Zap className="text-amber-500" size={24} />;
    case 'Operativo': return <Package className="text-blue-500" size={24} />;
    case 'Tecnología': return <MonitorX className="text-purple-500" size={24} />;
    case 'Recursos Humanos': return <Users className="text-indigo-500" size={24} />;
    case 'Sanidad': return <ShieldCheck className="text-emerald-500" size={24} />;
    case 'Legal': return <Scale className="text-slate-600" size={24} />;
    case 'Finanzas': return <FileText className="text-cyan-600" size={24} />;
    case 'Seguridad': return <ShieldAlert className="text-red-600" size={24} />;
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

export default function Dashboard({ protocols, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredProtocols = protocols.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.trigger.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'Todos' || p.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['Todos', ...new Set(protocols.map(p => p.type))];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-cyan-900 mb-2">Panel de Protocolos</h2>
          <p className="text-cyan-700 max-w-2xl">
            Centro de consulta rápida para situaciones operativas. Encuentra el procedimiento correcto paso a paso.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-cyan-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-cyan-200 rounded-xl leading-5 bg-white placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-shadow shadow-sm"
            placeholder="Buscar protocolo, código o situación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter size={18} className="text-cyan-600 mr-2 flex-shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeFilter === cat 
                ? 'bg-cyan-600 text-white shadow-md' 
                : 'bg-white text-cyan-700 border border-cyan-200 hover:bg-cyan-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProtocols.map(protocol => (
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
        
        {filteredProtocols.length === 0 && (
          <div className="col-span-full py-12 text-center text-cyan-700 glass-card rounded-2xl">
            <Search size={48} className="mx-auto text-cyan-300 mb-4" />
            <p className="text-lg font-medium">No se encontraron protocolos</p>
            <p className="text-sm text-cyan-600">Intenta con otros términos de búsqueda o cambia el filtro</p>
          </div>
        )}
      </div>
    </div>
  );
}
