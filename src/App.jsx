import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ProtocolDetail from './components/ProtocolDetail';
import { protocolsData } from './data/protocols';

function App() {
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  return (
    <div className="min-h-screen bg-[#ECFEFF] text-[#164E63]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-cyan-100 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSelectedProtocol(null)}
          >
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-heading font-bold text-xl shadow-md">
              T
            </div>
            <div>
              <h1 className="font-heading font-semibold text-xl leading-tight">Tutibocado</h1>
              <p className="text-xs text-cyan-700 font-medium tracking-wide uppercase">Protocolos Operativos</p>
            </div>
          </div>
          
          <div className="hidden sm:flex gap-4 text-sm font-medium">
            <span className="bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-full border border-cyan-100">
              Sucursales
            </span>
            <span className="bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-full border border-cyan-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Sistema Activo
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {selectedProtocol ? (
          <ProtocolDetail 
            protocol={selectedProtocol} 
            onBack={() => setSelectedProtocol(null)} 
          />
        ) : (
          <Dashboard 
            protocols={protocolsData} 
            onSelect={setSelectedProtocol} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
