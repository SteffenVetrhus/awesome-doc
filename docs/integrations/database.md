# Database Integration

Guide for implementing database-based integration patterns between console applications.

## Overview

Database integration allows applications to share data through database tables, enabling real-time access and complex queries.

## Schema Design

### Integration Tables

```sql
-- Staging table for data exchange
CREATE TABLE integration.data_staging (
    id BIGSERIAL PRIMARY KEY,
    source_app VARCHAR(50) NOT NULL,
    target_app VARCHAR(50) NOT NULL,
    record_type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,

    INDEX idx_processing (target_app, status, priority DESC, created_at),
    INDEX idx_cleanup (status, created_at)
);

-- Audit log
CREATE TABLE integration.audit_log (
    id BIGSERIAL PRIMARY KEY,
    staging_id BIGINT REFERENCES integration.data_staging(id),
    app_name VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation Patterns

### 1. Producer Pattern

```python
import psycopg2
import json
from datetime import datetime

class DataProducer:
    def __init__(self, db_conn, source_app):
        self.conn = db_conn
        self.source_app = source_app

    def publish_data(self, target_app, record_type, data, priority=0):
        """Publish data to staging table"""

        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO integration.data_staging
                (source_app, target_app, record_type, data, priority)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (
                self.source_app,
                target_app,
                record_type,
                json.dumps(data),
                priority
            ))

            staging_id = cur.fetchone()[0]
            self.conn.commit()

            return staging_id
```

### 2. Consumer Pattern

```python
class DataConsumer:
    def __init__(self, db_conn, target_app):
        self.conn = db_conn
        self.target_app = target_app

    def consume_batch(self, batch_size=100):
        """Consume batch of pending records"""

        with self.conn.cursor() as cur:
            # Lock and fetch records
            cur.execute("""
                UPDATE integration.data_staging
                SET status = 'processing',
                    updated_at = NOW()
                WHERE id IN (
                    SELECT id
                    FROM integration.data_staging
                    WHERE target_app = %s
                    AND status = 'pending'
                    ORDER BY priority DESC, created_at
                    LIMIT %s
                    FOR UPDATE SKIP LOCKED
                )
                RETURNING id, source_app, record_type, data
            """, (self.target_app, batch_size))

            records = cur.fetchall()
            self.conn.commit()

            return records

    def mark_completed(self, record_id):
        """Mark record as completed"""

        with self.conn.cursor() as cur:
            cur.execute("""
                UPDATE integration.data_staging
                SET status = 'completed',
                    processed_at = NOW(),
                    updated_at = NOW()
                WHERE id = %s
            """, (record_id,))
            self.conn.commit()

    def mark_failed(self, record_id, error_message):
        """Mark record as failed"""

        with self.conn.cursor() as cur:
            cur.execute("""
                UPDATE integration.data_staging
                SET status = CASE
                    WHEN retry_count >= 3 THEN 'failed'
                    ELSE 'pending'
                END,
                retry_count = retry_count + 1,
                error_message = %s,
                updated_at = NOW()
                WHERE id = %s
            """, (error_message, record_id))
            self.conn.commit()
```

### 3. Processing Loop

```python
def process_loop(consumer, process_func):
    """Main processing loop"""

    while True:
        records = consumer.consume_batch(batch_size=100)

        if not records:
            time.sleep(5)  # No records, wait
            continue

        for record_id, source_app, record_type, data in records:
            try:
                # Process the record
                result = process_func(json.loads(data))

                # Mark as completed
                consumer.mark_completed(record_id)

            except Exception as e:
                # Mark as failed
                consumer.mark_failed(record_id, str(e))
                logging.error(f"Failed to process {record_id}: {e}")
```

## Cleanup and Maintenance

### Automated Cleanup

```sql
-- Archive old completed records
INSERT INTO integration.data_staging_archive
SELECT * FROM integration.data_staging
WHERE status = 'completed'
AND processed_at < NOW() - INTERVAL '7 days';

DELETE FROM integration.data_staging
WHERE status = 'completed'
AND processed_at < NOW() - INTERVAL '7 days';

-- Clean up old failed records
DELETE FROM integration.data_staging
WHERE status = 'failed'
AND updated_at < NOW() - INTERVAL '30 days';
```

### Monitoring Queries

```sql
-- Check pending records by app
SELECT target_app, COUNT(*) as pending_count
FROM integration.data_staging
WHERE status = 'pending'
GROUP BY target_app;

-- Check stuck records
SELECT id, target_app, created_at,
       NOW() - created_at as age
FROM integration.data_staging
WHERE status = 'processing'
AND updated_at < NOW() - INTERVAL '1 hour';

-- Check error rates
SELECT source_app, target_app,
       COUNT(*) as total,
       SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
       ROUND(100.0 * SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 2) as error_rate
FROM integration.data_staging
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY source_app, target_app;
```

## Best Practices

1. **Use SKIP LOCKED** for concurrent consumers
2. **Implement retry logic** with exponential backoff
3. **Add indexes** for query performance
4. **Monitor table growth** and archive regularly
5. **Use connection pooling** for efficiency
6. **Implement circuit breakers** for failing targets
7. **Add audit logging** for traceability
8. **Use transactions** for consistency

## Related Documentation

- [Database Extractor](/apps/db-extractor)
- [Integration Patterns Overview](/integrations/)
