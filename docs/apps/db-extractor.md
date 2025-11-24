# Database Extractor

Extracts data from various databases using optimized queries, incremental loading strategies, and connection pooling.

<script setup>
import IntegrationFlow from '../.vitepress/theme/components/IntegrationFlow.vue'
</script>

## Overview

The Database Extractor efficiently pulls data from SQL and NoSQL databases with support for incremental extraction, query optimization, and parallel processing.

### Key Features

- 🗄️ Multi-database support (PostgreSQL, MySQL, SQL Server, MongoDB, etc.)
- 📊 Incremental extraction with watermarking
- ⚡ Connection pooling and query optimization
- 🔀 Parallel table extraction
- 📈 Change Data Capture (CDC) support
- 💾 Configurable batch sizes

## Configuration

```json
{
  "connections": {
    "prod_db": {
      "type": "postgresql",
      "host": "db.example.com",
      "port": 5432,
      "database": "sales",
      "username": "extract_user",
      "password": "${DB_PASSWORD}",
      "pool_size": 10
    }
  },
  "extractions": [
    {
      "name": "daily_sales",
      "connection": "prod_db",
      "query": "SELECT * FROM sales WHERE date >= $last_run",
      "incremental": true,
      "batch_size": 10000
    }
  ],
  "output_path": "./data/extracts"
}
```

## Data Flow

<IntegrationFlow
  :steps="[
    { name: 'Source Database', icon: '🗄️', description: 'SQL/NoSQL', outputLabel: 'Query Results' },
    { name: 'DB Extractor', icon: '📊', description: 'This Application', outputLabel: 'Extracted Data' },
    { name: 'Data Transformer', icon: '⚙️', description: 'Transforms Data', outputLabel: 'Normalized Data' }
  ]"
/>

## Usage Examples

```bash
# Extract all configured queries
./db-extractor --config config.json

# Extract specific query
./db-extractor --extraction daily_sales

# Full refresh (ignore incremental)
./db-extractor --extraction daily_sales --full-refresh

# Parallel extraction
./db-extractor --config config.json --parallel 4
```

## Output Format

- **Format**: CSV or Parquet
- **Location**: `{output_path}/{date}/{extraction_name}.csv`
- **Metadata**: Includes row count, extraction time, watermark

## Performance Optimization

- Use appropriate indexes on source tables
- Adjust `batch_size` based on row size
- Enable parallel extraction for independent tables
- Use incremental mode for large tables
- Monitor connection pool utilization

## Related Documentation

- [Data Transformer](/apps/data-transformer)
- [Database Integration Pattern](/integrations/database)
