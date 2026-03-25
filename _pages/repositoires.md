---
layout: archive
title: "Repositoires"
permalink: /repositories/
author_profile: true
redirect_from:
  - /repositories
---

{% include base_path %}

My collection of repositories.

<div id="repo-grid" class="repo-grid">
  <p>Loading repositories...</p>
</div>

<style>
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.repo-card {
  border: 1px solid #d8d8d8;
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.repo-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.repo-card h3 a {
  text-decoration: none;
}

.repo-card p {
  margin: 0.5rem 0 0.9rem 0;
  line-height: 1.5;
}

.repo-meta {
  font-size: 0.95rem;
  color: #666;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>

<script>
document.addEventListener("DOMContentLoaded", async () => {
  const username = "lldavoll";
  const container = document.getElementById("repo-grid");

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = await response.json();

    const filtered = repos
      .filter(repo => !repo.fork && !repo.private)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    if (!filtered.length) {
      container.innerHTML = "<p>No public repositories found.</p>";
      return;
    }

    container.innerHTML = filtered.map(repo => `
      <div class="repo-card">
        <h3>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            ${repo.name}
          </a>
        </h3>
        <p>${repo.description ? repo.description : "No description provided."}</p>
        <div class="repo-meta">
          <span><strong>Language:</strong> ${repo.language || "N/A"}</span>
          <span><strong>Stars:</strong> ${repo.stargazers_count}</span>
          <span><strong>Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    `).join("");
  } catch (error) {
    container.innerHTML = "<p>Unable to load repositories right now.</p>";
    console.error(error);
  }
});
</script>
