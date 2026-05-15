import React, { useState, useEffect } from "react";
import { getHistory } from "./Api";
import ChatWindow from "./components/ChatWindow";
import AnalyzeView from "./components/AnalyzeView";
import { MessageSquare, LayoutDashboard, Plus, History, Sun, Moon, Menu, X } from "lucide-react";

function App() {
  const [view, setView] = useState("chat");
  const [history, setHistory] = useState([]);
  const [sessionId, setSessionId] = useState(Date.now());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await getHistory();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleNav = (newView, newSessionId = null) => {
    if (newSessionId) setSessionId(newSessionId);
    setView(newView);
    setIsSidebarOpen(false);
  };

  const theme = isDarkMode 
    ? { bgBase: "#0B1120", bgSidebar: "#0F172A", surface: "#1E293B", border: "#334155", accentRed: "#E60000", textMain: "#F8FAFC", textMuted: "#94A3B8" }
    : { bgBase: "#F8FAFC", bgSidebar: "#FFFFFF", surface: "#F1F5F9", border: "#E2E8F0", accentRed: "#D90000", textMain: "#0F172A", textMuted: "#64748B" };

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "100vh", backgroundColor: theme.bgBase, color: theme.textMain, fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>
      
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; transition: background 0.3s ease; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${theme.textMuted}; }
          .custom-scrollbar { scrollbar-width: thin; scrollbar-color: ${theme.border} transparent; }

          @keyframes slideInDown {
            0% { opacity: 0; transform: translateY(-15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {isMobile && (
        <div style={{ height: "60px", backgroundColor: theme.bgSidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={isDarkMode ? "/logo_dark.png" : "/logo.jpg"} alt="Logo" style={{ height: "24px" }} />
            <span style={{ fontWeight: "800", fontSize: "18px" }}>Rupee<span style={{ color: theme.accentRed }}>Letter</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} style={{ background: "none", border: "none", color: theme.textMain }}>
            <Menu size={24} />
          </button>
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 45 }} />
      )}

      <div style={{ position: isMobile ? "fixed" : "relative", top: 0, left: isMobile ? (isSidebarOpen ? "0" : "-300px") : "0", height: "100vh", width: "280px", backgroundColor: theme.bgSidebar, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", zIndex: 50, transition: "left 0.3s ease" }}>
        
        <div style={{ padding: "24px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ backgroundColor: isDarkMode ? "transparent" : "white", padding: "4px", borderRadius: "8px", display: "flex" }}>
              <img src={isDarkMode ? "/logo_dark.png" : "/logo.jpg"} alt="Logo" style={{ height: "32px" }} />
            </div>
            <span style={{ fontWeight: "800", fontSize: "20px" }}>Rupee<span style={{ color: theme.accentRed }}>Letter</span></span>
          </div>
          {isMobile && <button onClick={() => setIsSidebarOpen(false)} style={{ background: "none", border: "none", color: theme.textMuted }}><X size={20} /></button>}
        </div>

        <div style={{ padding: "20px" }}>
          <button 
            onClick={() => { setSessionId(Date.now()); handleNav("chat"); }} 
            style={{ width: "100%", padding: "12px", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.textMain, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accentRed; e.currentTarget.style.backgroundColor = isDarkMode ? `${theme.accentRed}15` : `${theme.accentRed}10`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <Plus size={18} color={theme.accentRed} /> New Chat
          </button>
        </div>

        <nav style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div 
            onClick={() => handleNav("chat")} 
            style={{ padding: "12px 16px", cursor: "pointer", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px", backgroundColor: view === "chat" ? theme.surface : "transparent", fontWeight: view === "chat" ? "600" : "400", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { if (view !== "chat") e.currentTarget.style.backgroundColor = theme.surface; }}
            onMouseLeave={(e) => { if (view !== "chat") e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <MessageSquare size={18} color={view === "chat" ? theme.accentRed : theme.textMuted} /> Chat
          </div>
          <div 
            onClick={() => handleNav("analyze")} 
            style={{ padding: "12px 16px", cursor: "pointer", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px", backgroundColor: view === "analyze" ? theme.surface : "transparent", fontWeight: view === "analyze" ? "600" : "400", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { if (view !== "analyze") e.currentTarget.style.backgroundColor = theme.surface; }}
            onMouseLeave={(e) => { if (view !== "analyze") e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <LayoutDashboard size={18} color={view === "analyze" ? theme.accentRed : theme.textMuted} /> Paste & Analyze
          </div>
        </nav>

        <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "20px", marginTop: "10px", borderTop: `1px solid ${theme.border}`, paddingRight: "14px" }}>
          <div style={{ fontSize: "11px", color: theme.textMuted, paddingBottom: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
            <History size={12} /> RECENT SESSIONS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {history.map((item) => (
              <div 
                key={item._id} 
                onClick={() => handleNav("chat", item._id)} 
                style={{ 
                  padding: "10px 12px", 
                  fontSize: "13px", 
                  color: theme.textMuted, 
                  cursor: "pointer", 
                  borderRadius: "8px", 
                  whiteSpace: "nowrap", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  transition: "all 0.2s ease",
                  animation: "slideInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" 
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.surface; e.currentTarget.style.color = theme.textMain; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = theme.textMuted; }}
              >
                {item.userMessage}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", color: theme.textMuted, fontWeight: "500" }}>Theme</span>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            style={{ background: theme.surface, border: `1px solid ${theme.border}`, padding: "6px 12px", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: theme.textMain, transition: "all 0.3s ease" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.accentRed}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
          >
            {isDarkMode ? <Moon size={14} color={theme.accentRed} /> : <Sun size={14} color={theme.accentRed} />}
            <span style={{ fontSize: "12px", fontWeight: "600" }}>{isDarkMode ? "Dark" : "Light"}</span>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: isMobile ? "calc(100vh - 60px)" : "100vh", overflow: "hidden" }}>
        {view === "chat" ? <ChatWindow key={sessionId} onNewMessage={fetchHistory} theme={theme} sessionId={sessionId} /> : <AnalyzeView theme={theme} />}
      </div>

    </div>
  );
}

export default App;