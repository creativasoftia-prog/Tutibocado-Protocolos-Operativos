import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import CategorySidebar from './dashboard/CategorySidebar';
import ProtocolCardsGrid from './dashboard/ProtocolCardsGrid';

export default function Dashboard({ protocols, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredProtocols = protocols.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.trigger.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'Todos' || p.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['Todos', ...new Set(protocols.map((p) => p.type))];

  return (
    <div className="w-full pl-3 pr-3 sm:pl-4 sm:pr-4 lg:pl-4 lg:pr-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
        <div className="lg:hidden">
          <details className="bg-white/90 border border-cyan-100 rounded-2xl shadow-sm group">
            <summary className="list-none cursor-pointer px-4 py-3 flex items-center justify-between text-cyan-800 font-semibold">
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-cyan-600" />
                Filtros de categorías
              </span>
              <ChevronDown size={18} className="text-cyan-600 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-3 pb-3">
              <CategorySidebar
                categories={categories}
                activeFilter={activeFilter}
                onSelectFilter={setActiveFilter}
                sticky={false}
                className="border-0 shadow-none bg-transparent p-1"
              />
            </div>
          </details>
        </div>

        <CategorySidebar
          categories={categories}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          className="hidden lg:block"
        />

        <section className="space-y-4 lg:col-start-2 lg:pr-2 xl:pr-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-heading font-bold text-cyan-900 mb-2">Panel de Protocolos</h2>
              <p className="text-cyan-700 max-w-2xl">
                Centro de consulta rapida para situaciones operativas. Encuentra el procedimiento correcto paso a paso.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-cyan-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-cyan-200 rounded-xl leading-5 bg-white placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-shadow shadow-sm"
                placeholder="Buscar protocolo, codigo o situacion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white/60 border border-cyan-100 rounded-xl px-4 py-2.5 text-sm text-cyan-800 font-medium">
            Mostrando {filteredProtocols.length} protocolo(s)
          </div>
          <ProtocolCardsGrid protocols={filteredProtocols} onSelect={onSelect} />
        </section>
      </div>
    </div>
  );
}
