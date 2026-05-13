import React, { useState, useEffect } from "react";
import { getHistory } from "./Api";
import ChatWindow from "./components/ChatWindow";
import AnalyzeView from "./components/AnalyzeView";
import {
  MessageSquare,
  LayoutDashboard,
  Plus,
  History,
  Sun,
  Moon,
} from "lucide-react";

function App() {
  const [view, setView] = useState("chat");
  const [history, setHistory] = useState([]);
  const [sessionId, setSessionId] = useState(Date.now());
  const [isDarkMode, setIsDarkMode] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data } = await getHistory();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleNewChat = () => {
    setSessionId(Date.now());
    setView("chat");
  };

  const darkTheme = {
    bgBase: "#0B1120",
    bgSidebar: "#0F172A",
    surface: "#1E293B",
    border: "#334155",
    accentRed: "#E60000",
    textMain: "#F8FAFC",
    textMuted: "#94A3B8",
  };

  const lightTheme = {
    bgBase: "#F8FAFC", 
    bgSidebar: "#FFFFFF", 
    surface: "#F1F5F9", 
    border: "#E2E8F0", 
    accentRed: "#D90000", 
    textMain: "#0F172A",
    textMuted: "#64748B", 
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: theme.bgBase,
        color: theme.textMain,
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "background-color 0.3s ease",
      }}
    >
      
      {/* SIDEBAR */}
      <div
        style={{
          width: "280px",
          backgroundColor: theme.bgSidebar,
          borderRight: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: isDarkMode
            ? "4px 0 15px rgba(0,0,0,0.2)"
            : "4px 0 15px rgba(0,0,0,0.05)",
          zIndex: 10,
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "24px 20px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "border-color 0.3s ease",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "4px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isDarkMode ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="/logo.jpg"
              alt="RupeeLetter"
              style={{ height: "32px", width: "auto", objectFit: "contain" }}
            />
          </div>
          <span
            style={{
              color: theme.textMain,
              fontWeight: "800",
              fontSize: "20px",
              letterSpacing: "-0.5px",
            }}
          >
            Rupee<span style={{ color: theme.accentRed }}>Letter</span>
          </span>
        </div>

        {/* NEW CHAT BUTTON */}
        <div style={{ padding: "20px 20px 10px 20px" }}>
          <button
            onClick={handleNewChat}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "transparent",
              border: `1px solid ${theme.border}`,
              borderRadius: "10px",
              color: theme.textMain,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accentRed;
              e.currentTarget.style.backgroundColor = isDarkMode
                ? `${theme.accentRed}15`
                : `${theme.accentRed}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Plus size={18} color={theme.accentRed} /> New Chat
          </button>
        </div>

        <nav
          style={{
            padding: "10px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            onClick={() => setView("chat")}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: view === "chat" ? theme.surface : "transparent",
              color: view === "chat" ? theme.textMain : theme.textMuted,
              transition: "all 0.2s ease",
              fontWeight: view === "chat" ? "600" : "400",
            }}
          >
            <MessageSquare
              size={18}
              color={view === "chat" ? theme.accentRed : theme.textMuted}
            />{" "}
            Chat
          </div>
          <div
            onClick={() => setView("analyze")}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor:
                view === "analyze" ? theme.surface : "transparent",
              color: view === "analyze" ? theme.textMain : theme.textMuted,
              transition: "all 0.2s ease",
              fontWeight: view === "analyze" ? "600" : "400",
            }}
          >
            <LayoutDashboard
              size={18}
              color={view === "analyze" ? theme.accentRed : theme.textMuted}
            />{" "}
            Paste & Analyze
          </div>
        </nav>

        {/* HISTORY */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px 20px",
            marginTop: "10px",
            borderTop: `1px solid ${theme.border}`,
            transition: "border-color 0.3s ease",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: theme.textMuted,
              paddingBottom: "12px",
              fontWeight: "700",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <History size={12} /> RECENT SESSIONS
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {history.map((item) => (
              <div
                key={item._id}
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
                }}
                onClick={() => {
                  setSessionId(item._id); // updates the active session
                  setView("chat");        // flips back to chat if they were in Analyze view
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.surface;
                  e.currentTarget.style.color = theme.textMain;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.textMuted;
                }}
              >
                {item.userMessage}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "border-color 0.3s ease",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: theme.textMuted,
              fontWeight: "500",
            }}
          >
            Theme
          </span>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              padding: "6px 12px",
              borderRadius: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: theme.textMain,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accentRed;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border;
            }}
          >
            {isDarkMode ? (
              <Moon size={14} color={theme.accentRed} />
            ) : (
              <Sun size={14} color={theme.accentRed} />
            )}
            <span style={{ fontSize: "12px", fontWeight: "600" }}>
              {isDarkMode ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {view === "chat" ? (
          // We pass down the theme object so ChatWindow can match the colors dynamically
          <ChatWindow
            key={sessionId}
            onNewMessage={fetchHistory}
            theme={theme}
            sessionId={sessionId}
          />
        ) : (
          <AnalyzeView theme={theme} />
        )}
      </div>
    </div>
  );
}

export default App;
