<template>
  <div class="integration-flow">
    <div v-for="(step, index) in steps" :key="index" class="flow-step">
      <div class="flow-item">
        <div class="icon">{{ step.icon || '📦' }}</div>
        <div class="name">{{ step.name }}</div>
        <div class="description" v-if="step.description">{{ step.description }}</div>
      </div>
      <div v-if="index < steps.length - 1" class="flow-arrow">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 5 20 L 30 20 M 25 15 L 30 20 L 25 25"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"/>
        </svg>
        <div class="arrow-label" v-if="step.outputLabel">{{ step.outputLabel }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  steps: {
    type: Array,
    required: true,
    // Expected format: [{ name: 'App Name', icon: '📥', description: 'optional', outputLabel: 'Data Type' }]
  }
})
</script>

<style scoped>
.integration-flow {
  display: flex;
  align-items: center;
  padding: 32px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  margin: 32px 0;
  overflow-x: auto;
}

.flow-step {
  display: flex;
  align-items: center;
}

.flow-item {
  min-width: 180px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.flow-item:hover {
  transform: scale(1.05);
}

.icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.description {
  font-size: 12px;
  color: #64748b;
}

.flow-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 16px;
  position: relative;
}

.flow-arrow svg {
  color: var(--vp-c-brand);
}

.arrow-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 100%);
  white-space: nowrap;
  font-size: 11px;
  color: #64748b;
  background: white;
  padding: 2px 8px;
  border-radius: 4px;
  margin-top: 8px;
  font-weight: 500;
}

.dark .integration-flow {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.dark .flow-item {
  background: #334155;
}

.dark .name {
  color: #f1f5f9;
}

.dark .description {
  color: #94a3b8;
}

.dark .arrow-label {
  background: #1e293b;
  color: #94a3b8;
}
</style>
