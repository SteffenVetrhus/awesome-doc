<template>
  <div class="app-card" :class="type">
    <div class="app-header">
      <h3>{{ name }}</h3>
      <span class="badge" :class="type">{{ type }}</span>
    </div>

    <p class="description">{{ description }}</p>

    <div class="details" v-if="inputs || outputs">
      <div v-if="inputs" class="detail-section">
        <h4>📥 Inputs</h4>
        <ul>
          <li v-for="input in inputs" :key="input">{{ input }}</li>
        </ul>
      </div>

      <div v-if="outputs" class="detail-section">
        <h4>📤 Outputs</h4>
        <ul>
          <li v-for="output in outputs" :key="output">{{ output }}</li>
        </ul>
      </div>
    </div>

    <div v-if="connections" class="connections">
      <h4>🔗 Connected Apps</h4>
      <div class="connection-tags">
        <span v-for="conn in connections" :key="conn" class="connection-tag">
          {{ conn }}
        </span>
      </div>
    </div>

    <div class="footer" v-if="link">
      <a :href="link" class="read-more">Read more →</a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'processing',
    validator: (value) => ['input', 'processing', 'output'].includes(value)
  },
  inputs: {
    type: Array,
    default: () => []
  },
  outputs: {
    type: Array,
    default: () => []
  },
  connections: {
    type: Array,
    default: () => []
  },
  link: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.app-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid var(--vp-c-brand);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.app-card.input {
  border-left-color: #10b981;
}

.app-card.processing {
  border-left-color: #f59e0b;
}

.app-card.output {
  border-left-color: #3b82f6;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.app-header h3 {
  margin: 0;
  color: var(--vp-c-brand);
  font-size: 20px;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.input {
  background: #d1fae5;
  color: #065f46;
}

.badge.processing {
  background: #fef3c7;
  color: #92400e;
}

.badge.output {
  background: #dbeafe;
  color: #1e40af;
}

.description {
  color: #64748b;
  margin-bottom: 16px;
  flex-grow: 1;
}

.details {
  margin: 16px 0;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--vp-c-brand);
}

.detail-section ul {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
}

.detail-section li {
  margin: 4px 0;
  color: #64748b;
}

.connections {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.connections h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--vp-c-brand);
}

.connection-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.connection-tag {
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 12px;
  color: #475569;
}

.footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.read-more {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.read-more:hover {
  text-decoration: underline;
}

.dark .app-card {
  background: #1e293b;
}

.dark .app-header h3 {
  color: var(--vp-c-brand-light);
}

.dark .description {
  color: #94a3b8;
}

.dark .detail-section li {
  color: #94a3b8;
}

.dark .connection-tag {
  background: #334155;
  color: #cbd5e1;
}

.dark .connections,
.dark .footer {
  border-color: #334155;
}
</style>
