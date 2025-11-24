# Architecture Overview

Complete overview of the console application ecosystem architecture, data flows, and design principles.

<script setup>
import AppGraph from './.vitepress/theme/components/AppGraph.vue'
import IntegrationFlow from './.vitepress/theme/components/IntegrationFlow.vue'
</script>

## System Architecture

Our console application ecosystem follows a **pipeline architecture pattern** with three main layers:

### 1. Input Layer (Data Ingestion)
- File Importer
- API Collector
- Database Extractor

### 2. Processing Layer (Data Transformation)
- Data Transformer
- Validator
- Enricher

### 3. Output Layer (Data Export & Notification)
- Report Generator
- File Exporter
- Notification Service

## Complete Data Flow

<IntegrationFlow
  :steps="[
    { name: 'Data Sources', icon: '🗄️', description: 'Files/APIs/DBs', outputLabel: 'Raw Data' },
    { name: 'Input Apps', icon: '📥', description: 'Collect & Import', outputLabel: 'Imported Data' },
    { name: 'Processing Apps', icon: '⚙️', description: 'Transform & Validate', outputLabel: 'Processed Data' },
    { name: 'Output Apps', icon: '📤', description: 'Export & Notify', outputLabel: 'Final Output' }
  ]"
/>

## Application Interconnections

<AppGraph />

## Design Principles

### 1. Loose Coupling
Applications are loosely coupled through standard interfaces (files, database tables, APIs). Each application can be developed, deployed, and scaled independently.

### 2. Single Responsibility
Each application has a single, well-defined responsibility:
- **File Importer**: Only imports files
- **Validator**: Only validates data
- **Enricher**: Only enriches data

### 3. Fail-Safe Design
- Applications handle errors gracefully
- Failed records are quarantined, not lost
- Retry logic for transient failures
- Comprehensive error logging

### 4. Observability
- Structured logging (JSON format)
- Metrics for monitoring
- Health check endpoints
- Performance tracking

### 5. Idempotency
Applications are designed to be idempotent where possible:
- Re-running an import produces the same result
- Duplicate detection prevents double processing
- State management for incremental processing

## Data Flow Patterns

### Pattern 1: Linear Pipeline

```
File Importer → Validator → Enricher → File Exporter
```

Simple linear flow for straightforward processing.

### Pattern 2: Fan-Out

```
                    → Data Transformer → Report Generator
API Collector →
                    → Validator → Enricher → File Exporter
```

One source feeds multiple processing paths.

### Pattern 3: Fan-In

```
File Importer →
API Collector →     Enricher → Report Generator
DB Extractor →
```

Multiple sources converge into single processor.

### Pattern 4: Complex Network

<IntegrationFlow
  :steps="[
    { name: 'File Importer', icon: '📁', outputLabel: 'CSV Files' },
    { name: 'Validator', icon: '✅', outputLabel: 'Valid Data' },
    { name: 'Enricher', icon: '✨', outputLabel: 'Enriched' },
    { name: 'Report Generator', icon: '📊', outputLabel: 'Reports' },
    { name: 'Notification', icon: '📧', outputLabel: 'Alerts' }
  ]"
/>

## Storage Architecture

### File System Structure

```
/data/
├── imports/          # Input layer outputs
│   └── YYYY-MM-DD/
│       ├── *.csv
│       └── *.meta.json
├── validated/        # After validation
│   └── YYYY-MM-DD/
├── transformed/      # After transformation
│   └── YYYY-MM-DD/
├── enriched/         # After enrichment
│   └── YYYY-MM-DD/
├── reports/          # Generated reports
│   └── YYYY-MM-DD/
├── exports/          # Final exports
│   └── YYYY-MM-DD/
├── errors/           # Failed records
│   └── YYYY-MM-DD/
└── archive/          # Archived data
    └── YYYY-MM/
```

### Database Schema

```
console_apps/
├── integration/     # Integration tables
│   ├── data_staging
│   └── audit_log
├── reference/       # Reference data
│   ├── customers
│   └── products
└── operational/     # App-specific tables
    ├── job_queue
    └── app_status
```

## Deployment Architecture

### Development Environment

```
Developer Workstation
├── Application Repos
├── Docker Compose
│   ├── PostgreSQL
│   ├── MinIO (S3-compatible)
│   └── Redis
└── Shared Volume (/data)
```

### Production Environment

```
Production Infrastructure
├── Application Servers
│   ├── Input Apps (3 instances)
│   ├── Processing Apps (5 instances)
│   └── Output Apps (3 instances)
├── Storage
│   ├── Shared NFS (/data)
│   └── S3 Buckets
├── Database
│   └── PostgreSQL Cluster
└── Monitoring
    ├── Prometheus
    ├── Grafana
    └── ELK Stack
```

## Configuration Management

### Application Configuration

Each application uses a configuration file:

```json
{
  "app_name": "file-importer",
  "environment": "production",
  "logging": {
    "level": "INFO",
    "format": "json",
    "output": "/var/log/apps/file-importer.log"
  },
  "storage": {
    "input_path": "/data/sources",
    "output_path": "/data/imports"
  },
  "integration": {
    "next_app": "validator",
    "retry_attempts": 3
  },
  "monitoring": {
    "metrics_port": 9090,
    "health_check_port": 8080
  }
}
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/console_apps

# Cloud Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=data-bucket

# API Keys
EXTERNAL_API_KEY=...

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO
```

