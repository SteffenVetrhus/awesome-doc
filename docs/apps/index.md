# Console Applications

Our ecosystem consists of 20+ specialized console applications that work together to collect, process, and output data efficiently.

<script setup>
import AppCard from '../.vitepress/theme/components/AppCard.vue'
</script>

## Input Applications

Applications that collect and ingest data from various sources.

<div class="app-grid">
  <AppCard
    name="File Importer"
    type="input"
    description="Imports files from various sources including local directories, network shares, and cloud storage"
    :inputs="['Local files', 'Network shares', 'S3 buckets']"
    :outputs="['CSV files', 'JSON metadata']"
    :connections="['Validator']"
    link="/apps/file-importer"
  />

  <AppCard
    name="API Collector"
    type="input"
    description="Collects data from external REST APIs and webhooks with retry logic and rate limiting"
    :inputs="['REST APIs', 'Webhooks', 'GraphQL endpoints']"
    :outputs="['JSON data', 'API logs']"
    :connections="['Data Transformer']"
    link="/apps/api-collector"
  />

  <AppCard
    name="Database Extractor"
    type="input"
    description="Extracts data from various databases using optimized queries and incremental loading"
    :inputs="['SQL databases', 'NoSQL databases', 'Data warehouses']"
    :outputs="['Query results', 'Delta files']"
    :connections="['Data Transformer']"
    link="/apps/db-extractor"
  />
</div>

## Processing Applications

Applications that transform, validate, and enrich data.

<div class="app-grid">
  <AppCard
    name="Data Transformer"
    type="processing"
    description="Transforms data between formats, applies business rules, and performs data mapping"
    :inputs="['JSON data', 'SQL results', 'XML files']"
    :outputs="['Normalized data', 'Transformation logs']"
    :connections="['Enricher']"
    link="/apps/data-transformer"
  />

  <AppCard
    name="Validator"
    type="processing"
    description="Validates data against schemas, business rules, and data quality standards"
    :inputs="['CSV files', 'JSON data']"
    :outputs="['Validated data', 'Validation reports']"
    :connections="['Enricher']"
    link="/apps/validator"
  />

  <AppCard
    name="Enricher"
    type="processing"
    description="Enriches data with additional information from reference data and external sources"
    :inputs="['Validated data', 'Transformed data']"
    :outputs="['Enriched data', 'Enrichment logs']"
    :connections="['Report Generator', 'File Exporter']"
    link="/apps/enricher"
  />
</div>

## Output Applications

Applications that generate reports, export data, and send notifications.

<div class="app-grid">
  <AppCard
    name="Report Generator"
    type="output"
    description="Generates reports in various formats including PDF, Excel, and HTML"
    :inputs="['Enriched data', 'Report templates']"
    :outputs="['PDF reports', 'Excel files', 'HTML dashboards']"
    :connections="['Notification Service']"
    link="/apps/report-generator"
  />

  <AppCard
    name="File Exporter"
    type="output"
    description="Exports processed data to various destinations and formats"
    :inputs="['Enriched data']"
    :outputs="['CSV exports', 'JSON files', 'Parquet files']"
    link="/apps/file-exporter"
  />

  <AppCard
    name="Notification Service"
    type="output"
    description="Sends notifications via email, Slack, Teams, and other channels"
    :inputs="['Reports', 'Alerts', 'Status updates']"
    :outputs="['Email notifications', 'Slack messages', 'Teams alerts']"
    link="/apps/notification-service"
  />
</div>

## Adding New Application Documentation

To document a new console application:

1. Create a new markdown file in the `docs/apps/` directory
2. Use the template below as a starting point
3. Update the sidebar in `docs/.vitepress/config.js`
4. Add the application to the graph data if it connects to other apps

### Documentation Template

```markdown
# Application Name

Brief description of what the application does.

## Overview

Detailed description of the application's purpose and functionality.

## Configuration

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `param1` | Description | Yes | - |
| `param2` | Description | No | `value` |

## Input

- **Format**: JSON, CSV, etc.
- **Source**: Where data comes from
- **Schema**: Link to schema documentation

## Output

- **Format**: JSON, CSV, etc.
- **Destination**: Where data goes
- **Schema**: Link to schema documentation

## Usage Examples

\`\`\`bash
./app-name --config config.json --input data/
\`\`\`

## Integration Points

- **Receives data from**: List of upstream applications
- **Sends data to**: List of downstream applications

## Monitoring & Logging

- **Metrics**: What metrics are exposed
- **Logs**: Log format and location
- **Alerts**: What alerts are configured

## Troubleshooting

Common issues and their solutions.
```

<style scoped>
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin: 32px 0;
}
</style>
