import React, { useMemo, useState } from 'react';
import { Bot, Sparkles, Search, ArrowRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Grupos de sinónimos en español ──────────────────────────────────────────
// Si el usuario usa cualquier término del grupo, se amplía la búsqueda con todos
const SYNONYM_GROUPS = [
  ['luz', 'energia', 'electricidad', 'apagado', 'corriente', 'cfe', 'sin luz', 'sin corriente', 'corte electrico', 'corte de luz'],
  ['agua', 'lavabo', 'bano', 'sanitario', 'plomeria', 'tubo', 'fuga', 'sin agua'],
  ['pos', 'terminal', 'sistema', 'cobro', 'cobrar', 'app', 'caja registradora', 'pago', 'no cobra', 'caido', 'no jala', 'no abre', 'no funciona'],
  ['insumo', 'materia prima', 'pedido', 'entrega', 'proveedor', 'faltante', 'no llego', 'desabasto', 'falta producto'],
  ['personal', 'empleado', 'colaborador', 'trabajador', 'ausentismo', 'falta', 'retardo', 'tardanza', 'baja', 'no vino', 'abandono'],
  ['caja', 'efectivo', 'dinero', 'arqueo', 'corte', 'faltante caja', 'merma', 'billete', 'cambio', 'sobrante'],
  ['cliente', 'queja', 'reclamacion', 'insatisfecho', 'devolucion', 'atencion', 'disgusto', 'molestia'],
  ['plaga', 'roedor', 'insecto', 'cucaracha', 'rata', 'fumigacion', 'bicho'],
  ['autoridad', 'inspector', 'cofepris', 'imss', 'sat', 'ayuntamiento', 'gobierno', 'inspeccion', 'visita oficial', 'dependencia'],
  ['accidente', 'lesion', 'herida', 'emergencia medica', 'medico', 'ambulancia', 'primeros auxilios', 'golpe', 'caida'],
  ['nomina', 'sueldo', 'pago empleado', 'rh', 'recursos humanos', 'prestamo', 'permiso', 'vacaciones', 'asistencia'],
  ['maquinaria', 'equipo', 'descompuesto', 'falla equipo', 'mantenimiento', 'reparacion', 'averia'],
  ['seguridad', 'robo', 'asalto', 'amenaza', 'policia', 'ladron', 'incidente', 'sospechoso'],
  ['finanzas', 'presupuesto', 'gasto', 'factura', 'transferencia', 'deposito', 'cierre financiero'],
  ['apertura', 'abrir', 'inicio operaciones', 'arranque', 'encendido'],
  ['cierre', 'cerrar', 'fin operaciones', 'termino'],
  ['capacitacion', 'entrenamiento', 'nuevo empleado', 'induccion', 'curso'],
  ['promocion', 'descuento', 'oferta', 'campana', 'marketing'],
  ['conducta', 'acta', 'falta grave', 'comportamiento', 'disciplina', 'sancion'],
  ['producto', 'danado', 'vencido', 'caducado', 'mal estado', 'rechazo'],
];

// ─── Palabras vacías en español ───────────────────────────────────────────────
const STOP_WORDS = new Set([
  'a','al','ante','bajo','con','de','del','desde','durante','en','entre','hacia',
  'hasta','mediante','para','por','segun','sin','sobre','tras','un','una','unos',
  'unas','el','la','los','las','es','son','fue','hay','me','mi','se','su','ya',
  'no','si','que','como','cuando','donde','pero','y','o','lo','le','les','nos',
  'esta','esto','este','ese','esa','aqui','alli','muy','mas','menos','bien','mal',
  'todo','todos','toda','todas','otro','otra','mismo','nueva','nuevo',
  'tengo','tenemos','hacer','estoy','estamos','quiero','necesito','hubo',
  'puede','pueden','debo','debemos','fue','tuve','tuvo','ser','estar','tener',
  'han','haber','tiene','tienen','vamos','voy','vengo','viene','paso',
]);

// ─── INICIO reemplazo lógica antigua ─────────────────────────────────────────
const _UNUSED_DIRECT_HINTS = {
  luz: ['luz', 'energia', 'apag', 'electric', 'cfe', 'sin corriente'],
  agua: ['agua', 'sin agua', 'lavabos', 'banos'],
  insumos: ['insumo no llega', 'no llegaron', 'faltante entrega', 'logistica no entrego'],
  pedido_insumos: ['pedido tarde', 'extemporaneo', 'olvide pedido', 'lunes 14:00'],
  retorno_insumos: ['retorno', 'devolucion cedis', 'devolver insumos'],
  producto_incidencia: ['producto danado', 'etiquetado', 'rechazo producto', 'f-04'],
  sistema: ['pos', 'app', 'sistema', 'no cobra', 'terminal'],
};
// ─── FIN lógica antigua (no se usa) ──────────────────────────────────────────

// ─── Normalizar texto ─────────────────────────────────────────────────────────
function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Tokenizar quitando palabras vacías ───────────────────────────────────────
function tokenize(text) {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

// ─── Extraer n-gramas ─────────────────────────────────────────────────────────
function ngrams(tokens, n) {
  const result = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    result.push(tokens.slice(i, i + n).join(' '));
  }
  return result;
}

// ─── Expandir consulta con sinónimos relacionados ─────────────────────────────
function expandTokens(queryTokens) {
  const expanded = new Set(queryTokens);
  const queryJoined = queryTokens.join(' ');
  for (const group of SYNONYM_GROUPS) {
    const normGroup = group.map(normalize);
    const hit = normGroup.some(
      (term) => queryJoined.includes(term) || queryTokens.some((t) => term.includes(t))
    );
    if (hit) {
      normGroup.forEach((term) =>
        term.split(' ').filter((t) => t.length > 2 && !STOP_WORDS.has(t)).forEach((t) => expanded.add(t))
      );
    }
  }
  return [...expanded];
}

// ─── Construir documento indexado por protocolo ───────────────────────────────
function buildDoc(protocol) {
  return {
    normName: normalize(protocol.name),
    normCode: normalize(protocol.code),
    normTrigger: normalize(protocol.trigger),
    normDescription: normalize(protocol.description),
    normType: normalize(protocol.type),
    normResponsible: normalize(protocol.responsible),
    normAreas: normalize((protocol.areas || []).join(' ')),
    normSteps: normalize((protocol.textSteps || []).join(' ')),
    normComm: normalize(protocol.communicationRules),
    normClose: normalize(protocol.closingCriteria),
    normRec: normalize(protocol.recommendations),
  };
}

// ─── Calcular puntuación de coincidencia ─────────────────────────────────────
function scoreProtocol(queryNorm, queryTokens, expandedTokens, doc) {
  let score = 0;
  const reasons = [];

  if (doc.normCode && queryNorm.includes(doc.normCode)) {
    score += 80;
    reasons.push(`el código "${doc.normCode.toUpperCase()}" coincide directamente`);
  }
  if (doc.normName.length > 3 && queryNorm.includes(doc.normName)) {
    score += 60;
    reasons.push('el nombre del protocolo coincide con lo descrito');
  }

  const tris = ngrams(queryTokens, 3);
  for (const tri of tris) {
    if (doc.normTrigger.includes(tri)) { score += 35; reasons.push(`la frase "${tri}" está en el detonante`); }
    if (doc.normDescription.includes(tri)) score += 18;
    if (doc.normSteps.includes(tri)) score += 8;
  }

  const bis = ngrams(queryTokens, 2);
  for (const bi of bis) {
    if (doc.normTrigger.includes(bi)) { score += 22; reasons.push(`la frase "${bi}" describe el detonante`); }
    if (doc.normName.includes(bi)) score += 18;
    if (doc.normDescription.includes(bi)) score += 10;
    if (doc.normSteps.includes(bi)) score += 5;
  }

  const allTokens = [...new Set([...queryTokens, ...expandedTokens])];
  for (const token of allTokens) {
    if (doc.normCode.includes(token)) score += 15;
    if (doc.normName.includes(token)) score += 12;
    if (doc.normTrigger.includes(token)) score += 10;
    if (doc.normDescription.includes(token)) score += 6;
    if (doc.normType.includes(token)) score += 5;
    if (doc.normResponsible.includes(token)) score += 4;
    if (doc.normAreas.includes(token)) score += 3;
    if (doc.normSteps.includes(token)) score += 2;
    if (doc.normComm.includes(token)) score += 1;
    if (doc.normClose.includes(token)) score += 1;
    if (doc.normRec.includes(token)) score += 1;
  }

  for (const group of SYNONYM_GROUPS) {
    const normGroup = group.map(normalize);
    const queryHits = normGroup.some((term) =>
      queryTokens.some((t) => term.includes(t) || t.includes(term))
    );
    const docHits = normGroup.some(
      (term) => doc.normTrigger.includes(term) || doc.normName.includes(term)
    );
    if (queryHits && docHits) score += 15;
  }

  return { score, reasons: [...new Set(reasons)].slice(0, 3) };
}

// ─── Etiqueta de confianza ────────────────────────────────────────────────────
function getConfidence(score) {
  if (score >= 80) return { label: 'Alta', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (score >= 45) return { label: 'Media', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  if (score >= 20) return { label: 'Baja', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  return null;
}

// ─── Genera respuesta natural desde el protocolo ─────────────────────────────
function generateResponse(protocol, reasons) {
  const steps = (protocol.textSteps || []).slice(0, 3);
  const areas = (protocol.areas || []).join(', ');
  const intro = reasons.length
    ? `Identifiqué esta situación porque ${reasons[0]}.`
    : 'Este protocolo aplica para la situación que describes.';
  const responsible = protocol.responsible
    ? `El responsable de activar este protocolo es ${protocol.responsible}.`
    : '';
  const stepText = steps.length
    ? `Los primeros pasos son: ${steps.map((s, i) => `${i + 1}) ${s}`).join('. ')}.`
    : '';
  const areasText = areas ? `Notifica a: ${areas}.` : '';
  const commText = protocol.communicationRules
    ? `Comunicación: ${protocol.communicationRules.slice(0, 120)}${protocol.communicationRules.length > 120 ? '...' : ''}`
    : '';
  return [intro, responsible, stepText, areasText, commText].filter(Boolean).join(' ');
}

// ─── Preguntas rápidas ────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  'Se fue la luz y no podemos cobrar',
  'Llegaron personas de gobierno a revisar la tienda',
  'No llegó el pedido de productos',
  'Me falta dinero al contar la caja',
  'La máquina para cobrar no funciona',
  'Un compañero no llegó a su turno',
  'Un cliente está muy enojado y haciendo escándalo',
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ProtocolAgent({ protocols, onSelect }) {
  const [question, setQuestion] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const docs = useMemo(
    () => protocols.map((p) => ({ protocol: p, doc: buildDoc(p) })),
    [protocols]
  );

  const results = useMemo(() => {
    if (!question.trim()) return [];
    const queryNorm = normalize(question);
    const queryTokens = tokenize(question);
    const expandedTokens = expandTokens(queryTokens);
    return docs
      .map(({ protocol, doc }) => {
        const { score, reasons } = scoreProtocol(queryNorm, queryTokens, expandedTokens, doc);
        return { protocol, score, reasons };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [docs, question]);

  const best = results[0] || null;
  const alternatives = results.slice(1, 4);
  const confidence = best ? getConfidence(best.score) : null;
  const response = best ? generateResponse(best.protocol, best.reasons) : '';

  const handleSearch = () => { setHasSearched(true); setShowWhy(false); };
  const handleQuick = (value) => { setQuestion(value); setHasSearched(true); setShowWhy(false); };

  const PRIORITY_COLOR = {
    'Crítica': 'bg-rose-100 text-rose-700 border-rose-200',
    'Alta':    'bg-orange-100 text-orange-700 border-orange-200',
    'Media':   'bg-amber-100 text-amber-700 border-amber-200',
    'Baja':    'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <section className="rounded-2xl overflow-hidden shadow-lg border border-cyan-100">

      {/* ── Cabecera con gradiente ───────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-cyan-700 via-cyan-600 to-teal-500 px-6 py-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner shrink-0">
            <Bot size={26} />
          </div>
          <div>
            <h3 className="text-2xl font-heading font-bold leading-tight">Agente de Protocolos</h3>
            <p className="text-cyan-100 text-sm mt-0.5">
              Describe la situación y te digo qué hacer al instante.
            </p>
          </div>
        </div>

        {/* Barra de búsqueda dentro del header */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={17} className="text-cyan-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-medium"
              placeholder="Ej: la máquina para cobrar no enciende y hay clientes esperando…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-white text-cyan-700 rounded-xl font-bold text-sm hover:bg-cyan-50 transition-all shadow-md shrink-0"
          >
            Consultar
          </button>
        </div>


      </div>

      {/* ── Preguntas rápidas ────────────────────────────────────────────── */}
      <div className="bg-cyan-50 border-b border-cyan-100 px-5 py-3">
        <p className="text-xs font-semibold text-cyan-500 uppercase tracking-wide mb-2">Situaciones frecuentes</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((item) => (
            <button
              key={item}
              onClick={() => handleQuick(item)}
              className="text-xs bg-white hover:bg-cyan-600 hover:text-white text-cyan-800 border border-cyan-200 rounded-lg px-3 py-1.5 transition-all font-medium shadow-sm"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* ── Área de resultados ───────────────────────────────────────────── */}
      <div className="bg-white px-5 py-5 space-y-4">

        {/* Sin texto */}
        {hasSearched && !question.trim() && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            Escribe una situación para buscar el protocolo adecuado.
          </div>
        )}

        {/* ── Resultado principal ──────────────────────────────────────── */}
        {hasSearched && question.trim() && best && confidence && (
          <div className="space-y-3">

            {/* Tarjeta principal */}
            <div className="rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-white shadow-sm overflow-hidden">

              {/* Banda superior de color por prioridad */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-teal-400" />

              <div className="p-5 space-y-4">
                {/* Encabezado del resultado */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-500 mb-1">
                      Protocolo recomendado
                    </span>
                    <h4 className="text-xl font-heading font-bold text-cyan-900 leading-tight">
                      {best.protocol.code} — {best.protocol.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs text-cyan-600 bg-cyan-100 rounded-md px-2 py-0.5 font-medium">
                        {best.protocol.type}
                      </span>
                      <span className={`text-xs rounded-md px-2 py-0.5 font-semibold border ${PRIORITY_COLOR[best.protocol.priority] || PRIORITY_COLOR['Baja']}`}>
                        Prioridad {best.protocol.priority}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border-2 ${confidence.color}`}>
                    <Sparkles size={13} />
                    Confianza {confidence.label}
                  </span>
                </div>

                {/* Respuesta en lenguaje natural */}
                <div className="rounded-xl bg-white border border-cyan-100 shadow-inner px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-cyan-400 mb-1.5">Qué hacer</p>
                  <p className="text-sm text-slate-800 leading-relaxed">{response}</p>
                </div>

                {/* Por qué coincide */}
                {best.reasons.length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowWhy((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-600 hover:text-cyan-800 font-semibold transition-colors"
                    >
                      {showWhy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {showWhy ? 'Ocultar detalle de análisis' : '¿Por qué coincide con esta situación?'}
                    </button>
                    {showWhy && (
                      <ul className="mt-2 text-xs text-cyan-700 space-y-1 list-none">
                        {best.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-1.5">
                            <span className="text-cyan-400 font-bold mt-0.5">→</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => onSelect(best.protocol)}
                  className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Ver protocolo completo
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Alternativas */}
            {alternatives.filter((r) => getConfidence(r.score)).length > 0 && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">También podrían aplicar</p>
                <div className="flex flex-wrap gap-2">
                  {alternatives
                    .filter((r) => getConfidence(r.score))
                    .map((item) => (
                      <button
                        key={item.protocol.id}
                        onClick={() => onSelect(item.protocol)}
                        className="text-xs bg-white hover:bg-cyan-50 text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors font-medium shadow-sm"
                      >
                        <span className="font-bold text-cyan-700">{item.protocol.code}</span> — {item.protocol.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sin coincidencia */}
        {hasSearched && question.trim() && (!best || !confidence) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-slate-400 shrink-0" />
              <p className="font-semibold text-slate-700 text-sm">No encontré un protocolo claro para esa situación.</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-6">
              Intenta describir con más detalle. Por ejemplo:{' '}
              <button onClick={() => handleQuick('me falta dinero al contar la caja')} className="text-cyan-600 underline underline-offset-2 hover:text-cyan-800">"me falta dinero al contar la caja"</button>,{' '}
              <button onClick={() => handleQuick('la máquina para cobrar no funciona')} className="text-cyan-600 underline underline-offset-2 hover:text-cyan-800">"la máquina para cobrar no funciona"</button>, o{' '}
              <button onClick={() => handleQuick('llegaron personas de gobierno a revisar la tienda')} className="text-cyan-600 underline underline-offset-2 hover:text-cyan-800">"llegaron personas de gobierno a revisar"</button>.
            </p>
          </div>
        )}

        {/* Estado inicial vacío */}
        {!hasSearched && (
          <div className="text-center py-6 text-slate-400 text-sm">
            <Bot size={32} className="mx-auto mb-2 opacity-20" />
            <p>Escribe una situación o elige una de las opciones de arriba.</p>
          </div>
        )}
      </div>
    </section>
  );
}