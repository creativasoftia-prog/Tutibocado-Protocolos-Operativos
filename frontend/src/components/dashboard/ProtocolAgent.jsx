import React, { useMemo, useState } from 'react';
import { BookOpen, Sparkles, Search, ArrowRight, AlertCircle } from 'lucide-react';

const DIRECT_HINTS = {
  luz: ['luz', 'energia', 'apag', 'electric', 'cfe', 'sin corriente'],
  agua: ['agua', 'sin agua', 'lavabos', 'banos'],
  insumos: ['insumo no llega', 'no llegaron', 'faltante entrega', 'logistica no entrego'],
  pedido_insumos: ['pedido tarde', 'extemporaneo', 'olvide pedido', 'lunes 14:00'],
  retorno_insumos: ['retorno', 'devolucion cedis', 'devolver insumos'],
  producto_incidencia: ['producto danado', 'etiquetado', 'rechazo producto', 'f-04'],
  sistema: ['pos', 'app', 'sistema', 'no cobra', 'terminal'],
  personal: ['falta colaborador', 'retardo', 'mala conducta', 'acta administrativa'],
  ticket_rh: ['nomina', 'permisos', 'asistencias', 'prestamo', 'ticket rh'],
  apoyo_emocional: ['emocional', 'apoyo personal', 'crisis', 'estres', 'psicologo'],
  incumplimiento_protocolo: ['incumplimiento', 'no siguio protocolo', 'violacion proceso'],
  plaga: ['plaga', 'roedor', 'fumigacion', 'insectos'],
  autoridad: ['cofepris', 'imss', 'inspector', 'autoridad', 'ayuntamiento'],
  caja: ['faltante caja', 'merma', 'arqueo', 'efectivo'],
  cierre_terminal: ['cierre terminal', 'factura', 'transferencia'],
};

const QUICK_QUESTIONS = [
  'Se fue la luz y no podemos cobrar',
  'Llego una inspeccion de COFEPRIS',
  'No llego el pedido de insumos',
  'Hay faltante de caja en el corte',
  'El sistema de cobro no funciona'
];

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildProtocolDocument(protocol) {
  return {
    id: protocol.id,
    name: normalizeText(protocol.name),
    code: normalizeText(protocol.code),
    trigger: normalizeText(protocol.trigger),
    description: normalizeText(protocol.description),
    type: normalizeText(protocol.type),
    responsible: normalizeText(protocol.responsible),
    areas: normalizeText(protocol.areas.join(' ')),
    steps: normalizeText(protocol.textSteps.join(' '))
  };
}

function scoreProtocol(query, protocolDoc) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;

  let score = 0;
  const tokens = normalizedQuery.split(' ').filter((t) => t.length > 2);

  if (protocolDoc.code && normalizedQuery.includes(protocolDoc.code)) score += 45;
  if (normalizedQuery.includes(protocolDoc.name)) score += 40;
  if (protocolDoc.trigger.includes(normalizedQuery)) score += 24;

  tokens.forEach((token) => {
    if (protocolDoc.name.includes(token)) score += 10;
    if (protocolDoc.trigger.includes(token)) score += 8;
    if (protocolDoc.description.includes(token)) score += 6;
    if (protocolDoc.type.includes(token)) score += 5;
    if (protocolDoc.responsible.includes(token)) score += 4;
    if (protocolDoc.areas.includes(token)) score += 3;
    if (protocolDoc.steps.includes(token)) score += 2;
  });

  const hintTerms = DIRECT_HINTS[protocolDoc.id] || [];
  hintTerms.forEach((hint) => {
    if (normalizedQuery.includes(normalizeText(hint))) {
      score += 20;
    }
  });

  return score;
}

function getConfidence(score) {
  if (score >= 75) return 'Alta';
  if (score >= 45) return 'Media';
  if (score >= 25) return 'Baja';
  return 'Sin coincidencia clara';
}

export default function ProtocolAgent({ protocols, onSelect }) {
  const [question, setQuestion] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const indexedProtocols = useMemo(
    () => protocols.map((p) => ({ protocol: p, doc: buildProtocolDocument(p) })),
    [protocols]
  );

  const rankedResults = useMemo(() => {
    if (!question.trim()) return [];

    return indexedProtocols
      .map((entry) => ({
        protocol: entry.protocol,
        score: scoreProtocol(question, entry.doc)
      }))
      .sort((a, b) => b.score - a.score);
  }, [indexedProtocols, question]);

  const bestMatch = rankedResults[0];
  const alternatives = rankedResults.slice(1, 4);

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleQuickQuestion = (value) => {
    setQuestion(value);
    setHasSearched(true);
  };

  return (
    <section className="bg-white/90 border border-cyan-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <BookOpen size={22} />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-heading font-bold text-cyan-900">Consulta de Protocolos</h3>
          <p className="text-cyan-700 text-sm md:text-base">
            Describe la situacion y encuentra el protocolo que aplica.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-cyan-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-cyan-200 rounded-xl leading-5 bg-white placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-shadow shadow-sm"
            placeholder="Ejemplo: se cayo el POS y no podemos cobrar"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 font-bold transition-all shadow-md hover:shadow-lg"
        >
          Consultar
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((item) => (
          <button
            key={item}
            onClick={() => handleQuickQuestion(item)}
            className="text-xs md:text-sm bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-full px-3 py-1.5 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {hasSearched && !question.trim() && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          Escribe una situacion para poder recomendarte un protocolo.
        </div>
      )}

      {hasSearched && question.trim() && bestMatch && bestMatch.score > 0 && (
        <div className="space-y-4">
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-cyan-700">Mejor coincidencia</p>
                <h4 className="text-lg md:text-xl font-heading font-bold text-cyan-900">
                  {bestMatch.protocol.code} - {bestMatch.protocol.name}
                </h4>
              </div>
              <span className="inline-flex items-center gap-1 text-xs bg-white border border-cyan-300 text-cyan-800 font-semibold px-2.5 py-1 rounded-full">
                <Sparkles size={13} />
                Confianza {getConfidence(bestMatch.score)}
              </span>
            </div>

            <p className="text-sm text-cyan-800 mb-3">
              <span className="font-semibold">Detonante:</span> {bestMatch.protocol.trigger}
            </p>

            <div className="space-y-2 mb-4">
              {bestMatch.protocol.textSteps.slice(0, 3).map((step, idx) => (
                <p key={idx} className="text-sm text-cyan-900 bg-white border border-cyan-100 rounded-lg px-3 py-2">
                  {step}
                </p>
              ))}
            </div>

            <button
              onClick={() => onSelect(bestMatch.protocol)}
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Abrir protocolo completo
              <ArrowRight size={16} />
            </button>
          </div>

          {alternatives.filter((item) => item.score > 0).length > 0 && (
            <div className="bg-white border border-cyan-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-cyan-800 mb-2">Tambien podrian aplicar:</p>
              <div className="flex flex-wrap gap-2">
                {alternatives
                  .filter((item) => item.score > 0)
                  .map((item) => (
                    <button
                      key={item.protocol.id}
                      onClick={() => onSelect(item.protocol)}
                      className="text-sm bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      {item.protocol.code} - {item.protocol.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {hasSearched && question.trim() && (!bestMatch || bestMatch.score <= 0) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-sm">
          No encontre una coincidencia clara. Intenta describir la situacion con mas detalle (ejemplo: "faltante de caja en corte").
        </div>
      )}
    </section>
  );
}