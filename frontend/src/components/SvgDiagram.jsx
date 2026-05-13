import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const nodeVariant = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: custom * 0.09, duration: 0.35 }
  })
};

const lineVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay: custom * 0.09 + 0.1, duration: 0.3 }
  })
};

const sanitizeStep = (value) => {
  if (!value) return 'Paso sin descripción';
  return String(value).trim().replace(/^Paso\s*\d+\s*[:\-]\s*/i, '');
};

export default function SvgDiagram({ protocol }) {
  const title = protocol?.name || 'Protocolo';
  const trigger = protocol?.trigger || 'Sin detonante definido';
  const rawSteps = Array.isArray(protocol?.textSteps) ? protocol.textSteps : [];

  const steps = useMemo(() => {
    const parsed = rawSteps.map(sanitizeStep).filter(Boolean);
    return parsed.length ? parsed : ['Registrar incidencia', 'Notificar al responsable', 'Documentar y cerrar'];
  }, [rawSteps]);

  const layout = useMemo(() => {
    const maxSteps = 10;
    const visibleSteps = steps.slice(0, maxSteps);
    const baseY = 120;
    const stepGap = 82;
    const finalY = baseY + visibleSteps.length * stepGap;
    const height = Math.max(420, finalY + 120);

    return { visibleSteps, baseY, stepGap, finalY, height };
  }, [steps]);

  return (
    <div className="w-full h-full flex justify-center py-4 bg-white rounded-xl">
      <svg width="100%" viewBox={`0 0 900 ${layout.height}`} className="max-w-4xl mx-auto drop-shadow-sm font-body">
        <defs>
          <marker id="arr-dyn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        <motion.text x="450" y="30" textAnchor="middle" fontSize="19" fontWeight="700" fill="#164E63" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {title}
        </motion.text>

        <motion.g custom={0} variants={nodeVariant} initial="hidden" animate="visible">
          <rect x="120" y="48" width="660" height="48" rx="14" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1.6" />
          <text x="450" y="68" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill="#9A3412">
            Situación detonante
          </text>
          <text x="450" y="84" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#C2410C">
            {trigger.length > 88 ? `${trigger.slice(0, 88)}...` : trigger}
          </text>
        </motion.g>

        <motion.line
          x1="450"
          y1="96"
          x2="450"
          y2={layout.baseY - 16}
          stroke="#94A3B8"
          strokeWidth="1.8"
          markerEnd="url(#arr-dyn)"
          custom={0}
          variants={lineVariant}
          initial="hidden"
          animate="visible"
        />

        {layout.visibleSteps.map((step, idx) => {
          const y = layout.baseY + idx * layout.stepGap;
          const nodeColor = idx % 2 === 0
            ? { fill: '#ECFEFF', stroke: '#67E8F9', title: '#155E75', body: '#0E7490' }
            : { fill: '#F0F9FF', stroke: '#93C5FD', title: '#1E3A8A', body: '#1D4ED8' };

          return (
            <g key={`flow-step-${idx}`}>
              <motion.g custom={idx + 1} variants={nodeVariant} initial="hidden" animate="visible">
                <rect x="140" y={y} width="620" height="54" rx="10" fill={nodeColor.fill} stroke={nodeColor.stroke} strokeWidth="1.5" />
                <circle cx="172" cy={y + 27} r="16" fill="#ffffff" stroke={nodeColor.stroke} strokeWidth="1.4" />
                <text x="172" y={y + 27} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="700" fill={nodeColor.title}>
                  {idx + 1}
                </text>
                <text x="205" y={y + 27} dominantBaseline="central" fontSize="12" fill={nodeColor.body}>
                  {step.length > 84 ? `${step.slice(0, 84)}...` : step}
                </text>
              </motion.g>

              {idx < layout.visibleSteps.length - 1 ? (
                <motion.line
                  x1="450"
                  y1={y + 54}
                  x2="450"
                  y2={y + layout.stepGap - 14}
                  stroke="#94A3B8"
                  strokeWidth="1.6"
                  markerEnd="url(#arr-dyn)"
                  custom={idx + 1}
                  variants={lineVariant}
                  initial="hidden"
                  animate="visible"
                />
              ) : null}
            </g>
          );
        })}

        <motion.line
          x1="450"
          y1={layout.finalY + 54}
          x2="450"
          y2={layout.finalY + 76}
          stroke="#94A3B8"
          strokeWidth="1.6"
          markerEnd="url(#arr-dyn)"
          custom={layout.visibleSteps.length + 2}
          variants={lineVariant}
          initial="hidden"
          animate="visible"
        />

        <motion.g custom={layout.visibleSteps.length + 3} variants={nodeVariant} initial="hidden" animate="visible">
          <rect x="280" y={layout.finalY + 76} width="340" height="44" rx="22" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.6" />
          <text x="450" y={layout.finalY + 98} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill="#166534">
            Cierre y documentación
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
