# Integration Patterns

Our console applications integrate using several well-established patterns to ensure reliable data flow and loose coupling between components.

<script setup>
import IntegrationFlow from '../.vitepress/theme/components/IntegrationFlow.vue'
</script>

## Overview

Applications in our ecosystem communicate through three primary integration patterns:

1. **File-based Integration** - Applications exchange data through files
2. **Database Integration** - Applications share data through database tables
3. **API Integration** - Applications communicate via REST APIs

## File-based Integration

The most common pattern in our ecosystem. Applications write output files that other applications read as input.

### Advantages

- ✅ Simple and reliable
- ✅ Easy to debug and monitor
- ✅ Natural checkpointing
- ✅ Replay capability
- ✅ No tight coupling

### Typical Flow

<IntegrationFlow
  :steps="[
    { name: 'Producer App', icon: '📝', description: 'Writes files', outputLabel: 'CSV/JSON Files' },
    { name: 'File System', icon: '💾', description: 'Shared Storage', outputLabel: 'File Path' },
    { name: 'Consumer App', icon: '📖', description: 'Reads files', outputLabel: 'Processed Data' }
  ]"
/>

### Best Practices

- Use consistent file naming conventions
- Include timestamp in filenames
- Generate metadata/manifest files
- Implement file archiving strategy
- Use atomic writes (write to temp, then move)
- Validate files before processing

### Example File Structure

```
/data/
├── imports/          # Raw imported files
│   └── 2025-11-24/
│       ├── sales_001.csv
│       └── sales_001.meta.json
├── validated/        # Validated files
│   └── 2025-11-24/
│       └── sales_001_valid.csv
├── enriched/         # Enriched files
│   └── 2025-11-24/
│       └── sales_001_enriched.csv
└── exports/          # Final exports
    └── 2025-11-24/
        └── sales_001_final.csv
```

### File Naming Convention

Follow this pattern: `{app}_{type}_{date}_{sequence}.{ext}`

Examples:
- `file-importer_sales_2025-11-24_001.csv`
- `validator_report_2025-11-24_001.json`
- `enricher_final_2025-11-24_001.csv.gz`

### Metadata Files

Include metadata files alongside data files:

```json
{
  "filename": "sales_001.csv",
  "created_at": "2025-11-24T10:30:00Z",
  "created_by": "file-importer",
  "row_count": 10000,
  "file_size": 1048576,
  "checksum": "sha256:abc123...",
  "schema_version": "v2.0",
  "next_app": "validator"
}
```

## Database Integration

Applications share data through database tables, enabling real-time access to shared information.

### Advantages

- ✅ Real-time data access
- ✅ Complex queries possible
- ✅ ACID guarantees
- ✅ Centralized data management

### Typical Flow

<IntegrationFlow
  :steps="[
    { name: 'Producer App', icon: '📝', description: 'Writes to DB', outputLabel: 'INSERT/UPDATE' },
    { name: 'Database', icon: '🗄️', description: 'Shared Tables', outputLabel: 'Query' },
    { name: 'Consumer App', icon: '📖', description: 'Reads from DB', outputLabel: 'Processed Data' }
  ]"
/>

### Best Practices

- Use dedicated integration schemas
- Implement proper indexing
- Use staging tables for bulk operations
- Add audit columns (created_at, updated_at, created_by)
- Use database views for complex data access
- Implement soft deletes
- Monitor table growth and performance

### Example Schema

```sql
CREATE TABLE integration.data_staging (
    id BIGSERIAL PRIMARY KEY,
    source_app VARCHAR(50) NOT NULL,
    target_app VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    INDEX idx_status_created (status, created_at),
    INDEX idx_target_app (target_app, status)
);
```

### Status Tracking

Use status fields to track processing:
- `pending` - Ready to be processed
- `processing` - Currently being processed
- `completed` - Successfully processed
- `failed` - Processing failed
- `archived` - Moved to archive

## API Integration

Applications expose REST APIs for real-time communication and external integrations.

### Advantages

- ✅ Real-time communication
- ✅ Standardized protocols
- ✅ Easy external integration
- ✅ Request/response pattern

### Typical Flow

<IntegrationFlow
  :steps="[
    { name: 'Client App', icon: '📱', description: 'Makes Request', outputLabel: 'HTTP Request' },
    { name: 'API Gateway', icon: '🚪', description: 'Routes Request', outputLabel: 'Forwarded' },
    { name: 'Service App', icon: '⚙️', description: 'Processes', outputLabel: 'Response' }
  ]"
/>

### Best Practices

- Use RESTful conventions
- Version your APIs (v1, v2)
- Implement rate limiting
- Use authentication (API keys, OAuth)
- Provide comprehensive error messages
- Document with OpenAPI/Swagger
- Implement idempotency for safety
- Use async patterns for long operations

### API Design Example

```
# Get application status
GET /api/v1/apps/{app_id}/status

# Submit job
POST /api/v1/jobs
{
  "app": "data-transformer",
  "config": {...}
}

# Get job status
GET /api/v1/jobs/{job_id}

# Get job results
GET /api/v1/jobs/{job_id}/results
```

### Error Handling

Return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid configuration provided",
    "details": [
      {
        "field": "input_path",
        "issue": "Path does not exist"
      }
    ],
    "request_id": "req_123456"
  }
}
```

## Choosing the Right Pattern

| Requirement | File-based | Database | API |
|-------------|-----------|----------|-----|
| High volume | ✅ | ⚠️ | ❌ |
| Real-time | ❌ | ✅ | ✅ |
| Simple setup | ✅ | ⚠️ | ⚠️ |
| Replay capability | ✅ | ⚠️ | ❌ |
| Complex queries | ❌ | ✅ | ⚠️ |
| External access | ⚠️ | ❌ | ✅ |

## Monitoring Integration Points

### Key Metrics

- **Data flow latency**: Time between output and input
- **Error rates**: Failed transfers or API calls
- **Data volume**: Amount of data transferred
- **Queue depth**: Pending items to process

### Health Checks

Implement health checks at each integration point:

```bash
# File-based: Check for stuck files
find /data/imports -type f -mmin +60

# Database: Check pending records
SELECT COUNT(*) FROM integration.data_staging
WHERE status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';

# API: Health endpoint
curl https://api.example.com/health
```

## Related Documentation

- [File-based Integration Details](/integrations/file-based)
- [Database Integration Details](/integrations/database)
- [API Integration Details](/integrations/api)
- [Architecture Overview](/architecture)
