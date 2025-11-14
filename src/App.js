import React, { useState, useEffect } from "react";
import {
  Camera,
  Plus,
  Clock,
  LogOut,
  ChevronRight,
  BookOpen,
  Award,
  BarChart3,
  ChevronLeft,
  TrendingUp,
  Calendar,
  Target,
  Mic,
  MessageSquare,
  Eye,
  Trash2,
  Play,
  Moon,
  Sun,
  Settings,
  User,
  Trophy,
  Flame,
  Star,
  CheckCircle,
  Circle,
  FileText,
  Download,
  Share2,
  Youtube,
  ExternalLink,
  Zap,
  Briefcase,
  Code,
  Brain,
  Home,
  LineChart,
  GraduationCap,
  Edit,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "./config";

/*
  Combined single-file React app (InterviewMate)
  - Drop this file into src/App.js of a create-react-app project
  - Run `npm install lucide-react` and `npm start`
  - Data persists in localStorage (demo mode)
*/

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("login");
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("mockUser");
    const storedInterviews = localStorage.getItem("interviews");
    const storedTheme = localStorage.getItem("theme");
    const storedProfile = localStorage.getItem("userProfile");
    const storedAchievements = localStorage.getItem("achievements");
    const storedStreak = localStorage.getItem("streak");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView("dashboard");
    }

    if (storedInterviews) {
      setInterviews(JSON.parse(storedInterviews));
    }

    if (storedTheme === "dark") {
      setDarkMode(true);
    }

    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }

    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    } else {
      const initialAchievements = [
        {
          id: 1,
          name: "First Interview",
          description: "Complete your first interview",
          icon: "🎯",
          unlocked: false,
        },
        {
          id: 2,
          name: "5 Interviews",
          description: "Complete 5 interviews",
          icon: "🔥",
          unlocked: false,
        },
        {
          id: 3,
          name: "Perfect Score",
          description: "Score 100% in an interview",
          icon: "⭐",
          unlocked: false,
        },
        {
          id: 4,
          name: "Week Streak",
          description: "Practice for 7 days straight",
          icon: "📅",
          unlocked: false,
        },
        {
          id: 5,
          name: "Night Owl",
          description: "Complete an interview after 10 PM",
          icon: "🦉",
          unlocked: false,
        },
        {
          id: 6,
          name: "Early Bird",
          description: "Complete an interview before 7 AM",
          icon: "🌅",
          unlocked: false,
        },
      ];
      setAchievements(initialAchievements);
      localStorage.setItem("achievements", JSON.stringify(initialAchievements));
    }

    if (storedStreak) {
      setStreak(parseInt(storedStreak));
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#1a202c";
    } else {
      document.body.style.backgroundColor = "#F7FAFC";
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("mockUser");
    setUser(null);
    setCurrentView("login");
    setInterviews([]);
  };

  const updateInterviews = (newInterviews) => {
    setInterviews(newInterviews);
    localStorage.setItem("interviews", JSON.stringify(newInterviews));
    checkAchievements(newInterviews);
  };

  const checkAchievements = (interviewList) => {
    const completed = interviewList.filter(
      (i) => i.status === "completed"
    ).length;
    const newAchievements = [...achievements];

    if (completed >= 1 && newAchievements[0] && !newAchievements[0].unlocked) {
      newAchievements[0].unlocked = true;
    }
    if (completed >= 5 && newAchievements[1] && !newAchievements[1].unlocked) {
      newAchievements[1].unlocked = true;
    }

    const perfectScore = interviewList.some((i) => i.score === 100);
    if (perfectScore && newAchievements[2] && !newAchievements[2].unlocked) {
      newAchievements[2].unlocked = true;
    }

    setAchievements(newAchievements);
    localStorage.setItem("achievements", JSON.stringify(newAchievements));
  };

  if (!user) {
    return (
      <AuthScreen
        setUser={setUser}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
      />
    );
  }

  const theme = {
    bg: darkMode ? "#1a202c" : "#F7FAFC",
    cardBg: darkMode ? "#2d3748" : "white",
    text: darkMode ? "#f7fafc" : "#1A202C",
    textSecondary: darkMode ? "#a0aec0" : "#4A5568",
    border: darkMode ? "#4a5568" : "#E2E8F0",
    inputBg: darkMode ? "#1a202c" : "white",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.bg,
        transition: "all 0.3s",
      }}
    >
      <Header
        user={user}
        handleLogout={handleLogout}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        theme={theme}
        setCurrentView={setCurrentView}
        currentView={currentView}
        streak={streak}
      />

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}
      >
        {currentView === "dashboard" && (
          <Dashboard
            interviews={interviews}
            setCurrentView={setCurrentView}
            setSelectedInterview={setSelectedInterview}
            updateInterviews={updateInterviews}
            theme={theme}
            achievements={achievements}
            streak={streak}
          />
        )}
        {currentView === "create" && (
          <CreateInterview
            setCurrentView={setCurrentView}
            interviews={interviews}
            setInterviews={updateInterviews}
            user={user}
            theme={theme}
          />
        )}
        {currentView === "details" && selectedInterview && (
          <InterviewDetails
            interview={selectedInterview}
            setCurrentView={setCurrentView}
            interviews={interviews}
            updateInterviews={updateInterviews}
            theme={theme}
          />
        )}
        {currentView === "start" && selectedInterview && (
          <StartInterview
            interview={selectedInterview}
            setCurrentView={setCurrentView}
            interviews={interviews}
            updateInterviews={updateInterviews}
            theme={theme}
            setSelectedInterview={setSelectedInterview}
          />
        )}
        {currentView === "analytics" && (
          <Analytics
            interviews={interviews}
            theme={theme}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === "templates" && (
          <Templates
            setCurrentView={setCurrentView}
            setInterviews={updateInterviews}
            interviews={interviews}
            user={user}
            theme={theme}
          />
        )}
        {currentView === "checklist" && (
          <Checklist theme={theme} setCurrentView={setCurrentView} />
        )}
        {currentView === "resources" && (
          <Resources theme={theme} setCurrentView={setCurrentView} />
        )}
        {currentView === "achievements" && (
          <Achievements
            achievements={achievements}
            theme={theme}
            setCurrentView={setCurrentView}
            streak={streak}
          />
        )}
        {currentView === "settings" && (
          <SettingsPage
            theme={theme}
            setCurrentView={setCurrentView}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            user={user}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------- Header ---------------------- */
function Header({
  user,
  handleLogout,
  darkMode,
  toggleTheme,
  theme,
  setCurrentView,
  currentView,
  streak,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "analytics", label: "Analytics", icon: <LineChart size={18} /> },
    { id: "templates", label: "Templates", icon: <Briefcase size={18} /> },
    { id: "checklist", label: "Checklist", icon: <CheckCircle size={18} /> },
    { id: "resources", label: "Resources", icon: <GraduationCap size={18} /> },
    { id: "achievements", label: "Achievements", icon: <Trophy size={18} /> },
  ];

  return (
    <div
      style={{
        backgroundColor: theme.cardBg,
        boxShadow: darkMode
          ? "0 1px 3px rgba(0,0,0,0.3)"
          : "0 1px 3px rgba(0,0,0,0.1)",
        borderBottom: `1px solid ${theme.border}`,
        transition: "all 0.3s",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => setCurrentView("dashboard")}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 6px rgba(102, 126, 234, 0.4)",
                }}
              >
                <Camera size={24} color="white" />
              </div>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: theme.text,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                InterviewMate
              </span>
            </div>

            <nav style={{ display: "flex", gap: "4px" }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    backgroundColor:
                      currentView === item.id
                        ? darkMode
                          ? "#4a5568"
                          : "#EBF8FF"
                        : "transparent",
                    color:
                      currentView === item.id ? "#667eea" : theme.textSecondary,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (currentView !== item.id) {
                      e.currentTarget.style.backgroundColor = darkMode
                        ? "#2d3748"
                        : "#F7FAFC";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentView !== item.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {streak > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  backgroundColor: darkMode ? "#4a5568" : "#FFF5F0",
                  borderRadius: "20px",
                }}
              >
                <Flame size={16} color="#F56565" />
                <span
                  style={{
                    fontSize: "14px",
                    color: theme.text,
                    fontWeight: "600",
                  }}
                >
                  {streak} day streak
                </span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                backgroundColor: darkMode ? "#4a5568" : "#F7FAFC",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: theme.text,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setCurrentView("settings")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                backgroundColor:
                  currentView === "settings"
                    ? darkMode
                      ? "#4a5568"
                      : "#EBF8FF"
                    : darkMode
                    ? "#4a5568"
                    : "#F7FAFC",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: currentView === "settings" ? "#667eea" : theme.text,
                transition: "all 0.2s",
              }}
            >
              <Settings size={18} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                backgroundColor: darkMode ? "#4a5568" : "#EBF8FF",
                borderRadius: "20px",
              }}
            >
              <User size={16} color="#667eea" />
              <span
                style={{
                  fontSize: "14px",
                  color: theme.text,
                  fontWeight: "500",
                }}
              >
                {user.displayName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                color: theme.textSecondary,
                backgroundColor: "transparent",
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode
                  ? "#2d3748"
                  : "#F7FAFC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- AuthScreen ---------------------- */
function AuthScreen({ setUser, setCurrentView, darkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (!isLogin && !name.trim()) {
        setError("Please enter your full name");
        setLoading(false);
        return;
      }

      const user = {
        email,
        uid: Date.now().toString(),
        displayName: name || email.split("@")[0],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("mockUser", JSON.stringify(user));
      setUser(user);
      setCurrentView("dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
        }}
      >
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 300 + 50 + "px",
              height: Math.random() * 300 + 50 + "px",
              borderRadius: "50%",
              background: "white",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animation: `float ${
                Math.random() * 10 + 5
              }s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(20px); }
          }
        `}
      </style>

      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              background: "white",
              borderRadius: "20px",
              marginBottom: "16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            }}
          >
            <Camera size={36} color="#667eea" />
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "8px",
            }}
          >
            InterviewMate
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.95)",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            Master Your Interview Skills with AI
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            padding: "28px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1A202C",
              marginBottom: "18px",
              textAlign: "center",
            }}
          >
            {isLogin ? "Welcome Back!" : "Join InterviewMate"}
          </h2>

          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#FFF5F5",
                border: "1px solid #FC8181",
                color: "#C53030",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {!isLogin && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#2D3748",
                    marginBottom: "8px",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2D3748",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2D3748",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading
                  ? "#A0AEC0"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "600",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
              }}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div style={{ marginTop: "18px", textAlign: "center" }}>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              style={{
                fontSize: "14px",
                color: "#667eea",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p
          style={{
            marginTop: "14px",
            textAlign: "center",
            fontSize: "13px",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          🔒 Demo version - Data stored locally in your browser
        </p>
      </div>
    </div>
  );
}

/* ---------------------- Dashboard ---------------------- */
function Dashboard({
  interviews,
  setCurrentView,
  setSelectedInterview,
  updateInterviews,
  theme,
  achievements,
  streak,
}) {
  const stats = {
    total: interviews.length,
    completed: interviews.filter((i) => i.status === "completed").length,
    pending: interviews.filter((i) => i.status === "pending").length,
    avgScore:
      interviews.filter((i) => i.score > 0).length > 0
        ? Math.round(
            interviews.reduce((acc, i) => acc + (i.score || 0), 0) /
              interviews.filter((i) => i.score > 0).length
          )
        : 0,
  };

  const unlockedAchievements = achievements
    ? achievements.filter((a) => a.unlocked).length
    : 0;

  const handleDelete = (interviewId) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      const updated = interviews.filter((i) => i.id !== interviewId);
      updateInterviews(updated);
    }
  };

  const handleView = (interview) => {
    setSelectedInterview(interview);
    setCurrentView("details");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "700",
              color: theme.text,
              marginBottom: "6px",
            }}
          >
            Welcome back,{" "}
            {localStorage.getItem("mockUser")
              ? JSON.parse(localStorage.getItem("mockUser")).displayName
              : "User"}
            ! 👋
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: "15px" }}>
            Ready to ace your next interview? Let's practice!
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => setCurrentView("templates")}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid " + theme.border,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Templates
          </button>
          <button
            onClick={() => setCurrentView("analytics")}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid " + theme.border,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Analytics
          </button>
          <button
            onClick={() => setCurrentView("create")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "12px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {" "}
            <Plus size={18} /> Create Interview
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >
        <StatCard
          title="Total Interviews"
          value={stats.total}
          icon={<BookOpen size={24} color="#667eea" />}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<Award size={24} color="#38A169" />}
          gradient="linear-gradient(135deg, #38A169 0%, #2F855A 100%)"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock size={24} color="#ED8936" />}
          gradient="linear-gradient(135deg, #ED8936 0%, #DD6B20 100%)"
        />
        <StatCard
          title="Avg Score"
          value={`${stats.avgScore}%`}
          icon={<TrendingUp size={24} color="#805AD5" />}
          gradient="linear-gradient(135deg, #805AD5 0%, #6B46C1 100%)"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "18px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: "12px",
            overflow: "hidden",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              padding: "18px",
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <h2
              style={{ fontSize: "18px", fontWeight: "700", color: theme.text }}
            >
              Recent Interviews
            </h2>
          </div>

          {interviews.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#F7FAFC",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <BookOpen size={32} color="#A0AEC0" />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: theme.text,
                }}
              >
                No interviews yet
              </h3>
              <p style={{ color: theme.textSecondary }}>
                Create your first mock interview to get started
              </p>
              <div style={{ marginTop: "12px" }}>
                <button
                  onClick={() => setCurrentView("create")}
                  style={{
                    padding: "10px 18px",
                    background:
                      "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Create Interview
                </button>
              </div>
            </div>
          ) : (
            <div>
              {interviews
                .slice()
                .reverse()
                .map((interview, idx) => (
                  <div
                    key={interview.id}
                    style={{
                      padding: "16px",
                      borderTop: idx > 0 ? `1px solid ${theme.border}` : "none",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: 6,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 16,
                            fontWeight: 700,
                            color: theme.text,
                          }}
                        >
                          {interview.role}
                        </h3>
                        <span
                          style={{
                            padding: "4px 10px",
                            backgroundColor:
                              interview.status === "completed"
                                ? "#C6F6D5"
                                : "#FED7D7",
                            color:
                              interview.status === "completed"
                                ? "#22543D"
                                : "#742A2A",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {interview.status}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          color: theme.textSecondary,
                          fontSize: 13,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Clock size={14} />{" "}
                          <span>{interview.duration} min</span>
                        </div>
                        <div>•</div>
                        <div style={{ textTransform: "capitalize" }}>
                          {interview.difficulty}
                        </div>
                        <div>•</div>
                        <div style={{ textTransform: "capitalize" }}>
                          {interview.type}
                        </div>
                        <div>•</div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Calendar size={14} /> <span>{interview.date}</span>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        {interview.technologies &&
                          interview.technologies.map((t, i) => (
                            <span
                              key={i}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#EBF8FF",
                                color: "#2C5282",
                                borderRadius: 999,
                                fontSize: 13,
                              }}
                            >
                              {t}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <button
                        onClick={() => {
                          setSelectedInterview(interview);
                          setCurrentView("details");
                        }}
                        style={{
                          padding: "8px 14px",
                          background: "#667eea",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Delete interview?")) {
                            const upd = interviews.filter(
                              (i) => i.id !== interview.id
                            );
                            updateInterviews(upd);
                          }
                        }}
                        style={{
                          padding: "8px 14px",
                          background: "#FFF5F5",
                          color: "#E53E3E",
                          border: "1px solid #FEB2B2",
                          borderRadius: 8,
                        }}
                      >
                        {" "}
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 18,
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              fontSize: 16,
              fontWeight: 700,
              color: theme.text,
            }}
          >
            Achievements
          </h3>
          <p style={{ color: theme.textSecondary, marginTop: 6 }}>
            {unlockedAchievements} / {achievements.length} unlocked
          </p>
          <div
            style={{
              width: "100%",
              height: 10,
              backgroundColor: theme.border,
              borderRadius: 8,
              overflow: "hidden",
              marginTop: 12,
            }}
          >
            <div
              style={{
                width: `${
                  achievements.length
                    ? (unlockedAchievements / achievements.length) * 100
                    : 0
                }%`,
                height: "100%",
                background: "linear-gradient(90deg,#F6AD55,#ED8936)",
              }}
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            {achievements.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: 8,
                  background: theme.inputBg,
                  borderRadius: 8,
                  opacity: a.unlocked ? 1 : 0.6,
                }}
              >
                <div style={{ fontSize: 20 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: theme.text }}>
                    {a.name}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: 13 }}>
                    {a.description}
                  </div>
                </div>
                {a.unlocked && (
                  <div style={{ color: "#48BB78", fontWeight: 700 }}>
                    Unlocked
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
            <button
              onClick={() => setCurrentView("achievements")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                background: "transparent",
              }}
            >
              View All
            </button>
            <button
              onClick={() => setCurrentView("checklist")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                color: "white",
                border: "none",
              }}
            >
              Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- StatCard ---------------------- */
function StatCard({ title, value, icon, gradient }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "#4A5568" }}>{title}</p>
          <p
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
              color: "#1A202C",
            }}
          >
            {value}
          </p>
        </div>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- CreateInterview ---------------------- */
