import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, BrainCircuit, Lightbulb, Target, Search } from 'lucide-react';

const AnalysisModal = ({ isOpen, onClose, data, theme }) => {
  if (!data) return null;

  // Fallback theme and mode detection
  const activeTheme = theme || { bgBase: '#0f172a', surface: '#1e293b', border: '#334155', accentRed: '#E60000', textMain: '#f8fafc', textMuted: '#94a3b8' };
  const isLightMode = activeTheme.bgBase === "#F8FAFC";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
            }}
          >
            {/* The Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // prevent clicking inside from closing it
              style={{
                backgroundColor: isLightMode ? '#FFFFFF' : activeTheme.bgBase,
                border: `1px solid ${activeTheme.border}`,
                borderRadius: '20px',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: isLightMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)' : '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                color: activeTheme.textMain,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header */}
              <div style={{ padding: '20px 25px', borderBottom: `1px solid ${activeTheme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(11, 17, 32, 0.9)', backdropFilter: 'blur(10px)', zIndex: 10, borderRadius: '20px 20px 0 0' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: activeTheme.accentRed, fontSize: '18px' }}>
                  <Zap size={20} /> Deep Dive Analysis
                </h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: activeTheme.textMuted, cursor: 'pointer', display: 'flex', padding: '5px', borderRadius: '50%', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = activeTheme.surface} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <X size={20} />
                </button>
              </div>

              {/* Content Body */}
              <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                {/* simplified Breakdown (Highlight Box) */}
                <div style={{ backgroundColor: activeTheme.surface, padding: '15px', borderRadius: '12px', borderLeft: `4px solid ${activeTheme.accentRed}` }}>
                  <h4 style={{ margin: '0 0 8px 0', color: activeTheme.accentRed, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><Target size={16} /> The TL;DR</h4>
                  <p style={{ margin: 0, color: activeTheme.textMain, lineHeight: '1.6' }}>{data.simplifiedBreakdown}</p>
                </div>

                {/* Detailed Explanation */}
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: isLightMode ? '#334155' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={16} /> Detailed Explanation</h4>
                  <p style={{ margin: 0, color: activeTheme.textMuted, lineHeight: '1.7' }}>{data.detailedExplanation}</p>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: isLightMode ? '#334155' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}><Lightbulb size={16} /> Key Insights</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: activeTheme.textMuted, lineHeight: '1.8' }}>
                    {data.keyInsights.map((ins, idx) => <li key={idx}>{ins}</li>)}
                  </ul>
                </div>

                {/* Additional Context */}
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: isLightMode ? '#334155' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}><BrainCircuit size={16} /> Background Context</h4>
                  <p style={{ margin: 0, color: activeTheme.textMuted, lineHeight: '1.7' }}>{data.additionalContext}</p>
                </div>

                {/* Follow Up Questions */}
                <div style={{ borderTop: `1px solid ${activeTheme.border}`, paddingTop: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: activeTheme.accentRed, fontSize: '14px' }}>Suggested Follow-ups</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {data.followUpQuestions.map((q, idx) => (
                      <span key={idx} style={{ backgroundColor: activeTheme.surface, color: activeTheme.textMain, padding: '8px 12px', borderRadius: '8px', fontSize: '13px', border: `1px solid ${activeTheme.border}` }}>
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnalysisModal;