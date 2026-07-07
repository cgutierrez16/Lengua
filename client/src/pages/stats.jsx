import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";
import "../styles/stats.css";

export const Stats = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lyrics");
  const [freewriteActiveTab, setFreewriteActiveTab] = useState("all");
  const [lyricAttempts, setLyricAttempts] = useState([]);
  const [freewriteAttempts, setFreewriteAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const filteredFreewriteAttempts =
    freewriteActiveTab === "all"
      ? freewriteAttempts
      : freewriteAttempts.filter(
          (attempt) => attempt.write_time === Number(freewriteActiveTab),
        );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);

    const { data: lyrics } = await supabase
      .from("lyric_attempts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    const { data: freewrites } = await supabase
      .from("freewrite_attempts")
      .select("*, prompts(prompt_es)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    setLyricAttempts(lyrics || []);
    setFreewriteAttempts(freewrites || []);
    setLoading(false);
  };

  const getScoreLevel = (score) => {
    if (score >= 80) return "green";
    if (score >= 55) return "yellow";
    return "red";
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  // ── Streak calculation (combined across both features) ──
  const calculateStreak = () => {
    const allDates = [
      ...lyricAttempts.map((a) => a.created_at),
      ...freewriteAttempts.map((a) => a.created_at),
    ]
      .map((d) => new Date(d).toDateString())
      .filter((d, i, arr) => arr.indexOf(d) === i)
      .sort((a, b) => new Date(b) - new Date(a));

    if (allDates.length === 0) return 0;

    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (let i = 0; i < allDates.length; i++) {
      const date = new Date(allDates[i]);
      date.setHours(0, 0, 0, 0);
      const diff = Math.round((cursor - date) / (1000 * 60 * 60 * 24));

      if (diff === 0 || diff === 1) {
        streak++;
        cursor = date;
      } else {
        break;
      }
    }

    return streak;
  };

  // ── Lyrics stats ──
  const avgLyricScore = lyricAttempts.length
    ? Math.round(
        lyricAttempts.reduce((sum, a) => sum + a.overall_score, 0) /
          lyricAttempts.length,
      )
    : 0;

  const songsCompleted = new Set(lyricAttempts.map((a) => a.song_id)).size;

  // ── Free write stats ──
  const avgQualityScore = filteredFreewriteAttempts.length
    ? Math.round(
        filteredFreewriteAttempts.reduce((sum, a) => sum + a.quality_score, 0) /
          filteredFreewriteAttempts.length,
      )
    : 0;

  const avgWordCount = filteredFreewriteAttempts.length
    ? Math.round(
        filteredFreewriteAttempts.reduce((sum, a) => sum + a.word_count, 0) /
          filteredFreewriteAttempts.length,
      )
    : 0;

  // ── Chart line generator ──
  const buildLinePoints = (
    data,
    key,
    width = 600,
    height = 200,
    padding = 20,
  ) => {
    if (data.length === 0) return "";
    if (data.length === 1) {
      return `${padding},${height - padding}`;
    }

    const step = (width - padding * 2) / (data.length - 1);

    return data
      .map((point, i) => {
        const x = padding + i * step;
        const value = point[key];
        const y = height - padding - (value / 100) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");
  };

  if (!user) {
    return (
      <div className="stats-page">
        <p className="stats-login-prompt">Log in to see your progress.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="stats-page">
        <p className="stats-loading">Loading your stats...</p>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <h1 className="stats-title">Your Progress</h1>
      <p className="stats-subtitle">Track how you're improving over time</p>

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "lyrics" ? "active" : ""}`}
          onClick={() => setActiveTab("lyrics")}
        >
          Lyrics
        </button>
        <button
          className={`tab-btn ${activeTab === "freewrite" ? "active" : ""}`}
          onClick={() => setActiveTab("freewrite")}
        >
          Free Write
        </button>
      </div>

      {activeTab === "lyrics" ? (
        <div className="stats-content">
          <div className="stats-summary-row">
            <div className="stats-summary-card">
              <span className="stats-summary-label">Songs completed</span>
              <span className="stats-summary-number">{songsCompleted}</span>
            </div>
            <div className="stats-summary-card">
              <span className="stats-summary-label">Average score</span>
              <span className="stats-summary-number">{avgLyricScore}%</span>
            </div>
            <div className="stats-summary-card">
              <span className="stats-summary-label">Current streak</span>
              <span className="stats-summary-number">
                {calculateStreak()} days
              </span>
            </div>
          </div>

          {lyricAttempts.length === 0 ? (
            <p className="stats-empty">
              No lyric translations yet — go translate a song!
            </p>
          ) : (
            <>
              <div className="stats-section">
                <h2 className="stats-section-title">Score over time</h2>
                <div className="stats-chart-placeholder">
                  <svg viewBox="0 0 600 200" className="stats-line-chart">
                    <polyline
                      points={buildLinePoints(lyricAttempts, "overall_score")}
                      fill="none"
                      stroke="#5ae4a7"
                      strokeWidth="3"
                    />
                    {lyricAttempts.map((a, i) => {
                      const step =
                        (600 - 40) / Math.max(lyricAttempts.length - 1, 1);
                      const x = 20 + i * step;
                      const y = 200 - 20 - (a.overall_score / 100) * (200 - 40);
                      return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#5ae4a7" />
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="stats-section">
                <h2 className="stats-section-title">Recent attempts</h2>
                <div className="stats-recent-list">
                  {[...lyricAttempts]
                    .reverse()
                    .slice(0, 10)
                    .map((a) => (
                      <div key={a.id} className="stats-recent-row">
                        <span className="stats-recent-song">
                          {a.songs?.title || "Unknown song"}
                        </span>
                        <span className="stats-recent-date">
                          {formatDate(a.created_at)}
                        </span>
                        <span
                          className={`stats-recent-score pill-${getScoreLevel(a.overall_score)}`}
                        >
                          {Math.round(a.overall_score)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="stats-content">
          <div className="freewrite-filter-bar">
            <button
              className={freewriteActiveTab === "all" ? "active" : ""}
              onClick={() => setFreewriteActiveTab("all")}
            >
              All
            </button>

            <button
              className={freewriteActiveTab === "1" ? "active" : ""}
              onClick={() => setFreewriteActiveTab("1")}
            >
              1 Minute
            </button>

            <button
              className={freewriteActiveTab === "3" ? "active" : ""}
              onClick={() => setFreewriteActiveTab("3")}
            >
              3 Minutes
            </button>

            <button
              className={freewriteActiveTab === "5" ? "active" : ""}
              onClick={() => setFreewriteActiveTab("5")}
            >
              5 Minutes
            </button>
          </div>
          <div className="stats-summary-row">
            <div className="stats-summary-card">
              <span className="stats-summary-label">Sessions completed</span>
              <span className="stats-summary-number">
                {filteredFreewriteAttempts.length}
              </span>
            </div>
            <div className="stats-summary-card">
              <span className="stats-summary-label">Average quality score</span>
              <span className="stats-summary-number">{avgQualityScore}%</span>
            </div>
            <div className="stats-summary-card">
              <span className="stats-summary-label">Average word count</span>
              <span className="stats-summary-number">{avgWordCount}</span>
            </div>
          </div>

          {filteredFreewriteAttempts.length === 0 ? (
            <p className="stats-empty">
              No free write sessions yet — give it a try!
            </p>
          ) : (
            <>
              <div className="stats-section">
                <h2 className="stats-section-title">Quality score over time</h2>
                <div className="stats-chart-placeholder">
                  <svg viewBox="0 0 600 200" className="stats-line-chart">
                    <polyline
                      points={buildLinePoints(
                        filteredFreewriteAttempts,
                        "quality_score",
                      )}
                      fill="none"
                      stroke="#5ae4a7"
                      strokeWidth="3"
                    />
                    {filteredFreewriteAttempts.map((a, i) => {
                      const step =
                        (600 - 40) / Math.max(filteredFreewriteAttempts.length - 1, 1);
                      const x = 20 + i * step;
                      const y = 200 - 20 - (a.quality_score / 100) * (200 - 40);
                      return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#5ae4a7" />
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="stats-section">
                <h2 className="stats-section-title">Recent sessions</h2>
                <div className="stats-recent-list">
                  {[...filteredFreewriteAttempts]
                    .reverse()
                    .slice(0, 10)
                    .map((a) => (
                      <div key={a.id} className="stats-recent-row">
                        <span className="stats-recent-song">
                          {a.prompts?.prompt_es || "Unknown prompt"}
                        </span>
                        <span className="stats-recent-date">
                          {formatDate(a.created_at)}
                        </span>
                        <span
                          className={`stats-recent-score pill-${getScoreLevel(a.quality_score)}`}
                        >
                          {Math.round(a.quality_score)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
