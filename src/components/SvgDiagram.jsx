import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Common animation variants
const nodeVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (custom) => ({
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { delay: custom * 0.2, duration: 0.5, type: 'spring', stiffness: 100 }
  })
};

const lineVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay: custom * 0.2 + 0.3, duration: 0.6, ease: 'easeInOut' }
  })
};

const SvgDiagram = ({ protocolId, protocolName }) => {
  const [key, setKey] = useState(0);

  // Remount component to trigger animations when tab changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [protocolId]);

  // Generate generic flow based on ID if we don't have a specific SVG for it
  // Since we have data for specific flows, we'll map them:
  
  const renderLuzFlow = () => (
    <svg width="100%" viewBox="0 0 680 560" className="max-w-3xl mx-auto drop-shadow-sm font-body">
      <defs>
        <marker id="arr-luz" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.05"/>
        </filter>
      </defs>
      
      {/* Title */}
      <motion.text x="340" y="22" textAnchor="middle" fontSize="16" fontWeight="600" fill="#164E63"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {protocolName}
      </motion.text>

      {/* Start Node */}
      <motion.g custom={0} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="240" y="36" width="200" height="34" rx="17" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" filter="url(#shadow)"/>
        <text x="340" y="53" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#475569">Tienda sin luz</text>
      </motion.g>
      
      <motion.line x1="340" y1="70" x2="340" y2="90" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={0} variants={lineVariant} initial="hidden" animate="visible"/>

      {/* Step 1 */}
      <motion.g custom={1} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="90" width="320" height="48" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="340" y="106" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#1E40AF">Paso 1: Verificar equipo vs local</text>
        <text x="340" y="124" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#3B82F6">Desconectar equipos · Revisar breakers</text>
      </motion.g>

      <motion.line x1="340" y1="138" x2="340" y2="158" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={1} variants={lineVariant} initial="hidden" animate="visible"/>

      {/* Decision 1 */}
      <motion.g custom={2} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="200" y="158" width="280" height="42" rx="8" fill="#FAF5FF" stroke="#D8B4FE" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="340" y="172" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#6B21A8">¿Se restableció la luz?</text>
        <text x="340" y="188" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#9333EA">Revisando breakers</text>
      </motion.g>

      <motion.line x1="480" y1="179" x2="550" y2="179" stroke="#22C55E" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={2} variants={lineVariant} initial="hidden" animate="visible"/>
      <motion.text x="510" y="173" fontSize="11" fontWeight="bold" fill="#16A34A" custom={2} variants={nodeVariant} initial="hidden" animate="visible">SÍ</motion.text>
      
      {/* End 1 */}
      <motion.g custom={3} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="550" y="159" width="100" height="40" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="600" y="179" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="600" fill="#166534">Fin del protocolo</text>
      </motion.g>

      <motion.line x1="340" y1="200" x2="340" y2="220" stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={2} variants={lineVariant} initial="hidden" animate="visible"/>
      <motion.text x="350" y="213" fontSize="11" fontWeight="bold" fill="#DC2626" custom={2} variants={nodeVariant} initial="hidden" animate="visible">NO</motion.text>

      {/* Step 2 */}
      <motion.g custom={3} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="220" width="320" height="48" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="340" y="238" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#1E40AF">Paso 2: Verificar problema en la zona</text>
        <text x="340" y="256" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#3B82F6">Consultar con vecinos o exterior</text>
      </motion.g>

      <motion.line x1="340" y1="268" x2="340" y2="288" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={3} variants={lineVariant} initial="hidden" animate="visible"/>

      {/* Step 3 */}
      <motion.g custom={4} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="288" width="320" height="48" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="340" y="306" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#1E40AF">Paso 3: Reportar al 071 (CFE)</text>
        <text x="340" y="324" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#3B82F6">Notificar anomalía + avisar supervisor</text>
      </motion.g>

      <motion.line x1="340" y1="336" x2="340" y2="356" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={4} variants={lineVariant} initial="hidden" animate="visible"/>

      {/* Step 4 */}
      <motion.g custom={5} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="356" width="320" height="48" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="340" y="374" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#1E40AF">Paso 4: Esperar tiempo de CFE</text>
        <text x="340" y="392" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#3B82F6">Mant: 1–2h · Avería: hasta 6–8h</text>
      </motion.g>

      <motion.line x1="340" y1="404" x2="340" y2="424" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={5} variants={lineVariant} initial="hidden" animate="visible"/>

      {/* Decision 2 */}
      <motion.g custom={6} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="424" width="320" height="42" rx="8" fill="#FAF5FF" stroke="#D8B4FE" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="340" y="438" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#6B21A8">¿Se restableció o hay riesgo para producto?</text>
      </motion.g>

      <motion.line x1="500" y1="445" x2="554" y2="445" stroke="#22C55E" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={6} variants={lineVariant} initial="hidden" animate="visible"/>
      <motion.text x="518" y="438" fontSize="11" fontWeight="bold" fill="#16A34A" custom={6} variants={nodeVariant} initial="hidden" animate="visible">SÍ</motion.text>

      {/* End 2 */}
      <motion.g custom={7} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="554" y="425" width="100" height="40" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="604" y="445" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="600" fill="#166534">Documentar</text>
      </motion.g>

      <motion.line x1="340" y1="466" x2="340" y2="488" stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#arr-luz)" custom={6} variants={lineVariant} initial="hidden" animate="visible"/>
      <motion.text x="350" y="480" fontSize="11" fontWeight="bold" fill="#DC2626" custom={6} variants={nodeVariant} initial="hidden" animate="visible">NO</motion.text>

      {/* Step 5 */}
      <motion.g custom={8} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="140" y="488" width="400" height="48" rx="8" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1.5" filter="url(#shadow)"/>
        <text x="340" y="506" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#BE123C">Paso 5: Retorno al CEDIS o traslado</text>
        <text x="340" y="524" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#E11D48">Inventario manual · Retorno documentado · Cierre</text>
      </motion.g>
    </svg>
  );

  // Fallback generic flow for any other protocol
  const renderGenericFlow = () => (
    <svg width="100%" viewBox="0 0 680 400" className="max-w-2xl mx-auto drop-shadow-sm font-body">
      <defs>
        <marker id="arr-gen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.05"/>
        </filter>
      </defs>
      
      <motion.text x="340" y="22" textAnchor="middle" fontSize="16" fontWeight="600" fill="#164E63"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {protocolName}
      </motion.text>

      <motion.g custom={0} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="220" y="36" width="240" height="34" rx="17" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" filter="url(#shadow2)"/>
        <text x="340" y="53" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#475569">Inicio del Protocolo</text>
      </motion.g>
      
      <motion.line x1="340" y1="70" x2="340" y2="90" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-gen)" custom={0} variants={lineVariant} initial="hidden" animate="visible"/>

      <motion.g custom={1} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="90" width="320" height="48" rx="8" fill="#F0F9FF" stroke="#7DD3FC" strokeWidth="1.5" filter="url(#shadow2)"/>
        <text x="340" y="106" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#0369A1">Notificación y Evaluación Inicial</text>
        <text x="340" y="124" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#0284C7">Líder notifica al supervisor · Se reúne evidencia</text>
      </motion.g>

      <motion.line x1="340" y1="138" x2="340" y2="158" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-gen)" custom={1} variants={lineVariant} initial="hidden" animate="visible"/>

      <motion.g custom={2} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="158" width="320" height="48" rx="8" fill="#ECFEFF" stroke="#67E8F9" strokeWidth="1.5" filter="url(#shadow2)"/>
        <text x="340" y="176" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#0E7490">Acción y Comunicación</text>
        <text x="340" y="194" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#0891B2">Supervisor escala o atiende directamente</text>
      </motion.g>

      <motion.line x1="340" y1="206" x2="340" y2="226" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-gen)" custom={2} variants={lineVariant} initial="hidden" animate="visible"/>

      <motion.g custom={3} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="226" width="320" height="42" rx="8" fill="#FAF5FF" stroke="#D8B4FE" strokeWidth="1.5" filter="url(#shadow2)"/>
        <text x="340" y="244" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#6B21A8">¿Problema resuelto localmente?</text>
      </motion.g>

      <motion.line x1="500" y1="247" x2="554" y2="247" stroke="#22C55E" strokeWidth="1.5" markerEnd="url(#arr-gen)" custom={3} variants={lineVariant} initial="hidden" animate="visible"/>
      <motion.text x="518" y="241" fontSize="11" fontWeight="bold" fill="#16A34A" custom={3} variants={nodeVariant} initial="hidden" animate="visible">SÍ</motion.text>

      <motion.g custom={4} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="554" y="227" width="100" height="40" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" filter="url(#shadow2)"/>
        <text x="604" y="247" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="600" fill="#166534">Documentar</text>
      </motion.g>

      <motion.line x1="340" y1="268" x2="340" y2="288" stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#arr-gen)" custom={3} variants={lineVariant} initial="hidden" animate="visible"/>
      <motion.text x="350" y="281" fontSize="11" fontWeight="bold" fill="#DC2626" custom={3} variants={nodeVariant} initial="hidden" animate="visible">NO</motion.text>

      <motion.g custom={4} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="180" y="288" width="320" height="48" rx="8" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1.5" filter="url(#shadow2)"/>
        <text x="340" y="306" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#BE123C">Escalamiento a Gerencia</text>
        <text x="340" y="324" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#E11D48">Gerencia toma decisión final o acción mayor</text>
      </motion.g>

      <motion.line x1="340" y1="336" x2="340" y2="356" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr-gen)" custom={4} variants={lineVariant} initial="hidden" animate="visible"/>

      <motion.g custom={5} variants={nodeVariant} initial="hidden" animate="visible">
        <rect x="220" y="356" width="240" height="34" rx="17" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" filter="url(#shadow2)"/>
        <text x="340" y="373" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#475569">Caso documentado y cerrado</text>
      </motion.g>
    </svg>
  );

  return (
    <div key={key} className="w-full h-full flex justify-center py-4 bg-white rounded-xl">
      {protocolId === 'luz' ? renderLuzFlow() : renderGenericFlow()}
    </div>
  );
};

export default SvgDiagram;
