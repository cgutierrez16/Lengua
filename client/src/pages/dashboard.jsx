import { React, useState, useEffect } from "react";
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

  if (!dashboardData) {
    return (
      <div
        className="dashboard-page"
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "4rem",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div class="dashboard-page">
        {/* <!-- Greeting + streak --> */}
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-greeting">Welcome back, Carlos</h1>
            <p class="dashboard-subgreeting">
              Keep up the great work — your Spanish is improving every day.
            </p>
          </div>
          <div class="streak-card">
            <span class="streak-number">{dashboardData.streak}</span>
            <span class="streak-label">day streak</span>
          </div>
        </div>

        {/* <!-- Feature cards --> */}
        <div class="feature-cards-row">
          <div class="feature-action-card">
            <div class="feature-action-icon">🎵</div>
            <h2 class="feature-action-title">Lyric Translator</h2>
            <p class="feature-action-desc">
              Search for a Spanish song and translate it line by line. Get
              scored on your accuracy and learn the words you missed.
            </p>
            <Link to="/lyrics">
              <a class="feature-action-btn">Start translating</a>
            </Link>
          </div>
          <div class="feature-action-card">
            <div class="feature-action-icon">✏️</div>
            <h2 class="feature-action-title">Free Write</h2>
            <p class="feature-action-desc">
              Get a timed writing prompt and practice forming Spanish sentences.
              Receive AI feedback on your grammar and topic relevance.
            </p>
            <Link to="/write">
              <a class="feature-action-btn">Start writing</a>
            </Link>
          </div>
        </div>

        {/* <!-- Stats summary --> */}
        <div class="stats-summary-row">
          <div class="stats-summary-card">
            <span class="stats-summary-label">Songs translated</span>
            <span class="stats-summary-number">{dashboardData.totalSongs}</span>
          </div>
          <div class="stats-summary-card">
            <span class="stats-summary-label">Avg translation score</span>
            <span class="stats-summary-number">
              {dashboardData.avgTransScore}%
            </span>
          </div>
          <div class="stats-summary-card">
            <span class="stats-summary-label">Free write sessions</span>
            <span class="stats-summary-number">
              {dashboardData.totalWrites}
            </span>
          </div>
          <div class="stats-summary-card">
            <span class="stats-summary-label">Avg quality score</span>
            <span class="stats-summary-number">
              {dashboardData.avgQualityScore}%
            </span>
          </div>
        </div>

        {/* <!-- Continue practicing --> */}
        <div class="continue-card">
          <div class="continue-left">
            <p class="continue-label">Continue practicing</p>
            <h3 class="continue-title">
              You have 8 words to review from{" "}
              <span class="continue-song">Turista</span>
            </h3>
            <p class="continue-sub">Last attempted Apr 18 · Score: 91%</p>
          </div>
          <a class="feature-action-btn" href="#">
            Resume practice
          </a>
        </div>

        {/* <!-- Recent activity --> */}
        <div class="recent-row">
          <div class="recent-section">
            <h2 class="recent-title">Recent translations</h2>
            <div class="recent-list">
              {dashboardData.recentLyrics.map((current) => {
                const date = new Date(current.created_at);
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                let color = "";
                if (current.overall_score >= 80) {
                  color = "green";
                } else if (
                  80 > current.overall_score &&
                  current.overall_score >= 65
                ) {
                  color = "yellow";
                } else {
                  color = "red";
                }

                return (
                  <div class="recent-item">
                    <div class="recent-item-left">
                      <div class="recent-album-cover">
                        <img
                          src={current.songs.albumcoverlink}
                          alt="Album cover"
                        />
                      </div>
                      <div>
                        <p class="recent-item-name">{current.songs.title}</p>
                        <p class="recent-item-sub">
                          {current.songs.artist} · {formattedDate}
                        </p>
                      </div>
                    </div>
                    <span className={`score-pill pill-${color}`}>
                      {current.overall_score}%
                    </span>
                  </div>
                );
              })}
            </div>
            <Link to="/stats">
              <a class="recent-view-all">View all →</a>
            </Link>
          </div>

          <div class="recent-section">
            <h2 class="recent-title">Recent free writes</h2>
            <div class="recent-list">
              {dashboardData.recentFreewrites.map((current) => {
                const date = new Date(current.created_at);
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                let color = "";
                if (current.quality_score >= 80) {
                  color = "green";
                } else if (
                  80 > current.quality_score &&
                  current.quality_score >= 65
                ) {
                  color = "yellow";
                } else {
                  color = "red";
                }

                return (
                  <div class="recent-item">
                    <div class="recent-item-left">
                      <div class="recent-prompt-icon">✏️</div>
                      <div>
                        <p class="recent-item-name">
                          {current.prompts.prompt_es}
                        </p>
                        <p class="recent-item-sub">
                          {current.write_time} min · {formattedDate} ·{" "}
                          {current.word_count} words
                        </p>
                      </div>
                    </div>
                    <span className={`score-pill pill-${color}`}>
                      {current.quality_score}%
                    </span>
                  </div>
                );
              })}
            </div>
            <a class="recent-view-all" href="#">
              View all →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