function CreateInterview({
  setCurrentView,
  interviews,
  setInterviews,
  user,
  theme,
}) {
  const [formData, setFormData] = useState({
    role: "",
    experience: "beginner",
    type: "technical",
    difficulty: "easy",
    duration: "30",
    technologies: [],
    focus: "",
  });
  const [techInput, setTechInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.role.trim()) {
      alert("Please enter a job role");
      return;
    }

    const newInterview = {
      id: Date.now().toString(),
      ...formData,
      status: "pending",
      date: new Date().toLocaleDateString(),
      userId: user.uid,
      score: 0,
    };

    const updatedInterviews = [...interviews, newInterview];
    setInterviews(updatedInterviews);
    setCurrentView("dashboard");
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTechnology = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 18 }}>
        <button
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#4A5568",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>
          Create New Interview
        </h1>
        <p style={{ color: theme.textSecondary }}>
          Customize your mock interview session
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: theme.cardBg,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          padding: 20,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FormField label="Job Role / Position" required>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              style={inputStyle}
              placeholder="e.g., Software Engineer"
            />
          </FormField>

          <FormField label="Experience Level" required>
            <select
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              style={inputStyle}
            >
              <option value="beginner">Beginner (0-2 years)</option>
              <option value="intermediate">Intermediate (2-5 years)</option>
              <option value="advanced">Advanced (5+ years)</option>
            </select>
          </FormField>

          <FormField label="Interview Type" required>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              style={inputStyle}
            >
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="mixed">Mixed</option>
            </select>
          </FormField>

          <FormField label="Difficulty Level" required>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              style={inputStyle}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </FormField>

          <FormField label="Duration (minutes)" required>
            <select
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              style={inputStyle}
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
            </select>
          </FormField>

          <FormField label="Technologies / Skills">
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="e.g., React, Python, DSA"
              />
              <button
                type="button"
                onClick={addTechnology}
                style={{
                  padding: "8px 16px",
                  background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                }}
              >
                Add
              </button>
            </div>
            {formData.technologies.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {formData.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      background: "#EBF8FF",
                      color: "#2C5282",
                      borderRadius: 999,
                    }}
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FormField>

          <FormField label="Focus Areas (Optional)">
            <textarea
              value={formData.focus}
              onChange={(e) =>
                setFormData({ ...formData, focus: e.target.value })
              }
              rows={4}
              style={{ ...inputStyle, minHeight: 90 }}
              placeholder="e.g., System Design, Problem-Solving"
            />
          </FormField>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                color: "white",
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
              }}
            >
              Create Interview
            </button>
            <button
              type="button"
              onClick={() => setCurrentView("dashboard")}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                background: "transparent",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------------------- Reusable FormField & styles ---------------------- */
