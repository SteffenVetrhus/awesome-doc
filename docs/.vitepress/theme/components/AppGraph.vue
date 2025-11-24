<template>
  <div class="graph-container">
    <h3>Application Ecosystem Overview</h3>
    <div ref="graphContainer" class="cytoscape-container"></div>
    <div class="legend">
      <div class="legend-item">
        <span class="legend-color input"></span>
        <span>Input Apps</span>
      </div>
      <div class="legend-item">
        <span class="legend-color processing"></span>
        <span>Processing Apps</span>
      </div>
      <div class="legend-item">
        <span class="legend-color output"></span>
        <span>Output Apps</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import cytoscape from 'cytoscape'

const graphContainer = ref(null)

const props = defineProps({
  apps: {
    type: Array,
    default: () => []
  },
  connections: {
    type: Array,
    default: () => []
  }
})

onMounted(() => {
  // Default data if not provided
  const defaultApps = props.apps.length > 0 ? props.apps : [
    { id: 'file-importer', label: 'File Importer', type: 'input' },
    { id: 'api-collector', label: 'API Collector', type: 'input' },
    { id: 'db-extractor', label: 'DB Extractor', type: 'input' },
    { id: 'data-transformer', label: 'Data Transformer', type: 'processing' },
    { id: 'validator', label: 'Validator', type: 'processing' },
    { id: 'enricher', label: 'Enricher', type: 'processing' },
    { id: 'report-generator', label: 'Report Generator', type: 'output' },
    { id: 'file-exporter', label: 'File Exporter', type: 'output' },
    { id: 'notification-service', label: 'Notification Service', type: 'output' }
  ]

  const defaultConnections = props.connections.length > 0 ? props.connections : [
    { from: 'file-importer', to: 'validator', label: 'CSV Files' },
    { from: 'api-collector', to: 'data-transformer', label: 'JSON Data' },
    { from: 'db-extractor', to: 'data-transformer', label: 'SQL Results' },
    { from: 'validator', to: 'enricher', label: 'Validated Data' },
    { from: 'data-transformer', to: 'enricher', label: 'Transformed Data' },
    { from: 'enricher', to: 'report-generator', label: 'Enriched Data' },
    { from: 'enricher', to: 'file-exporter', label: 'Final Data' },
    { from: 'report-generator', to: 'notification-service', label: 'Reports' }
  ]

  const nodes = defaultApps.map(app => ({
    data: { id: app.id, label: app.label, type: app.type }
  }))

  const edges = defaultConnections.map((conn, idx) => ({
    data: {
      id: `edge-${idx}`,
      source: conn.from,
      target: conn.to,
      label: conn.label
    }
  }))

  const cy = cytoscape({
    container: graphContainer.value,
    elements: [...nodes, ...edges],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#646cff',
          'label': 'data(label)',
          'color': '#fff',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '12px',
          'width': '120px',
          'height': '50px',
          'shape': 'roundrectangle',
          'text-wrap': 'wrap',
          'text-max-width': '100px'
        }
      },
      {
        selector: 'node[type="input"]',
        style: {
          'background-color': '#10b981'
        }
      },
      {
        selector: 'node[type="processing"]',
        style: {
          'background-color': '#f59e0b'
        }
      },
      {
        selector: 'node[type="output"]',
        style: {
          'background-color': '#3b82f6'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#94a3b8',
          'target-arrow-color': '#94a3b8',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': '10px',
          'text-rotation': 'autorotate',
          'text-margin-y': -10
        }
      }
    ],
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 30,
      spacingFactor: 1.5
    }
  })

  // Add interactivity
  cy.on('tap', 'node', function(evt) {
    const node = evt.target
    const appId = node.data('id')
    window.location.href = `/apps/${appId}`
  })
})
</script>

<style scoped>
.graph-container {
  margin: 2rem 0;
}

.graph-container h3 {
  margin-bottom: 1rem;
  color: var(--vp-c-brand);
}

.cytoscape-container {
  width: 100%;
  height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.dark .cytoscape-container {
  background: #1f2937;
  border-color: #374151;
}

.legend {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.input {
  background-color: #10b981;
}

.legend-color.processing {
  background-color: #f59e0b;
}

.legend-color.output {
  background-color: #3b82f6;
}
</style>
