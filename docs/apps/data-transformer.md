# Data Transformer

Transforms data between formats, applies business rules, performs data mapping, and standardizes data structures.

## Overview

The Data Transformer is a powerful processing application that converts data from various formats, applies complex business rules, and ensures data consistency across the system.

### Key Features

- 🔄 Multi-format conversion (JSON, XML, CSV, Avro, Parquet)
- 📋 Template-based transformations
- 🎯 Business rule engine
- 🗺️ Data mapping and field normalization
- ✨ Data cleansing and standardization
- 📊 Transformation analytics

## Configuration

```json
{
  "input_path": "./data/imported",
  "output_path": "./data/transformed",
  "transformations": [
    {
      "name": "normalize_sales",
      "input_format": "json",
      "output_format": "csv",
      "mapping": "mappings/sales.json",
      "rules": "rules/sales_validation.js"
    }
  ]
}
```

## Transformation Mappings

Create mapping files to define field transformations:

```json
{
  "fields": {
    "customer_id": "$.customerId",
    "order_date": {
      "source": "$.orderDate",
      "transform": "parseDate",
      "format": "ISO8601"
    },
    "total_amount": {
      "source": "$.amount",
      "transform": "currency",
      "round": 2
    }
  }
}
```

## Usage Examples

```bash
# Transform all configured data
./data-transformer --config config.json

# Transform specific mapping
./data-transformer --transformation normalize_sales

# Test transformation without output
./data-transformer --transformation normalize_sales --dry-run
```

## Integration Points

- **Receives from**: API Collector, Database Extractor
- **Sends to**: Enricher, Validator
- **Output**: Normalized data in standardized format

## Related Documentation

- [Enricher](/apps/enricher)
- [Validator](/apps/validator)
