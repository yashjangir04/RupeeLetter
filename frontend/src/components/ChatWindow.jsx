import React, { useState, useEffect } from "react";
import { Send, ExternalLink, Zap, Loader2, TrendingUp, Lightbulb, BarChart2 } from "lucide-react";
import { sendMessage, analyzeDeepDive, getSession } from "../Api";
import AnalysisModal from "./AnalysisModal";

const ChatWindow = ({ onNewMessage, theme, sessionId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzingIdx, setAnalyzingIdx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  useEffect(() => {
    const loadSessionChats = async () => {
      if (!sessionId) return;
      try {
        const { data } = await getSession(sessionId);
        setMessages(data.success && data.data.length > 0 ? data.data : []);
      } catch (err) {
        console.error(err);
      }
    };
    loadSessionChats();
  }, [sessionId]);

  const submitMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { userMessage: textToSend, aiResponse: "...", role: "temp" }]);
    setLoading(true);
    setInput("");

    try {
      const { data } = await sendMessage(textToSend, sessionId);
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "temp"),
        { userMessage: textToSend, aiResponse: data.answer, sources: data.sources, analysis: null },
      ]);
      if (onNewMessage) onNewMessage();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeepAnalysis = async (msg, index) => {
    if (msg.analysis) {
      setCurrentAnalysis(msg.analysis);
      setIsModalOpen(true);
      return;
    }

    setAnalyzingIdx(index);
    try {
      const { data } = await analyzeDeepDive(msg.aiResponse);
      const updatedMessages = [...messages];
      updatedMessages[index].analysis = data.analysis;
      setMessages(updatedMessages);
      setCurrentAnalysis(data.analysis);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingIdx(null);
    }
  };

  const activeTheme = theme || { bgBase: "#0f172a", surface: "#1e293b", border: "#334155", accentRed: "#E60000", textMain: "#f8fafc", textMuted: "#94a3b8" };
  const isLightMode = activeTheme.bgBase === "#F8FAFC";

  const suggestions = [
    { icon: <TrendingUp size={18} />, text: "What are the top performing NIFTY 50 stocks this week?" },
    { icon: <Lightbulb size={18} />, text: "Explain the difference between Mid-cap and Large-cap stocks." },
    { icon: <BarChart2 size={18} />, text: "Summarize the recent RBI monetary policy updates." },
    { icon: <Zap size={18} />, text: "What is the outlook for the Indian renewable energy sector?" }
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: activeTheme.bgBase, height: '100%', overflow: 'hidden', position: "relative" }}>
      <AnalysisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={currentAnalysis} theme={activeTheme} />

      <style>
        {`
          .theme-input::placeholder { color: ${activeTheme.textMuted}; opacity: 0.7; transition: color 0.3s ease; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: ${activeTheme.border}; border-radius: 10px; transition: background 0.3s ease; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${activeTheme.textMuted}; }
          .custom-scrollbar { scrollbar-width: thin; scrollbar-color: ${activeTheme.border} transparent; }
        `}
      </style>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: "850px", margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
          
          {messages.length === 0 && !loading && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.5s ease" }}>
              <div style={{ backgroundColor: activeTheme.surface, padding: "16px", borderRadius: "20px", marginBottom: "20px", boxShadow: isLightMode ? "0 10px 30px rgba(0,0,0,0.05)" : "0 10px 30px rgba(0,0,0,0.2)" }}>
                <img src={isLightMode ? "/logo.jpg" : "/logo_dark.png"} alt="Logo" style={{ height: "48px", borderRadius: "10px" }} onError={(e) => e.target.style.display = 'none'} />
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: "800", color: activeTheme.textMain, marginBottom: "10px", textAlign: "center", letterSpacing: "-0.5px" }}>How can I help you today?</h2>
              <p style={{ color: activeTheme.textMuted, fontSize: "16px", marginBottom: "40px", textAlign: "center", maxWidth: "500px", lineHeight: "1.5" }}>Ask me about stock updates, financial news, or deep-dive market analysis.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", width: "100%", maxWidth: "700px" }}>
                {suggestions.map((suggestion, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => submitMessage(suggestion.text)} 
                    style={{ backgroundColor: activeTheme.surface, border: `1px solid ${activeTheme.border}`, padding: "16px 20px", borderRadius: "16px", color: activeTheme.textMain, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", textAlign: "left", transition: "all 0.2s ease", boxShadow: isLightMode ? "0 4px 10px rgba(0,0,0,0.03)" : "none" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = activeTheme.accentRed; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = isLightMode ? "0 10px 20px rgba(230,0,0,0.1)" : "0 10px 20px rgba(0,0,0,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = activeTheme.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isLightMode ? "0 4px 10px rgba(0,0,0,0.03)" : "none"; }}
                  >
                    <span style={{ color: activeTheme.accentRed }}>{suggestion.icon}</span>
                    <span style={{ fontSize: "14px", lineHeight: "1.5", color: activeTheme.textMuted }}>{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                <div style={{ backgroundColor: activeTheme.accentRed, color: "#ffffff", padding: "12px 18px", borderRadius: "18px 18px 0 18px", maxWidth: "70%", boxShadow: isLightMode ? "0 4px 10px rgba(230,0,0,0.2)" : "0 4px 10px rgba(0,0,0,0.2)" }}>
                  {m.userMessage}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ backgroundColor: activeTheme.surface, color: activeTheme.textMain, padding: "15px 20px", borderRadius: "18px 18px 18px 0", maxWidth: "85%", lineHeight: "1.6", border: `1px solid ${activeTheme.border}`, boxShadow: isLightMode ? "0 4px 15px rgba(0,0,0,0.03)" : "0 4px 15px rgba(0,0,0,0.1)" }}>
                  {m.aiResponse}

                  {m.sources && m.sources.length > 0 && (
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {m.sources.map((s, si) => (
                        <a 
                          key={si} 
                          href={s.source} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ fontSize: "11px", color: activeTheme.textMain, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", backgroundColor: activeTheme.bgBase, padding: "4px 10px", borderRadius: "6px", border: `1px solid ${activeTheme.border}`, transition: "0.2s ease", opacity: 0.8 }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = activeTheme.accentRed; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.borderColor = activeTheme.border; }}
                        >
                          <ExternalLink size={10} color={activeTheme.accentRed} /> {s.title.substring(0, 25)}...
                        </a>
                      ))}
                    </div>
                  )}

                  {m.role !== "temp" && (
                    <div style={{ marginTop: "15px", borderTop: `1px solid ${activeTheme.border}`, paddingTop: "10px", transition: "border-color 0.3s ease" }}>
                      <button 
                        onClick={() => handleDeepAnalysis(m, i)} 
                        disabled={analyzingIdx !== null && analyzingIdx !== i} 
                        style={{ background: m.analysis ? `${activeTheme.accentRed}15` : "transparent", border: m.analysis ? `1px solid ${activeTheme.accentRed}40` : "1px solid transparent", color: activeTheme.accentRed, cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", padding: m.analysis ? "6px 12px" : "4px 0", borderRadius: "6px", transition: "all 0.2s ease" }}
                      >
                        {analyzingIdx === i ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                        {analyzingIdx === i ? "Analyzing..." : m.analysis ? "View Deep Dive" : "Deep Dive Analysis"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ color: activeTheme.textMuted, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 0" }}>
              <Loader2 size={14} className="animate-spin" /> AI is generating response...
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "20px", borderTop: `1px solid ${activeTheme.border}`, backgroundColor: activeTheme.bgBase }}>
        <form onSubmit={(e) => { e.preventDefault(); submitMessage(input); }} style={{ maxWidth: "850px", margin: "0 auto", display: "flex", gap: "10px", backgroundColor: isLightMode ? "#FFFFFF" : activeTheme.surface, padding: "12px", borderRadius: "20px", border: `1px solid ${isLightMode ? "#CBD5E1" : activeTheme.border}`, boxShadow: isLightMode ? "0 10px 30px rgba(0,0,0,0.08)" : "0 10px 30px rgba(0,0,0,0.3)" }}>
          <input className="theme-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about stock updates or business news..." style={{ flex: 1, background: "transparent", border: "none", color: activeTheme.textMain, outline: "none", fontSize: "15px", padding: "8px 12px" }} />
          <button type="submit" disabled={loading || !input.trim()} style={{ backgroundColor: activeTheme.accentRed, border: "none", padding: "12px 18px", borderRadius: "12px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", opacity: loading || !input.trim() ? 0.5 : 1, transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: loading || !input.trim() ? "none" : `0 4px 10px ${activeTheme.accentRed}40` }}>
            <Send size={18} color="#ffffff" style={{ transform: "translateX(-1px)" }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;