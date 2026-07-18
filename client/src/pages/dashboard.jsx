import React from "react";
import "../styles/dashboard.css";

export const Dashboard = () => {
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
            <span class="streak-number">4</span>
            <span class="streak-label">day streak 🔥</span>
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
            <a class="feature-action-btn" href="#">
              Start translating
            </a>
          </div>
          <div class="feature-action-card">
            <div class="feature-action-icon">✏️</div>
            <h2 class="feature-action-title">Free Write</h2>
            <p class="feature-action-desc">
              Get a timed writing prompt and practice forming Spanish sentences.
              Receive AI feedback on your grammar and topic relevance.
            </p>
            <a class="feature-action-btn" href="#">
              Start writing
            </a>
          </div>
        </div>

        {/* <!-- Stats summary --> */}
        <div class="stats-summary-row">
          <div class="stats-summary-card">
            <span class="stats-summary-label">Songs translated</span>
            <span class="stats-summary-number">12</span>
          </div>
          <div class="stats-summary-card">
            <span class="stats-summary-label">Avg translation score</span>
            <span class="stats-summary-number">78%</span>
          </div>
          <div class="stats-summary-card">
            <span class="stats-summary-label">Free write sessions</span>
            <span class="stats-summary-number">8</span>
          </div>
          <div class="stats-summary-card">
            <span class="stats-summary-label">Avg quality score</span>
            <span class="stats-summary-number">65%</span>
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
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-album-placeholder"></div>
                  <div>
                    <p class="recent-item-name">Turista</p>
                    <p class="recent-item-sub">Bad Bunny · Apr 18</p>
                  </div>
                </div>
                <span class="score-pill pill-green">91%</span>
              </div>
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-album-placeholder"></div>
                  <div>
                    <p class="recent-item-name">Donde Has Estado</p>
                    <p class="recent-item-sub">Eslabon Armado · Apr 16</p>
                  </div>
                </div>
                <span class="score-pill pill-yellow">72%</span>
              </div>
              <div class="recent-item">
                <div class="recent-album-placeholder"></div>
                <div class="recent-item-left">
                  <div class="recent-album-placeholder"></div>
                  <div>
                    <p class="recent-item-name">Eso y Más</p>
                    <p class="recent-item-sub">Jorge Celedón · Apr 14</p>
                  </div>
                </div>
                <span class="score-pill pill-red">48%</span>
              </div>
            </div>
            <a class="recent-view-all" href="#">
              View all →
            </a>
          </div>

          <div class="recent-section">
            <h2 class="recent-title">Recent free writes</h2>
            <div class="recent-list">
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-prompt-icon">✏️</div>
                  <div>
                    <p class="recent-item-name">Write about your weekend</p>
                    <p class="recent-item-sub">5 min · Apr 17 · 61 words</p>
                  </div>
                </div>
                <span class="score-pill pill-yellow">68%</span>
              </div>
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-prompt-icon">✏️</div>
                  <div>
                    <p class="recent-item-name">Describe your best friend</p>
                    <p class="recent-item-sub">3 min · Apr 15 · 48 words</p>
                  </div>
                </div>
                <span class="score-pill pill-green">82%</span>
              </div>
              <div class="recent-item">
                <div class="recent-item-left">
                  <div class="recent-prompt-icon">✏️</div>
                  <div>
                    <p class="recent-item-name">Talk about your hobbies</p>
                    <p class="recent-item-sub">1 min · Apr 13 · 29 words</p>
                  </div>
                </div>
                <span class="score-pill pill-red">51%</span>
              </div>
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
