# API Integration

Guide for implementing REST API integration patterns between console applications and external systems.

## Overview

API integration enables real-time communication between applications using HTTP/REST protocols.

## API Design Standards

### URL Structure

```
/api/v{version}/{resource}/{id?}/{action?}
```

Examples:
- `GET /api/v1/jobs` - List jobs
- `GET /api/v1/jobs/123` - Get job details
- `POST /api/v1/jobs` - Create job
- `POST /api/v1/jobs/123/cancel` - Cancel job
- `GET /api/v1/apps/validator/status` - Get app status

### Response Format

```json
{
  "status": "success",
  "data": {
    "id": 123,
    "type": "validation",
    "status": "completed"
  },
  "meta": {
    "timestamp": "2025-11-24T10:30:00Z",
    "request_id": "req_abc123"
  }
}
```

### Error Format

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "email",
        "issue": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-11-24T10:30:00Z",
    "request_id": "req_abc123"
  }
}
```

## Implementation

### API Server

```python
from flask import Flask, request, jsonify
import uuid
from datetime import datetime

app = Flask(__name__)

@app.route('/api/v1/jobs', methods=['POST'])
def create_job():
    """Create new job"""

    # Generate request ID
    request_id = str(uuid.uuid4())

    try:
        # Validate input
        data = request.json
        if not data or 'config' not in data:
            return jsonify({
                'status': 'error',
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': 'Missing required field: config'
                },
                'meta': {
                    'timestamp': datetime.now().isoformat(),
                    'request_id': request_id
                }
            }), 400

        # Create job
        job_id = queue_job(data['config'])

        return jsonify({
            'status': 'success',
            'data': {
                'job_id': job_id,
                'status': 'queued'
            },
            'meta': {
                'timestamp': datetime.now().isoformat(),
                'request_id': request_id
            }
        }), 201

    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': str(e)
            },
            'meta': {
                'timestamp': datetime.now().isoformat(),
                'request_id': request_id
            }
        }), 500

@app.route('/api/v1/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """Get job status"""

    job = get_job_status(job_id)

    if not job:
        return jsonify({
            'status': 'error',
            'error': {
                'code': 'NOT_FOUND',
                'message': f'Job {job_id} not found'
            }
        }), 404

    return jsonify({
        'status': 'success',
        'data': job
    })
```

### API Client

```python
import requests
import time
from typing import Optional

class APIClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def submit_job(self, config: dict) -> dict:
        """Submit job to API"""

        response = self._request(
            'POST',
            '/api/v1/jobs',
            json={'config': config}
        )

        return response['data']

    def get_job_status(self, job_id: int) -> dict:
        """Get job status"""

        response = self._request(
            'GET',
            f'/api/v1/jobs/{job_id}'
        )

        return response['data']

    def wait_for_job(self, job_id: int, timeout: int = 300) -> dict:
        """Wait for job completion"""

        start_time = time.time()

        while time.time() - start_time < timeout:
            status = self.get_job_status(job_id)

            if status['status'] in ['completed', 'failed']:
                return status

            time.sleep(5)

        raise TimeoutError(f'Job {job_id} did not complete in {timeout}s')

    def _request(self, method: str, path: str, **kwargs) -> dict:
        """Make API request with retry logic"""

        url = f"{self.base_url}{path}"
        max_retries = 3

        for attempt in range(max_retries):
            try:
                response = self.session.request(method, url, **kwargs)
                response.raise_for_status()
                return response.json()

            except requests.exceptions.HTTPError as e:
                if e.response.status_code >= 500 and attempt < max_retries - 1:
                    # Retry on server errors
                    time.sleep(2 ** attempt)
                    continue
                raise

            except requests.exceptions.RequestException as e:
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                    continue
                raise
```

## Authentication

### API Key Authentication

```python
from functools import wraps
from flask import request, jsonify

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('Authorization', '').replace('Bearer ', '')

        if not api_key or not validate_api_key(api_key):
            return jsonify({
                'status': 'error',
                'error': {
                    'code': 'UNAUTHORIZED',
                    'message': 'Invalid or missing API key'
                }
            }), 401

        return f(*args, **kwargs)

    return decorated_function

@app.route('/api/v1/jobs', methods=['POST'])
@require_api_key
def create_job():
    # ... implementation
```

## Rate Limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/api/v1/jobs', methods=['POST'])
@limiter.limit("10 per minute")
def create_job():
    # ... implementation
```

## Async Operations

For long-running operations:

```python
@app.route('/api/v1/jobs', methods=['POST'])
def create_job():
    """Submit async job"""

    job_id = queue_job(request.json)

    return jsonify({
        'status': 'success',
        'data': {
            'job_id': job_id,
            'status': 'queued',
            'status_url': f'/api/v1/jobs/{job_id}'
        }
    }), 202  # 202 Accepted
```

Client polling:

```python
job = client.submit_job(config)
print(f"Job submitted: {job['job_id']}")

# Poll for completion
result = client.wait_for_job(job['job_id'])
print(f"Job completed: {result['status']}")
```

## Related Documentation

- [API Collector](/apps/api-collector)
- [Integration Patterns Overview](/integrations/)