## Monitoring & Observability

### Metrics

Each application exposes metrics:

```
# Processing metrics
app_records_processed_total{app="validator",status="success"} 10000
app_records_processed_total{app="validator",status="failed"} 50
app_processing_duration_seconds{app="validator",quantile="0.99"} 1.5

# System metrics
app_memory_usage_bytes{app="validator"} 524288000
app_cpu_usage_percent{app="validator"} 45

# Integration metrics
integration_files_waiting{target_app="validator"} 5
integration_oldest_file_age_seconds{target_app="validator"} 120
```

### Logging Standard

All applications log in JSON format:

```json
{
  "timestamp": "2025-11-24T10:30:00Z",
  "level": "INFO",
  "app": "file-importer",
  "message": "File imported successfully",
  "context": {
    "filename": "sales_001.csv",
    "size": 1048576,
    "duration_ms": 1250,
    "next_app": "validator"
  },
  "trace_id": "abc-123-def"
}
```

### Health Checks

Each application exposes health endpoint:

```bash
curl http://localhost:8080/health

{
  "status": "healthy",
  "app": "file-importer",
  "version": "1.2.3",
  "uptime_seconds": 3600,
  "checks": {
    "storage": "ok",
    "database": "ok",
    "dependencies": "ok"
  }
}
```

## Error Handling Strategy

### Error Categories

1. **Transient Errors** (Retry)
   - Network timeouts
   - Database connection issues
   - Temporary service unavailability

2. **Validation Errors** (Quarantine)
   - Schema violations
   - Business rule failures
   - Data quality issues

3. **System Errors** (Alert)
   - Out of disk space
   - Memory exhausted
   - Configuration errors

### Error Flow

<IntegrationFlow
  :steps="[
    { name: 'Processing', icon: '⚙️', description: 'Detect Error', outputLabel: 'Error Detected' },
    { name: 'Classify', icon: '🔍', description: 'Error Type', outputLabel: 'Categorized' },
    { name: 'Handle', icon: '🔧', description: 'Retry/Quarantine', outputLabel: 'Resolved' },
    { name: 'Alert', icon: '🚨', description: 'If Critical', outputLabel: 'Team Notified' }
  ]"
/>

## Performance Considerations

### Optimization Strategies

1. **Batch Processing**
   - Process files in batches of 1000-10000 records
   - Reduces I/O overhead

2. **Parallel Processing**
   - Independent files processed in parallel
   - Configurable worker count

3. **Caching**
   - Reference data cached in memory
   - External API responses cached

4. **Incremental Processing**
   - Only process new/changed data
   - Watermarking for databases
   - File modification time checks

### Scalability

- **Horizontal Scaling**: Run multiple instances of applications
- **Vertical Scaling**: Increase resources per instance
- **Data Partitioning**: Split data by date, region, or type
- **Queue-based**: Use message queues for decoupling

## Security Considerations

### Data Protection

- **Encryption at Rest**: Sensitive files encrypted
- **Encryption in Transit**: TLS for all API calls
- **Access Control**: RBAC for file and database access
- **Secrets Management**: Environment variables, never in code

### Audit Trail

- All data access logged
- File operations tracked
- User actions recorded
- Changes versioned

## Disaster Recovery

### Backup Strategy

- **Data Files**: Daily backups to S3
- **Database**: Continuous backup with point-in-time recovery
- **Configuration**: Version controlled in Git
- **Logs**: Retained for 90 days

### Recovery Procedures

1. **File Corruption**: Restore from backup
2. **Application Failure**: Restart with retry
3. **Database Failure**: Failover to replica
4. **Data Center Failure**: Multi-region deployment

## Adding New Applications

### Integration Checklist

When adding a new console application:

- [ ] Define input/output formats
- [ ] Create configuration schema
- [ ] Implement health check endpoint
- [ ] Add structured logging
- [ ] Expose metrics
- [ ] Write documentation
- [ ] Add to architecture diagram
- [ ] Configure monitoring
- [ ] Set up alerts
- [ ] Test error scenarios

### Documentation Template

Use the [application template](/apps/#adding-new-application-documentation) to document new applications.

## Related Documentation

- [All Applications](/apps/)
- [Integration Patterns](/integrations/)
- [File Importer (Example)](/apps/file-importer)

## Architecture Decision Records

### ADR-001: File-based Integration
**Decision**: Use file-based integration as primary pattern
**Rationale**: Simple, reliable, debuggable, natural checkpointing
**Status**: Accepted

### ADR-002: JSON Logging
**Decision**: All applications use structured JSON logging
**Rationale**: Machine-readable, searchable, standardized
**Status**: Accepted

### ADR-003: Shared File System
**Decision**: Use shared NFS for file exchange
**Rationale**: Simplifies deployment, good performance for use case
**Status**: Accepted

### ADR-004: Metadata Files
**Decision**: Require .meta.json file for every data file
**Rationale**: Provides context, enables routing, validates integrity
**Status**: Accepted
