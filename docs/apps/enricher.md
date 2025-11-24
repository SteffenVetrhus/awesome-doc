# Enricher

Enriches data with additional information from reference data, external sources, and calculated fields.

## Overview

The Enricher augments existing data with supplementary information, performs lookups, and calculates derived fields to create a complete dataset.

### Key Features

- 🔍 Reference data lookups
- 🌐 External API enrichment
- 🧮 Calculated field generation
- 📊 Data aggregation
- 💾 Caching for performance
- 🔄 Batch and streaming modes

## Configuration

```json
{
  "input_path": "./data/validated",
  "output_path": "./data/enriched",
  "enrichments": [
    {
      "name": "customer_enrichment",
      "lookup_source": "reference/customers.csv",
      "lookup_key": "customer_id",
      "fields": ["customer_name", "segment", "lifetime_value"]
    },
    {
      "name": "geocoding",
      "api_endpoint": "https://api.geocoding.com/v1/lookup",
      "input_field": "address",
      "output_fields": ["latitude", "longitude", "timezone"]
    }
  ]
}
```

## Usage Examples

```bash
# Enrich all data
./enricher --config config.json

# Enrich with specific enrichment
./enricher --enrichment customer_enrichment --input data.csv

# Update reference data cache
./enricher --refresh-cache
```

## Enrichment Strategies

### 1. Reference Data Lookup
Fast in-memory lookups from static reference files

### 2. External API Enrichment
Real-time enrichment from external services with caching

### 3. Calculated Fields
Generate derived fields using formulas and aggregations

### 4. Machine Learning Enrichment
Apply ML models for predictions and classifications

## Integration Points

- **Receives from**: Validator, Data Transformer
- **Sends to**: Report Generator, File Exporter
- **Reference Data**: Reference data files, APIs

## Related Documentation

- [Report Generator](/apps/report-generator)
- [File Exporter](/apps/file-exporter)
