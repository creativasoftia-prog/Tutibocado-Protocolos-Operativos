import React, { useRef } from 'react';
import { ArrowLeft, Download, Image as ImageIcon, CheckCircle2, AlertCircle, Info, MessagesSquare, FileText, Share2 } from 'lucide-react';
import SvgDiagram from './SvgDiagram';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function ProtocolDetail({ protocol, onBack }) {
  const [viewMode, setViewMode] = React.useState('text'); // 'text' | 'diagram'
  const printRef = useRef(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const imgData = await toPng(printRef.current, { 
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const img = new Image();
      img.src = imgData;
      await new Promise(resolve => img.onload = resolve);
      
      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Protocolo_${protocol.code}_${protocol.name.replace(/\\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error exportando a PDF:', err);
      alert('Error al generar el PDF. Por favor intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(printRef.current, { 
        backgroundColor: '#ffffff',
        pixelRatio: 2 
      });
      const link = document.createElement('a');
      link.download = `Protocolo_${protocol.code}_${protocol.name.replace(/\\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exportando a imagen:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-500 pb-20">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <button 
          onClick={onBack}
          className="flex items-center text-cyan-700 hover:text-cyan-900 font-semibold transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver al panel
        </button>
        
        {/* View Toggles - Outside of export area */}
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-xl border border-cyan-100 flex shadow-sm">
          <button 
            onClick={() => setViewMode('text')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              viewMode === 'text' 
                ? 'bg-cyan-600 text-white shadow-md' 
                : 'text-cyan-700 hover:bg-cyan-50'
            }`}
          >
            <FileText size={16} className="mr-2" />
            Vista Operativa
          </button>
          <button 
            onClick={() => setViewMode('diagram')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              viewMode === 'diagram' 
                ? 'bg-cyan-600 text-white shadow-md' 
                : 'text-cyan-700 hover:bg-cyan-50'
            }`}
          >
            <Share2 size={16} className="mr-2" />
            Diagrama
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExportImage}
            disabled={isExporting}
            className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 bg-white border-2 border-cyan-600 text-cyan-700 rounded-xl hover:bg-cyan-50 font-bold transition-all shadow-sm text-sm disabled:opacity-50"
          >
            <ImageIcon size={18} className="mr-2" />
            JPG
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 font-bold transition-all shadow-md hover:shadow-lg text-sm disabled:opacity-50"
          >
            <Download size={18} className="mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Exportable Area */}
      <div 
        ref={printRef} 
        className="bg-white rounded-2xl shadow-md border border-cyan-200 overflow-hidden relative"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-900 to-cyan-700 p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <ShieldCheck size={400} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-white text-cyan-900 px-4 py-1.5 rounded-lg font-black tracking-widest text-sm shadow-sm">
                {protocol.code}
              </span>
              <span className="bg-cyan-800/80 px-4 py-1.5 rounded-lg font-semibold text-sm border border-cyan-600/50 backdrop-blur-md">
                {protocol.type}
              </span>
              <span className={`px-4 py-1.5 rounded-lg font-bold text-sm border backdrop-blur-md ${
                protocol.priority === 'Crítica' ? 'bg-red-500/20 text-red-100 border-red-500/30' :
                protocol.priority === 'Alta' ? 'bg-orange-500/20 text-orange-100 border-orange-500/30' :
                'bg-blue-500/20 text-blue-100 border-blue-500/30'
              }`}>
                Prioridad {protocol.priority}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 leading-tight">{protocol.name}</h1>
            <p className="text-cyan-50 font-medium max-w-3xl text-lg leading-relaxed">{protocol.description}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-10">
          {viewMode === 'text' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Main Steps - Left Column (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-slate-800 mb-8 flex items-center pb-4 border-b border-slate-100">
                    <span className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mr-4 text-lg">✓</span>
                    Procedimiento Operativo
                  </h3>
                  
                  <div className="space-y-6">
                    {protocol.textSteps.map((step, idx) => {
                      const isTitle = step.includes(':');
                      const parts = step.split(':');
                      
                      return (
                        <div key={idx} className="relative flex gap-6">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-cyan-50 border-2 border-cyan-200 text-cyan-700 flex items-center justify-center font-bold shadow-sm z-10">
                              {idx + 1}
                            </div>
                            {idx !== protocol.textSteps.length - 1 && (
                              <div className="w-0.5 h-full bg-cyan-100 mt-2"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 pb-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                              {isTitle ? (
                                <>
                                  <h4 className="font-heading font-bold text-slate-900 text-xl mb-2">{parts[0]}</h4>
                                  <p className="text-slate-700 text-lg leading-relaxed font-body">{parts.slice(1).join(':')}</p>
                                </>
                              ) : (
                                <p className="text-slate-700 text-lg leading-relaxed font-body">{step}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Meta Information - Right Column (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-xl p-6 shadow-sm">
                  <h4 className="font-bold text-orange-900 flex items-center mb-3 text-lg">
                    <AlertCircle size={22} className="mr-2 text-orange-600" />
                    Situación detonante
                  </h4>
                  <p className="text-orange-900/80 font-medium text-lg leading-relaxed">{protocol.trigger}</p>
                </div>

                <div className="bg-white border-2 border-slate-100 rounded-xl p-6 shadow-sm space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Responsable</h4>
                    <p className="font-bold text-slate-800 text-xl flex items-center">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 mr-3"></span>
                      {protocol.responsible}
                    </p>
                  </div>
                  <div className="h-px bg-slate-100"></div>
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Áreas Notificadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {protocol.areas.map((area, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-6 shadow-sm">
                  <h4 className="font-bold text-blue-900 flex items-center mb-3 text-lg">
                    <MessagesSquare size={22} className="mr-2 text-blue-600" />
                    Reglas de Comunicación
                  </h4>
                  <p className="text-blue-900/80 font-medium leading-relaxed">{protocol.communicationRules}</p>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-xl p-6 shadow-sm">
                  <h4 className="font-bold text-emerald-900 flex items-center mb-3 text-lg">
                    <CheckCircle2 size={22} className="mr-2 text-emerald-600" />
                    Criterios de Cierre
                  </h4>
                  <p className="text-emerald-900/80 font-medium leading-relaxed">{protocol.closingCriteria}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-8">
                  <h4 className="font-bold text-slate-700 flex items-center mb-3">
                    <Info size={20} className="mr-2 text-cyan-600" />
                    Recomendaciones
                  </h4>
                  <p className="text-slate-600 font-medium italic leading-relaxed">{protocol.recommendations}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[600px] flex items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200 p-8">
              <div className="w-full h-full max-w-4xl mx-auto">
                <SvgDiagram protocolId={protocol.id} protocolName={protocol.name} />
              </div>
            </div>
          )}
        </div>
        
        {/* Document Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-10 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-cyan-900 rounded flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="font-bold text-slate-700 tracking-wide">TUTIBOCADO</span>
          </div>
          <p className="text-slate-400 font-medium text-sm">Documento Operativo Oficial • Uso Interno</p>
        </div>
      </div>
    </div>
  );
}

// Background Decoration
const ShieldCheck = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);
