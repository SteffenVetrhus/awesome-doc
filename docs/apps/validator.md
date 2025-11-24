# Validator

Validates data against schemas, business rules, and data quality standards with detailed error reporting.

## Overview

The Validator ensures data quality by checking against defined schemas, applying business rules, and generating comprehensive validation reports.

### Key Features

- ✅ Schema validation (JSON Schema, Avro, XSD)
- 📏 Business rule validation
- 🎯 Data quality checks
- 📊 Validation reporting
- 🔍 Detailed error tracking
- 🚦 Configurable severity levels

## Configuration

```json
{
  "input_path": "./data/imported",
  "output_path": "./data/validated",
  "validations": [
    {
      "name": "csv_validation",
      "schema": "schemas/sales.json",
      "rules": "rules/business_rules.js",
      "error_threshold": 0.05
    }
  ]
}
```

## Usage Examples

```bash
# Validate all files
./validator --config config.json

# Validate specific file
./validator --file data.csv --schema schemas/sales.json

# Generate validation report only
./validator --config config.json --report-only
```

## Validation Output

### Valid Data
- Location: `{output_path}/valid/`
- Contains only records that passed all validations

### Invalid Data
- Location: `{output_path}/invalid/`
- Includes validation error details

### Validation Report
```json
{
  "file": "sales.csv",
  "total_records": 10000,
  "valid_records": 9950,
  "invalid_records": 50,
  "error_rate": 0.005,
  "errors": [
    {
      "row": 42,
      "field": "email",
      "error": "Invalid email format",
      "severity": "error"
    }
  ]
}
```

## Related Documentation

- [File Importer](/apps/file-importer)
- [Enricher](/apps/enricher)
