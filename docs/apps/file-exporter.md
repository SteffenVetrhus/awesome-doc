# File Exporter

Exports processed data to various destinations and formats including local storage, network shares, cloud storage, and SFTP servers.

## Overview

The File Exporter is the final stage output application that delivers processed data to configured destinations with support for multiple formats and compression options.

### Key Features

- 📤 Multi-destination support
- 🗜️ Compression (gzip, zip, bzip2)
- 🔐 Encryption support
- 📁 Custom file naming patterns
- 🔄 Incremental and full exports
- ✅ Export verification

## Configuration

```json
{
  "input_path": "./data/enriched",
  "exports": [
    {
      "name": "daily_export",
      "destination": "s3://my-bucket/exports/",
      "format": "csv",
      "compression": "gzip",
      "naming_pattern": "export_{date}_{sequence}.csv.gz",
      "schedule": "daily"
    },
    {
      "name": "partner_feed",
      "destination": "sftp://partner.com/incoming/",
      "format": "parquet",
      "credentials": "${SFTP_CREDENTIALS}"
    }
  ]
}
```

## Supported Destinations

- **Local**: Local filesystem paths
- **Network**: SMB/CIFS shares, NFS mounts
- **Cloud**: S3, Azure Blob, Google Cloud Storage
- **SFTP**: Secure FTP servers
- **HTTP**: POST to REST endpoints

## Export Formats

- CSV (with custom delimiters)
- JSON (line-delimited or array)
- Parquet (columnar format)
- Avro (with schema)
- Excel (XLSX)
- XML

## Usage Examples

```bash
# Export all configured exports
./file-exporter --config config.json

# Export specific export
./file-exporter --export daily_export

# Dry run to test configuration
./file-exporter --export daily_export --dry-run

# Force full export
./file-exporter --export daily_export --full
```

## File Naming Patterns

Use variables in naming patterns:
- `{date}`: Current date (YYYY-MM-DD)
- `{datetime}`: Current datetime
- `{sequence}`: Auto-incrementing sequence
- `{hash}`: Content hash
- `{env}`: Environment name

Example: `export_{date}_{sequence}.csv` → `export_2025-11-24_001.csv`

## Export Verification

After export, the application:
1. Verifies file integrity
2. Checks destination accessibility
3. Generates export manifest
4. Logs export metrics

## Integration Points

- **Receives from**: Enricher, Report Generator
- **Sends to**: External systems, partners, data lakes
- **Output**: Files in configured destinations

## Related Documentation

- [Enricher](/apps/enricher)
- [File-based Integration](/integrations/file-based)
