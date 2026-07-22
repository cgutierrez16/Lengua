import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../styles/dashboard.css";

export const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    const [lyricRes, freewriteRes] = await Promise.all([
      supabase
        .from("lyric_attempts")
        .select(
          "overall_score, song_id, created_at, songs(title, albumcoverlink, artist)",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("freewrite_attempts")
        .select(
          "quality_score, word_count, write_time, created_at, prompts(prompt_es)",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    const lyricAttempts = lyricRes.data || [];
    const freewriteAttempts = freewriteRes.data || [];

    const avgTransScore = lyricAttempts.length
      ? Math.round(
          lyricAttempts.reduce((acc, a) => acc + a.overall_score, 0) /
            lyricAttempts.length,
        )
      : 0;

    const avgQualityScore = freewriteAttempts.length
      ? Math.round(
          freewriteAttempts.reduce((acc, a) => acc + a.quality_score, 0) /
            freewriteAttempts.length,
        )
      : 0;

    const streak = calculateStreak(lyricAttempts, freewriteAttempts);

    setDashboardData({
      totalSongs: new Set(lyricAttempts.map((a) => a.song_id)).size,
      avgTransScore,
      totalWrites: freewriteAttempts.length,
      avgQualityScore,
      recentLyrics: lyricAttempts.slice(0, 3),
      recentFreewrites: freewriteAttempts.slice(0, 3),
      streak,
    });
  };

  const calculateStreak = (lyricAttempts, freewriteAttempts) => {
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

  const getScoreLevel = (score) => {
    if (score >= 80) return "green";
    if (score >= 65) return "yellow";
    return "red";
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  if (!dashboardData) {
    return (
      <div className="dashboard-page dashboard-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">Welcome back</h1>
          <p className="dashboard-subgreeting">
            Keep up the great work — your Spanish is improving every day.
          </p>
        </div>
        <div className="streak-card">
          <span className="streak-number">{dashboardData.streak}</span>
          <span className="streak-label">day streak 🔥</span>
        </div>
      </div>

      {/* Feature cards */}
      <div className="feature-cards-row">
        <div className="feature-action-card feature-card-lyrics">
          <div className="feature-action-icon">🎵</div>
          <h2 className="feature-action-title">Lyric Translator</h2>
          <p className="feature-action-desc">
            Search for a Spanish song and translate it line by line. Get scored
            on your accuracy and learn the words you missed.
          </p>
          <Link to="/lyrics" className="feature-action-btn">
            Start translating
          </Link>
        </div>
        <div className="feature-action-card feature-card-write">
          <div className="feature-action-icon">✏️</div>
          <h2 className="feature-action-title">Free Write</h2>
          <p className="feature-action-desc">
            Get a timed writing prompt and practice forming Spanish sentences.
            Receive AI feedback on your grammar and topic relevance.
          </p>
          <Link to="/write" className="feature-action-btn">
            Start writing
          </Link>
        </div>
      </div>

      {/* Stats summary */}
      <div className="stats-summary-row">
        <div className="stats-summary-card">
          <span className="stats-summary-number">
            {dashboardData.totalSongs}
          </span>
          <span className="stats-summary-label">Songs translated</span>
        </div>
        <div className="stats-summary-card">
          <span className="stats-summary-number">
            {dashboardData.avgTransScore}%
          </span>
          <span className="stats-summary-label">Avg translation score</span>
        </div>
        <div className="stats-summary-card">
          <span className="stats-summary-number">
            {dashboardData.totalWrites}
          </span>
          <span className="stats-summary-label">Free write sessions</span>
        </div>
        <div className="stats-summary-card">
          <span className="stats-summary-number">
            {dashboardData.avgQualityScore}%
          </span>
          <span className="stats-summary-label">Avg quality score</span>
        </div>
      </div>

      {/* Recent activity */}
      <div className="recent-row">
        <div className="recent-section">
          <div className="recent-section-header">
            <h2 className="recent-title">Recent translations</h2>
            <Link to="/stats" className="recent-view-all">
              View all →
            </Link>
          </div>
          <div className="recent-list">
            {dashboardData.recentLyrics.length === 0 ? (
              <p className="recent-empty">No translations yet</p>
            ) : (
              dashboardData.recentLyrics.map((current, i) => (
                <div className="recent-item" key={i}>
                  <div className="recent-item-left">
                    <img
                      src={current.songs?.albumcoverlink}
                      alt="Album cover"
                      className="recent-album-cover"
                    />
                    <div className="recent-details">
                      <p className="recent-item-name">{current.songs?.title}</p>
                      <p className="recent-item-sub">
                        {current.songs?.artist?.join(", ")} ·{" "}
                        {formatDate(current.created_at)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`score-pill pill-${getScoreLevel(current.overall_score)}`}
                  >
                    {Math.round(current.overall_score)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="recent-section">
          <div className="recent-section-header">
            <h2 className="recent-title">Recent free writes</h2>
            <Link to="/stats" className="recent-view-all">
              View all →
            </Link>
          </div>
          <div className="recent-list">
            {dashboardData.recentFreewrites.length === 0 ? (
              <p className="recent-empty">No free writes yet</p>
            ) : (
              dashboardData.recentFreewrites.map((current, i) => (
                <div className="recent-item" key={i}>
                  <div className="recent-item-left">
                    <div className="recent-prompt-icon">✏️</div>
                    <div className="recent-details">
                      <p className="recent-item-name">
                        {current.prompts?.prompt_es}
                      </p>
                      <p className="recent-item-sub">
                        {current.write_time} min ·{" "}
                        {formatDate(current.created_at)} · {current.word_count}{" "}
                        words
                      </p>
                    </div>
                  </div>
                  <span
                    className={`score-pill pill-${getScoreLevel(current.quality_score)}`}
                  >
                    {Math.round(current.quality_score)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
