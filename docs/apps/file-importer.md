# File Importer

Imports files from various sources including local directories, network shares, and cloud storage with automatic detection and metadata extraction.

<script setup>
import IntegrationFlow from '../.vitepress/theme/components/IntegrationFlow.vue'
</script>

## Overview

The File Importer is a robust console application designed to collect files from multiple sources, extract metadata, and prepare them for downstream processing. It supports various file types and includes built-in retry logic and error handling.

### Key Features

- 📁 Multi-source support (local, network, cloud)
- 🔍 Automatic file type detection
- 📊 Metadata extraction
- 🔄 Retry logic with exponential backoff
- 📝 Comprehensive logging
- ⚡ Parallel processing support

## Configuration

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `source_path` | Source directory or bucket | Yes | - |
| `output_path` | Where to write imported files | Yes | `./output` |
| `file_pattern` | Glob pattern for files to import | No | `*.*` |
| `max_file_size` | Maximum file size in MB | No | `100` |
| `parallel_jobs` | Number of parallel import jobs | No | `4` |
| `retry_attempts` | Number of retry attempts | No | `3` |

### Configuration Example

```json
{
  "source_path": "/mnt/shared/imports",
  "output_path": "./data/imported",
  "file_pattern": "*.{csv,json,xml}",
  "max_file_size": 500,
  "parallel_jobs": 8,
  "retry_attempts": 5,
  "metadata_enabled": true
}
```

## Input

- **Source Types**:
  - Local filesystem directories
  - Network shares (SMB, NFS)
  - Cloud storage (S3, Azure Blob, GCS)
- **Supported Formats**: CSV, JSON, XML, TXT, Excel, Parquet
- **File Size**: Up to 500MB per file (configurable)

## Output

### Imported Files
- **Location**: Configured output directory
- **Structure**: `{output_path}/{date}/{source}/{filename}`
- **Formats**: Original format preserved

### Metadata Files
- **Format**: JSON
- **Location**: `{output_path}/{date}/metadata/{filename}.meta.json`
- **Contents**:
  ```json
  {
    "original_filename": "data.csv",
    "import_timestamp": "2025-11-24T10:30:00Z",
    "source": "s3://bucket/path/data.csv",
    "file_size": 1048576,
    "file_hash": "sha256:abc123...",
    "file_type": "text/csv",
    "row_count": 10000
  }
  ```

## Data Flow

<IntegrationFlow
  :steps="[
    { name: 'File Source', icon: '📁', description: 'Local/Network/Cloud', outputLabel: 'Raw Files' },
    { name: 'File Importer', icon: '📥', description: 'This Application', outputLabel: 'CSV + Metadata' },
    { name: 'Validator', icon: '✅', description: 'Validates Data', outputLabel: 'Validated Data' },
    { name: 'Enricher', icon: '✨', description: 'Enriches Data' }
  ]"
/>

## Usage Examples

### Basic Usage

```bash
# Import from local directory
./file-importer --config config.json

# Import specific pattern
./file-importer --source "/data/imports" --pattern "*.csv"

# Import with custom output
./file-importer --source "/data/imports" --output "./processed"
```

### Cloud Storage

```bash
# Import from S3
./file-importer --source "s3://my-bucket/imports/" --aws-profile prod

# Import from Azure Blob
./file-importer --source "azure://container/path" --azure-account myaccount
```

### Advanced Options

```bash
# Parallel processing
./file-importer --config config.json --parallel 16

# Dry run mode
./file-importer --config config.json --dry-run

# Verbose logging
./file-importer --config config.json --verbose
```

## Integration Points

### Downstream Applications

The File Importer sends data to:

- **Validator**: CSV files are validated for schema compliance
- **Data Transformer**: JSON and XML files are transformed
- **Archive Service**: Original files are archived after processing

### Output File Structure

```
output/
├── 2025-11-24/
│   ├── imports/
│   │   ├── file1.csv
│   │   ├── file2.json
│   │   └── file3.xml
│   └── metadata/
│       ├── file1.csv.meta.json
│       ├── file2.json.meta.json
│       └── file3.xml.meta.json
└── logs/
    └── file-importer-2025-11-24.log
```

## Monitoring & Logging

### Metrics

The application exposes the following metrics:

- `files_imported_total`: Total number of files imported
- `files_failed_total`: Total number of failed imports
- `import_duration_seconds`: Time taken per import
- `file_size_bytes`: Size of imported files

### Logs

- **Location**: `./logs/file-importer-{date}.log`
- **Format**: JSON structured logging
- **Levels**: DEBUG, INFO, WARN, ERROR

Example log entry:
```json
{
  "timestamp": "2025-11-24T10:30:00Z",
  "level": "INFO",
  "message": "File imported successfully",
  "filename": "data.csv",
  "size": 1048576,
  "duration_ms": 1250
}
```

### Alerts

Configure alerts for:
- Import failures exceeding threshold
- Files exceeding size limit
- Source unavailability
- Low disk space

## Error Handling

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `E001` | Source not accessible | Check network connectivity and permissions |
| `E002` | File too large | Increase `max_file_size` or split file |
| `E003` | Unsupported format | Check file type against supported formats |
| `E004` | Output directory full | Clear space or change output directory |

### Retry Logic

- Failed imports are automatically retried
- Exponential backoff: 1s, 2s, 4s, 8s, 16s
- After max retries, file is moved to error queue
- Errors are logged with full context

## Troubleshooting

### Issue: Files not being imported

**Check:**
1. Source path is accessible
2. File pattern matches your files
3. Sufficient permissions
4. Check logs for specific errors

### Issue: Slow import performance

**Solutions:**
- Increase `parallel_jobs` parameter
- Check network bandwidth
- Optimize source storage
- Consider batching smaller files

### Issue: Metadata not generated

**Check:**
- `metadata_enabled` is set to `true`
- Output directory has write permissions
- Check logs for metadata generation errors

## Performance Tuning

### Recommendations

- Use SSD storage for output directory
- Increase parallel jobs for small files
- Use compression for cloud storage
- Enable incremental imports for large datasets

### Benchmarks

| File Count | Size | Parallel Jobs | Duration |
|------------|------|---------------|----------|
| 100 | 1MB each | 4 | 45s |
| 100 | 1MB each | 8 | 28s |
| 1000 | 100KB each | 16 | 120s |

## Related Documentation

- [Validator](/apps/validator) - Validates imported files
- [File-based Integration](/integrations/file-based) - Integration pattern details
- [Architecture Overview](/architecture) - System architecture