function FormField({ label, required, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 600,
          color: "#2D3748",
          marginBottom: 8,
        }}
      >
        {label} {required && <span style={{ color: "#E53E3E" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #CBD5E0",
  borderRadius: 8,
  fontSize: 15,
};

/* ---------------------- InterviewDetails ---------------------- */
function InterviewDetails({
  interview,
  setCurrentView,
  interviews,
  updateInterviews,
  theme,
}) {
  const handleStart = () => {
    setCurrentView("start");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      const updated = interviews.filter((i) => i.id !== interview.id);
      updateInterviews(updated);
      setCurrentView("dashboard");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#4A5568",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${theme.border}`,
          background: theme.cardBg,
        }}
      >
        <div
          style={{
            padding: 24,
            background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 26 }}>{interview.role}</h1>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 8,
                  opacity: 0.95,
                }}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {interview.type} Interview
                </span>
                <span>•</span>
                <span style={{ textTransform: "capitalize" }}>
                  {interview.difficulty}
                </span>
              </div>
            </div>
            <div>
              <span
                style={{
                  padding: "6px 12px",
                  backgroundColor:
                    interview.status === "completed"
                      ? "#22543D"
                      : "rgba(255,255,255,0.15)",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {interview.status}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <InfoCard
              icon={<Target size={18} />}
              title="Experience Level"
              value={interview.experience}
            />
            <InfoCard
              icon={<Calendar size={18} />}
              title="Created On"
              value={interview.date}
            />
            <InfoCard
              icon={<Award size={18} />}
              title="Score"
              value={interview.score ? `${interview.score}%` : "Not completed"}
            />
          </div>

          {interview.technologies && interview.technologies.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                Technologies & Skills
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {interview.technologies.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "6px 10px",
                      background: "#EBF8FF",
                      color: "#2C5282",
                      borderRadius: 999,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interview.focus && (
            <div style={{ marginBottom: 18 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                Focus Areas
              </h3>
              <p style={{ color: theme.textSecondary }}>{interview.focus}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {interview.status === "pending" && (
              <button
                onClick={handleStart}
                style={{
                  padding: "10px 14px",
                  background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                }}
              >
                {" "}
                <Play size={16} /> Start Interview
              </button>
            )}
            <button
              onClick={handleDelete}
              style={{
                padding: "10px 14px",
                background: "#FFF5F5",
                color: "#E53E3E",
                border: "1px solid #FEB2B2",
                borderRadius: 8,
              }}
            >
              {" "}
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- InfoCard ---------------------- */
function InfoCard({ icon, title, value }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        background: "#F7FAFC",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EBF8FF",
          color: "#667eea",
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#718096" }}>{title}</div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1A202C",
            textTransform: "capitalize",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- StartInterview ---------------------- */
function StartInterview({
  interview,
  setCurrentView,
  interviews,
  updateInterviews,
  theme,
  setSelectedInterview,
}) {
  console.log(
    "Gemini API Key Loaded:",
    !!(config.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY)
  );
  console.log(
    "API Key source:",
    config.GEMINI_API_KEY ? "config.js" : "environment"
  );

  const [mode, setMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const startInterview = (selectedMode) => {
    setMode(selectedMode);
    const welcomeMessage = {
      role: "assistant",
      content: `Hello! Welcome to your ${interview.type} interview for the ${interview.role} position. I'll be conducting this ${interview.duration}-minute interview session. Let's begin with your introduction. Please tell me about yourself.`,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      const API_KEY =
        config.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;

      if (!API_KEY) {
        throw new Error(
          "Gemini API key not configured. Please add your API key to src/config.js"
        );
      }

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(API_KEY);

      // ✅ FIX: Use a VALID model only
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash",
      });

      const conversationHistory = messages
        .map(
          (m) =>
            `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${
              m.content
            }`
        )
        .join("\n");

      const prompt = `You are a professional interview coach conducting a ${
        interview.type
      } interview for a ${interview.role} role at ${
        interview.difficulty
      } difficulty level.

Interview Context:
- Role: ${interview.role}
- Type: ${interview.type}
- Difficulty: ${interview.difficulty}
- Technologies: ${interview.technologies?.join(", ") || "General"}
- Duration: ${interview.duration} minutes

Instructions:
- Ask ONE relevant interview question at a time
- Provide constructive feedback on answers
- Keep tone professional yet supportive
- Evaluate based on the difficulty level

Previous Conversation:
${conversationHistory}

Candidate's Latest Response: ${currentInput}

Your response (ask next question or provide feedback):`;

      const result = await model.generateContent(prompt);

      const text = result.response.text();

      const assistantMessage = {
        role: "assistant",
        content:
          text || "Sorry, I didn't catch that. Could you please elaborate?",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching Gemini response:", error);

      let errorMessage = "There was a problem connecting to the AI. ";

      if (error.message?.includes("API key")) {
        errorMessage += "Please check your API key configuration.";
      } else if (
        error.message?.includes("quota") ||
        error.message?.includes("429")
      ) {
        errorMessage += "API quota exceeded. Please try again later.";
      } else if (
        error.message?.includes("not found") ||
        error.message?.includes("404")
      ) {
        errorMessage +=
          "Model not available. Your API key may not have access to Gemini models yet.";
      } else if (error.message?.includes("permission")) {
        errorMessage +=
          "Permission denied. Please enable the Generative Language API in Google Cloud Console.";
      } else {
        errorMessage += `Error: ${error.message}`;
      }

      const errorMsg = {
        role: "assistant",
        content: errorMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const completeInterview = () => {
    const score = Math.floor(Math.random() * 31) + 70;
    const updatedInterviews = interviews.map((i) =>
      i.id === interview.id ? { ...i, status: "completed", score } : i
    );
    updateInterviews(updatedInterviews);
    setSelectedInterview({ ...interview, status: "completed", score });
    setCurrentView("dashboard");
    alert(`Interview completed! Your score: ${score}%`);
  };

  if (!mode) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setCurrentView("details")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#4A5568",
            }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
        </div>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>
            Choose Interview Mode
          </h1>
          <p style={{ color: theme.textSecondary }}>
            Select how you'd like to practice
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 12,
          }}
        >
          <ModeCard
            icon={<MessageSquare size={28} />}
            title="Text-Based Interview"
            description="Practice through text conversation."
            onClick={() => startInterview("text")}
            gradient="linear-gradient(135deg,#667eea 0%,#764ba2 100%)"
          />
          <ModeCard
            icon={<Mic size={28} />}
            title="Voice Interview"
            description="Simulate voice interview (coming soon)."
            onClick={() => startInterview("voice")}
            gradient="linear-gradient(135deg,#f093fb 0%,#f5576c 100%)"
            badge="Coming Soon"
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => setMode(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#4A5568",
          }}
        >
          <ChevronLeft size={16} />
          Change Mode
        </button>
        <button
          onClick={completeInterview}
          style={{
            padding: "10px 14px",
            background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 8,
          }}
        >
          Complete Interview
        </button>
      </div>

      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${theme.border}`,
          background: theme.cardBg,
          display: "flex",
          flexDirection: "column",
          height: 620,
        }}
      >
        <div
          style={{
            padding: 18,
            background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
            color: "white",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>
            {mode === "text" ? "Text Interview" : "Voice Interview"} -{" "}
            {interview.role}
          </h2>
          <p style={{ margin: 0, opacity: 0.9, marginTop: 6 }}>
            Duration: {interview.duration} minutes • {interview.type}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  backgroundColor: m.role === "user" ? "#667eea" : "#F7FAFC",
                  color: m.role === "user" ? "white" : "#1A202C",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: 14,
            borderTop: `1px solid ${theme.border}`,
            background: theme.cardBg,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your answer..."
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #CBD5E0",
                borderRadius: 8,
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 14px",
                background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: 8,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- ModeCard ---------------------- */
function ModeCard({ icon, title, description, onClick, gradient, badge }) {
  return (
    <div
      onClick={badge ? null : onClick}
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        cursor: badge ? "not-allowed" : "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!badge) {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        if (!badge) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
        }
      }}
    >
      {badge && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: "4px 10px",
            background: "#FED7D7",
            color: "#C53030",
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {badge}
        </span>
      )}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
          color: "white",
        }}
      >
        {icon}
      </div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
      <p style={{ marginTop: 8, color: "#4A5568" }}>{description}</p>
    </div>
  );
}

/* ---------------------- Analytics ---------------------- */
function Analytics({ interviews, theme, setCurrentView }) {
  const completedInterviews = interviews.filter(
    (i) => i.status === "completed"
  );
  const scores = completedInterviews.map((i) => i.score).filter((s) => s > 0);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

  const techCount = {};
  interviews.forEach((interview) => {
    (interview.technologies || []).forEach((tech) => {
      techCount[tech] = (techCount[tech] || 0) + 1;
    });
  });
  const topTechnologies = Object.entries(techCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <button
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.textSecondary,
          }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>
        Performance Analytics
      </h1>
      <p style={{ color: theme.textSecondary }}>
        Track your progress and identify areas for improvement
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        <StatCard
          title="Average Score"
          value={`${avgScore}%`}
          icon={<TrendingUp size={22} />}
          gradient="linear-gradient(135deg,#667eea 0%,#764ba2 100%)"
        />
        <StatCard
          title="Highest Score"
          value={`${highestScore}%`}
          icon={<Award size={22} />}
          gradient="linear-gradient(135deg,#38A169 0%,#2F855A 100%)"
        />
        <StatCard
          title="Lowest Score"
          value={`${lowestScore}%`}
          icon={<Target size={22} />}
          gradient="linear-gradient(135deg,#ED8936 0%,#DD6B20 100%)"
        />
        <StatCard
          title="Completed"
          value={completedInterviews.length}
          icon={<CheckCircle size={22} />}
          gradient="linear-gradient(135deg,#805AD5 0%,#6B46C1 100%)"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 12,
        }}
      >
        <div
          style={{
            background: theme.cardBg,
            padding: 12,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: theme.text,
            }}
          >
            Score Progress
          </h3>
          {completedInterviews.length > 0 ? (
            completedInterviews
              .slice(-6)
              .reverse()
              .map((it, idx) => (
                <div key={it.id} style={{ marginTop: 8 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ fontWeight: 600 }}>{it.role}</div>
                    <div style={{ fontWeight: 700 }}>{it.score}%</div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 10,
                      background: theme.border,
                      borderRadius: 10,
                      overflow: "hidden",
                      marginTop: 6,
                    }}
                  >
                    <div
                      style={{
                        width: `${it.score}%`,
                        height: "100%",
                        background:
                          it.score >= 80
                            ? "linear-gradient(90deg,#38A169,#48BB78)"
                            : it.score >= 60
                            ? "linear-gradient(90deg,#ED8936,#F6AD55)"
                            : "linear-gradient(90deg,#E53E3E,#FC8181)",
                      }}
                    />
                  </div>
                </div>
              ))
          ) : (
            <p style={{ color: theme.textSecondary, padding: "20px 0" }}>
              No completed interviews yet
            </p>
          )}
        </div>

        <div
          style={{
            background: theme.cardBg,
            padding: 12,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: theme.text,
            }}
          >
            Top Technologies
          </h3>
          {topTechnologies.length > 0 ? (
            topTechnologies.map(([tech, count]) => (
              <div key={tech} style={{ marginTop: 8 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ fontWeight: 600 }}>{tech}</div>
                  <div style={{ color: theme.textSecondary }}>
                    {count} interview{count > 1 ? "s" : ""}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 10,
                    background: theme.border,
                    borderRadius: 10,
                    overflow: "hidden",
                    marginTop: 6,
                  }}
                >
                  <div
                    style={{
                      width: `${(count / interviews.length) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg,#667eea,#764ba2)",
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: theme.textSecondary, padding: "20px 0" }}>
              No technology data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Templates ---------------------- */
function Templates({ setCurrentView, setInterviews, interviews, user, theme }) {
  // ✅ renamed from useTemplate → handleTemplate
  const handleTemplate = (template) => {
    const newInterview = {
      id: Date.now().toString(),
      role: template.role,
      experience: template.experience,
      type: template.type,
      difficulty: template.difficulty,
      duration: template.duration,
      technologies: template.technologies,
      focus: template.focus,
      status: "pending",
      date: new Date().toLocaleDateString(),
      userId: user.uid,
      score: 0,
    };
    const updated = [...interviews, newInterview];
    setInterviews(updated);
    setCurrentView("dashboard");
  };

  const templates = [
    {
      id: 1,
      name: "FAANG Software Engineer",
      role: "Software Engineer",
      type: "technical",
      difficulty: "hard",
      duration: "60",
      technologies: [
        "Data Structures",
        "Algorithms",
        "System Design",
        "Coding",
      ],
      experience: "intermediate",
      focus: "Leetcode-style problems, system design, behavioral questions",
      icon: "💼",
      color: "#667eea",
    },
    {
      id: 2,
      name: "Frontend Developer",
      role: "Frontend Developer",
      type: "technical",
      difficulty: "medium",
      duration: "45",
      technologies: ["React", "JavaScript", "CSS", "HTML"],
      experience: "beginner",
      focus: "Component design, state management",
      icon: "🎨",
      color: "#38A169",
    },
    {
      id: 3,
      name: "Data Scientist",
      role: "Data Scientist",
      type: "technical",
      difficulty: "hard",
      duration: "60",
      technologies: ["Python", "Machine Learning", "Statistics", "SQL"],
      experience: "advanced",
      focus: "ML algorithms, data analysis",
      icon: "📊",
      color: "#805AD5",
    },
    {
      id: 4,
      name: "Product Manager",
      role: "Product Manager",
      type: "behavioral",
      difficulty: "medium",
      duration: "45",
      technologies: ["Product Strategy", "User Research", "Analytics"],
      experience: "intermediate",
      focus: "Product thinking, stakeholder management",
      icon: "📈",
      color: "#ED8936",
    },
    {
      id: 5,
      name: "Backend Developer",
      role: "Backend Developer",
      type: "technical",
      difficulty: "medium",
      duration: "45",
      technologies: ["Node.js", "Python", "Databases", "APIs"],
      experience: "intermediate",
      focus: "API design, db optimization",
      icon: "🔧",
      color: "#3182CE",
    },
    {
      id: 6,
      name: "DevOps Engineer",
      role: "DevOps Engineer",
      type: "technical",
      difficulty: "hard",
      duration: "60",
      technologies: ["Kubernetes", "Docker", "CI/CD", "AWS"],
      experience: "advanced",
      focus: "Infrastructure, automation",
      icon: "🛠️",
      color: "#D53F8C",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.textSecondary,
          }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>
        Interview Templates
      </h1>
      <p style={{ color: theme.textSecondary }}>
        Quick-start your preparation with templates
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        {templates.map((t) => (
          <div
            key={t.id}
            style={{
              borderRadius: 12,
              padding: 12,
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: `${t.color}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {t.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{t.name}</div>
                <div style={{ color: theme.textSecondary, fontSize: 13 }}>
                  {t.difficulty} • {t.duration} min
                </div>
              </div>
            </div>
            <p style={{ color: theme.textSecondary }}>{t.focus}</p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              {t.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  style={{
                    background:
                      theme.cardBg === "white" ? "#EBF8FF" : "#4a5568",
                    color: theme.cardBg === "white" ? "#2C5282" : "#A0D9F5",
                    padding: "6px 10px",
                    borderRadius: 999,
                  }}
                >
                  {tech}
                </span>
              ))}
              {t.technologies.length > 3 && (
                <span
                  style={{
                    padding: "6px 10px",
                    background: theme.border,
                    borderRadius: 999,
                  }}
                >
                  +{t.technologies.length - 3} more
                </span>
              )}
            </div>

            {/* ✅ Fixed here */}
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => handleTemplate(t)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: t.color,
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- Checklist ---------------------- */
function Checklist({ theme, setCurrentView }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("checklist");
    return stored
      ? JSON.parse(stored)
      : [
          { id: 1, text: "Research the company and role", checked: false },
          {
            id: 2,
            text: "Prepare answers for common questions",
            checked: false,
          },
          { id: 3, text: "Practice coding problems", checked: false },
          {
            id: 4,
            text: "Prepare questions to ask the interviewer",
            checked: false,
          },
          {
            id: 5,
            text: "Test your internet and equipment (for virtual)",
            checked: false,
          },
          { id: 6, text: "Prepare professional attire", checked: false },
          { id: 7, text: "Review your resume", checked: false },
          { id: 8, text: "Get a good night's sleep", checked: false },
        ];
  });
  const [newItem, setNewItem] = useState("");

  const toggleItem = (id) => {
    const updated = items.map((it) =>
      it.id === id ? { ...it, checked: !it.checked } : it
    );
    setItems(updated);
    localStorage.setItem("checklist", JSON.stringify(updated));
  };
  const addItem = () => {
    if (newItem.trim()) {
      const updated = [
        ...items,
        { id: Date.now(), text: newItem.trim(), checked: false },
      ];
      setItems(updated);
      localStorage.setItem("checklist", JSON.stringify(updated));
      setNewItem("");
    }
  };
  const deleteItem = (id) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    localStorage.setItem("checklist", JSON.stringify(updated));
  };

  const completedCount = items.filter((i) => i.checked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.textSecondary,
          }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>
        Interview Preparation Checklist
      </h1>
      <p style={{ color: theme.textSecondary }}>
        Stay organized and ensure you're ready for your interview
      </p>

      <div
        style={{
          marginTop: 12,
          background: theme.cardBg,
          padding: 12,
          borderRadius: 12,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {completedCount}/{items.length} completed
          </div>
          <div style={{ fontWeight: 700 }}>{Math.round(progress)}%</div>
        </div>
        <div
          style={{
            width: "100%",
            height: 10,
            background: theme.border,
            borderRadius: 10,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg,#667eea,#764ba2)",
            }}
          />
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new checklist item..."
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
            }}
          />
          <button
            onClick={addItem}
            style={{
              padding: "8px 12px",
              background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: 8,
            }}
          >
            Add
          </button>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 8,
                borderRadius: 8,
                background: theme.inputBg,
                border: `1px solid ${item.checked ? "#667eea" : theme.border}`,
              }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: item.checked ? "#667eea" : "transparent",
                  border: `2px solid ${
                    item.checked ? "#667eea" : theme.border
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.checked ? <CheckCircle size={16} color="white" /> : null}
              </button>
              <div
                style={{
                  flex: 1,
                  textDecoration: item.checked ? "line-through" : "none",
                  opacity: item.checked ? 0.7 : 1,
                }}
              >
                {item.text}
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  background: "#FFF5F5",
                  border: "1px solid #FEB2B2",
                  color: "#E53E3E",
                  padding: "6px 8px",
                  borderRadius: 6,
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Resources ---------------------- */
function Resources({ theme, setCurrentView }) {
  const resources = [
    {
      category: "Coding Practice",
      items: [
        {
          name: "LeetCode",
          description: "Practice coding problems",
          url: "https://leetcode.com",
          icon: <Code size={18} />,
        },
        {
          name: "HackerRank",
          description: "Coding challenges",
          url: "https://www.hackerrank.com",
          icon: <Code size={18} />,
        },
      ],
    },
    {
      category: "System Design",
      items: [
        {
          name: "System Design Primer",
          description: "Learn system design fundamentals",
          url: "https://github.com/donnemartin/system-design-primer",
          icon: <Brain size={18} />,
        },
        {
          name: "Grokking System Design",
          description: "System design interview prep",
          url: "https://www.educative.io",
          icon: <Brain size={18} />,
        },
      ],
    },
    {
      category: "Interview Tips",
      items: [
        {
          name: "STAR Method",
          description: "Behavioral technique",
          url: "#",
          icon: <Star size={18} />,
        },
        {
          name: "Cracking the Coding Interview",
          description: "Classic book",
          url: "#",
          icon: <BookOpen size={18} />,
        },
      ],
    },
    {
      category: "Video Resources",
      items: [
        {
          name: "freeCodeCamp",
          description: "Free coding tutorials",
          url: "https://www.youtube.com/c/Freecodecamp",
          icon: <Youtube size={18} />,
        },
      ],
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.textSecondary,
          }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>
        Study Resources
      </h1>
      <p style={{ color: theme.textSecondary }}>
        Curated resources to help you ace your interviews
      </p>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {resources.map((section, idx) => (
          <div key={idx}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>
              {section.category}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 8,
                marginTop: 8,
              }}
            >
              {section.items.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 8,
                    background: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    textDecoration: "none",
                    color: theme.text,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "#EBF8FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#667eea",
                    }}
                  >
                    {res.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{res.name}</div>
                    <div style={{ color: theme.textSecondary }}>
                      {res.description}
                    </div>
                  </div>
                  <ExternalLink size={16} color={theme.textSecondary} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- Achievements ---------------------- */
function Achievements({ achievements, theme, setCurrentView, streak }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progress = achievements.length
    ? (unlockedCount / achievements.length) * 100
    : 0;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.textSecondary,
          }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>
        Achievements
      </h1>
      <p style={{ color: theme.textSecondary }}>
        Unlock achievements as you progress
      </p>

      <div
        style={{
          marginTop: 12,
          background: theme.cardBg,
          padding: 12,
          borderRadius: 12,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>
              {unlockedCount} of {achievements.length} achievements unlocked
            </div>
            <div style={{ color: theme.textSecondary }}>
              Keep practicing to unlock more
            </div>
          </div>
          {streak > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "linear-gradient(135deg,#F6AD55 0%,#ED8936 100%)",
                padding: "8px 12px",
                borderRadius: 12,
                color: "white",
              }}
            >
              <Flame size={18} />
              <div>
                <div style={{ fontWeight: 700 }}>{streak}</div>
                <div style={{ fontSize: 12 }}>Day Streak</div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            width: "100%",
            height: 10,
            background: theme.border,
            borderRadius: 10,
            overflow: "hidden",
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg,#F6AD55,#ED8936)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 8,
          }}
        >
          {achievements.map((a) => (
            <div
              key={a.id}
              style={{
                padding: 12,
                borderRadius: 10,
                background: theme.cardBg,
                border: `1px solid ${a.unlocked ? "#F6AD55" : theme.border}`,
                opacity: a.unlocked ? 1 : 0.7,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontWeight: 700 }}>{a.name}</div>
              <div style={{ color: theme.textSecondary }}>{a.description}</div>
              {a.unlocked && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "6px 8px",
                    background: "#48BB78",
                    color: "white",
                    borderRadius: 8,
                    display: "inline-block",
                  }}
                >
                  Unlocked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- SettingsPage ---------------------- */
function SettingsPage({
  theme,
  setCurrentView,
  darkMode,
  toggleTheme,
  userProfile,
  setUserProfile,
  user,
}) {
  const [profile, setProfile] = useState(
    userProfile || {
      fullName: user.displayName,
      email: user.email,
      bio: "",
      targetRole: "",
      yearsOfExperience: "",
    }
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(
      userProfile || {
        fullName: user.displayName,
        email: user.email,
        bio: "",
        targetRole: "",
        yearsOfExperience: "",
      }
    );
  }, [userProfile, user]);

  const handleSave = () => {
    setUserProfile(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const interviews = JSON.parse(localStorage.getItem("interviews") || "[]");
    const data = { profile, interviews, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interviewmate-data-${Date.now()}.json`;
    a.click();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.textSecondary,
          }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>
        Settings
      </h1>
      <p style={{ color: theme.textSecondary }}>
        Manage your profile and preferences
      </p>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            background: theme.cardBg,
            padding: 12,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3 style={{ margin: 0, fontWeight: 700 }}>Profile Information</h3>
          {saved && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                background: "#C6F6D5",
                color: "#22543D",
                borderRadius: 8,
              }}
            >
              Profile saved successfully!
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <label style={{ display: "block", fontWeight: 600 }}>
              Full Name
            </label>
            <input
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              style={{ ...inputStyle, marginTop: 6 }}
            />
            <label style={{ display: "block", fontWeight: 600, marginTop: 8 }}>
              Email
            </label>
            <input
              value={profile.email}
              disabled
              style={{
                ...inputStyle,
                marginTop: 6,
                background: theme.border,
                color: theme.textSecondary,
              }}
            />
            <label style={{ display: "block", fontWeight: 600, marginTop: 8 }}>
              Target Role
            </label>
            <input
              value={profile.targetRole}
              onChange={(e) =>
                setProfile({ ...profile, targetRole: e.target.value })
              }
              style={{ ...inputStyle, marginTop: 6 }}
              placeholder="e.g., Senior Software Engineer"
            />
            <label style={{ display: "block", fontWeight: 600, marginTop: 8 }}>
              Years of Experience
            </label>
            <select
              value={profile.yearsOfExperience}
              onChange={(e) =>
                setProfile({ ...profile, yearsOfExperience: e.target.value })
              }
              style={{ ...inputStyle, marginTop: 6 }}
            >
              <option value="">Select</option>
              <option value="0-1">0-1</option>
              <option value="1-3">1-3</option>
              <option value="3-5">3-5</option>
              <option value="5+">5+</option>
            </select>
            <label style={{ display: "block", fontWeight: 600, marginTop: 8 }}>
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              style={{ ...inputStyle, marginTop: 6 }}
            />
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button
                onClick={handleSave}
                style={{
                  padding: "10px 12px",
                  background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                }}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: theme.cardBg,
            padding: 12,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3 style={{ margin: 0, fontWeight: 700 }}>Appearance</h3>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>Dark Mode</div>
              <div style={{ color: theme.textSecondary }}>
                Switch between light and dark theme
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                width: 60,
                height: 32,
                borderRadius: 999,
                background: darkMode ? "#667eea" : "#CBD5E0",
                border: "none",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: 4,
                  left: darkMode ? 32 : 4,
                }}
              >
                {darkMode ? (
                  <Moon size={14} color="#667eea" />
                ) : (
                  <Sun size={14} color="#F6AD55" />
                )}
              </div>
            </button>
          </div>
        </div>

        <div
          style={{
            background: theme.cardBg,
            padding: 12,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3 style={{ margin: 0, fontWeight: 700 }}>Data Management</h3>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button
              onClick={handleExport}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: theme.inputBg,
                border: `1px solid ${theme.border}`,
              }}
            >
              <Download size={16} /> Export All Data
            </button>
            <button
              onClick={() => {
                if (window.confirm("Clear all data? This cannot be undone.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "#FFF5F5",
                border: "1px solid #FEB2B2",
                color: "#E53E3E",
              }}
            >
              <Trash2 size={16} /> Clear All Data
            </button>
          </div>
        </div>

        <div
          style={{
            background: theme.cardBg,
            padding: 12,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
          }}
        >
          <h3 style={{ margin: 0, fontWeight: 700 }}>About InterviewMate</h3>
          <p style={{ color: theme.textSecondary }}>
            InterviewMate is an AI-powered interview preparation platform (demo)
            built with React. Data is stored locally for this prototype.
          </p>
          <div style={{ display: "flex", gap: 8, color: theme.textSecondary }}>
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built with React</span>
            <span>•</span>
            <span>© 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}
