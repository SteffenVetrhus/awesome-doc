---
layout: home

hero:
  name: Console Apps
  text: Documentation Hub
  tagline: Modern documentation for our interconnected console application ecosystem
  actions:
    - theme: brand
      text: View Applications
      link: /apps/
    - theme: alt
      text: View Architecture
      link: /architecture

features:
  - icon: 📦
    title: 20+ Applications
    details: Comprehensive documentation for all console applications in our ecosystem, with clear descriptions and usage examples
  - icon: 🔗
    title: Visual Integration Maps
    details: Interactive diagrams showing how applications connect and data flows through the system
  - icon: 📚
    title: Easy to Maintain
    details: Simple markdown-based documentation that developers can easily update and extend
  - icon: 🎨
    title: Modern & Beautiful
    details: Clean, intuitive UI with dark mode support and powerful search functionality
---

<script setup>
import AppGraph from './.vitepress/theme/components/AppGraph.vue'
</script>

## Application Ecosystem

Explore our interconnected console applications and their relationships:

<AppGraph />

## Quick Links

<div class="app-grid">
  <a href="/apps/" class="quick-link">
    <div class="icon">📥</div>
    <h3>Input Apps</h3>
    <p>Data collection and ingestion applications</p>
  </a>

  <a href="/apps/" class="quick-link">
    <div class="icon">⚙️</div>
    <h3>Processing Apps</h3>
    <p>Data transformation and validation</p>
  </a>

  <a href="/apps/" class="quick-link">
    <div class="icon">📤</div>
    <h3>Output Apps</h3>
    <p>Report generation and export</p>
  </a>

  <a href="/integrations/" class="quick-link">
    <div class="icon">🔌</div>
    <h3>Integrations</h3>
    <p>Integration patterns and examples</p>
  </a>
</div>

<style scoped>
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin: 48px 0;
}

.quick-link {
  padding: 32px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.quick-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

.quick-link .icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.quick-link h3 {
  margin: 0 0 8px 0;
  color: var(--vp-c-brand);
}

.quick-link p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.dark .quick-link {
  background: #1e293b;
}

.dark .quick-link p {
  color: #94a3b8;
}
</style>
