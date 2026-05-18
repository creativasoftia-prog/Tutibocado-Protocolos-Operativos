import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import CategorySidebar from './dashboard/CategorySidebar';
import ProtocolCardsGrid from './dashboard/ProtocolCardsGrid';
import ProtocolAgent from './dashboard/ProtocolAgent';

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

  const PAGE_SIZE = 12;
  const [page, setPage] = useState(0);

  // Resetear página al cambiar filtros
  useEffect(() => { setPage(0); }, [searchTerm, activeFilter]);

  const totalPages = Math.ceil(filteredProtocols.length / PAGE_SIZE);
  const paginated = filteredProtocols.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="w-full pl-3 pr-3 sm:pl-4 sm:pr-4 lg:pl-4 lg:pr-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">

      {/* ── Grid sidebar + contenido ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
        {/* Filtro móvil */}
        <div className="md:hidden">
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

        {/* Sidebar desktop */}
        <CategorySidebar
          categories={categories}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          className="hidden md:block"
        />

        {/* Área principal */}
        <section className="space-y-4 md:col-start-2 md:pr-2 xl:pr-4">
          <ProtocolAgent protocols={protocols} onSelect={onSelect} />

          <div className="flex items-center justify-between bg-white/60 border border-cyan-100 rounded-xl px-4 py-2.5">
            <span className="text-sm text-cyan-800 font-medium">
              {filteredProtocols.length === protocols.length
                ? `${protocols.length} protocolo${protocols.length !== 1 ? 's' : ''} disponibles`
                : `${filteredProtocols.length} de ${protocols.length} protocolos`}
            </span>
            {activeFilter !== 'Todos' && (
              <button
                onClick={() => setActiveFilter('Todos')}
                className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold underline"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          <ProtocolCardsGrid protocols={paginated} onSelect={onSelect} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-cyan-100">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-xl border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-35 hover:bg-cyan-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-xs text-slate-500">
                Página {page + 1} de {totalPages}
                <span className="hidden sm:inline"> · {filteredProtocols.length} protocolo{filteredProtocols.length !== 1 ? 's' : ''}</span>
              </span>
              <button
                type="button"
                disabled={(page + 1) >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl border border-cyan-200 text-sm font-semibold text-cyan-700 disabled:opacity-35 hover:bg-cyan-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
