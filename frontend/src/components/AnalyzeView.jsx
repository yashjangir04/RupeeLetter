import React, { useState } from 'react';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { analyzeArticle } from '../Api';

const AnalyzeView = ({ theme }) => {
  const [text, setText] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback theme and mode detection
  const activeTheme = theme || { bgBase: '#0f172a', surface: '#1e293b', border: '#334155', accentRed: '#E60000', textMain: '#f8fafc', textMuted: '#94a3b8' };
  const isLightMode = activeTheme.bgBase === "#F8FAFC";

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setReport(null);
    
    try {
      const { data } = await analyzeArticle(text);
      setReport(data.analysis);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Failed to analyze the article. Ensure your backend is running and the API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, padding: '40px', overflowY: 'auto', backgroundColor: activeTheme.bgBase, color: activeTheme.textMain, transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <style>
        {`
          .analyze-input::placeholder {
            color: ${activeTheme.textMuted};
            opacity: 0.7;
            transition: color 0.3s ease;
          }
        `}
      </style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            <Zap color={activeTheme.accentRed} size={28} /> External Article Scorer
          </h2>
          <p style={{ color: activeTheme.textMuted, fontSize: '15px', margin: 0 }}>Paste any external news article below to get an instant sentiment and impact report.</p>
        </header>

        {/* Text Area Input */}
        <textarea 
          className="analyze-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your business news article content here..."
          style={{ 
            width: '100%', 
            height: '240px', 
            backgroundColor: isLightMode ? '#FFFFFF' : activeTheme.surface, 
            border: `1px solid ${isLightMode ? '#CBD5E1' : activeTheme.border}`, 
            borderRadius: '16px', 
            padding: '20px', 
            color: activeTheme.textMain, 
            outline: 'none', 
            marginBottom: '20px',
            resize: 'vertical', 
            fontSize: '15px', 
            lineHeight: '1.7',
            boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.04)' : 'inset 0 2px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
        />

        {/* Action Button */}
        <button 
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          style={{ 
            backgroundColor: activeTheme.accentRed, 
            color: 'white', 
            border: 'none', 
            padding: '14px 28px', 
            borderRadius: '12px', 
            cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer', 
            fontWeight: '600', 
            fontSize: '15px',
            opacity: (loading || !text.trim()) ? 0.6 : 1, 
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: (loading || !text.trim()) ? 'none' : `0 4px 15px ${activeTheme.accentRed}40`
          }}>
          {loading ? 'Analyzing with AI...' : 'Generate Impact Report'}
        </button>

        {/* Error Message Display */}
        {error && (
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: isLightMode ? '#FEF2F2' : 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Results Display */}
        {report && (
          <div style={{ marginTop: '40px', backgroundColor: isLightMode ? '#FFFFFF' : activeTheme.surface, borderRadius: '20px', padding: '35px', border: `1px solid ${isLightMode ? '#E2E8F0' : activeTheme.border}`, boxShadow: isLightMode ? '0 20px 40px -15px rgba(0,0,0,0.05)' : '0 20px 40px -15px rgba(0,0,0,0.5)', transition: 'all 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
              
              {/* Sentiment Card */}
              <div style={{ padding: '24px', backgroundColor: isLightMode ? '#F8FAFC' : activeTheme.bgBase, borderRadius: '16px', borderLeft: `4px solid ${report?.sentiment === 'Bullish' ? '#22c55e' : report?.sentiment === 'Bearish' ? '#ef4444' : activeTheme.textMuted}`, transition: 'all 0.3s ease' }}>
                <div style={{ color: activeTheme.textMuted, fontSize: '12px', marginBottom: '8px', fontWeight: '700', letterSpacing: '1px' }}>MARKET SENTIMENT</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: report?.sentiment === 'Bullish' ? '#22c55e' : report?.sentiment === 'Bearish' ? '#ef4444' : activeTheme.textMain }}>
                  {report?.sentiment || "Neutral"}
                </div>
              </div>

              {/* Impact Score Card */}
              <div style={{ padding: '24px', backgroundColor: isLightMode ? '#F8FAFC' : activeTheme.bgBase, borderRadius: '16px', borderLeft: `4px solid ${activeTheme.accentRed}`, transition: 'all 0.3s ease' }}>
                <div style={{ color: activeTheme.textMuted, fontSize: '12px', marginBottom: '8px', fontWeight: '700', letterSpacing: '1px' }}>IMPACT SCORE</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: activeTheme.accentRed }}>
                  {report?.impactScore ? `${report.impactScore} / 10` : "N/A"}
                </div>
              </div>

            </div>

            {/* Key Takeaways */}
            <div>
              <h4 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px', color: activeTheme.textMain, fontSize: '20px', fontWeight: '700' }}>
                <TrendingUp size={22} color={activeTheme.accentRed} /> Key Takeaways
              </h4>
              <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: '1.9', color: activeTheme.textMuted, fontSize: '16px' }}>
                {(report?.takeaways || []).map((item, i) => (
                  <li key={i} style={{ marginBottom: '12px' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeView;