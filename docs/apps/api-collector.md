# API Collector

Collects data from external REST APIs and webhooks with intelligent retry logic, rate limiting, and automatic pagination support.

<script setup>
import IntegrationFlow from '../.vitepress/theme/components/IntegrationFlow.vue'
</script>

## Overview

The API Collector is a versatile console application that interfaces with external APIs to collect data for processing. It handles authentication, rate limiting, pagination, and error recovery automatically.

### Key Features

- 🌐 REST API, GraphQL, and webhook support
- 🔐 Multiple authentication methods (OAuth2, API keys, JWT)
- ⏱️ Built-in rate limiting and throttling
- 📄 Automatic pagination handling
- 🔄 Intelligent retry with exponential backoff
- 💾 Response caching and deduplication

## Configuration

```json
{
  "endpoints": [
    {
      "name": "sales_api",
      "url": "https://api.example.com/v1/sales",
      "method": "GET",
      "auth_type": "bearer",
      "auth_token": "${SALES_API_TOKEN}",
      "rate_limit": 100,
      "pagination": {
        "type": "offset",
        "page_size": 100
      }
    }
  ],
  "output_path": "./data/api-responses",
  "retry_attempts": 3,
  "timeout_seconds": 30,
  "cache_responses": true
}
```

## Data Flow

<IntegrationFlow
  :steps="[
    { name: 'External APIs', icon: '🌐', description: 'REST/GraphQL', outputLabel: 'JSON Data' },
    { name: 'API Collector', icon: '📡', description: 'This Application', outputLabel: 'Collected Data' },
    { name: 'Data Transformer', icon: '⚙️', description: 'Transforms Data', outputLabel: 'Normalized Data' },
    { name: 'Enricher', icon: '✨', description: 'Enriches Data' }
  ]"
/>

## Usage Examples

```bash
# Collect from configured endpoints
./api-collector --config endpoints.json

# Collect specific endpoint
./api-collector --endpoint sales_api

# Force refresh (ignore cache)
./api-collector --endpoint sales_api --no-cache

# Dry run to test configuration
./api-collector --config endpoints.json --dry-run
```

## Output Format

```json
{
  "collection_id": "uuid-1234",
  "endpoint": "sales_api",
  "timestamp": "2025-11-24T10:30:00Z",
  "status": "success",
  "records_collected": 1500,
  "data": [ /* collected records */ ],
  "metadata": {
    "rate_limit_remaining": 95,
    "response_time_ms": 850,
    "pages_fetched": 15
  }
}
```

## Monitoring & Troubleshooting

### Metrics
- API response times
- Rate limit utilization
- Success/failure rates
- Records collected per endpoint

### Common Issues

**Rate Limit Exceeded**: Adjust `rate_limit` or enable request spacing

**Authentication Failed**: Verify tokens and expiration

**Timeout**: Increase `timeout_seconds` or optimize API queries

## Related Documentation

- [Data Transformer](/apps/data-transformer)
- [API Integration Pattern](/integrations/api)
