# File-based Integration

Detailed guide for implementing file-based integration patterns between console applications.

## Overview

File-based integration is the primary integration pattern in our ecosystem. Applications communicate by reading and writing files to shared storage locations.

## Implementation Guide

### 1. File Writer (Producer)

```python
import json
from pathlib import Path
from datetime import datetime
import hashlib

def write_output_file(data, output_dir, app_name, file_type):
    """Write data file with metadata"""

    # Create dated directory
    date_dir = Path(output_dir) / datetime.now().strftime('%Y-%m-%d')
    date_dir.mkdir(parents=True, exist_ok=True)

    # Generate filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{app_name}_{file_type}_{timestamp}.csv"
    filepath = date_dir / filename

    # Write data file
    with open(filepath, 'w') as f:
        # Write your data
        f.write(data)

    # Calculate checksum
    checksum = hashlib.sha256(filepath.read_bytes()).hexdigest()

    # Write metadata
    metadata = {
        "filename": filename,
        "created_at": datetime.now().isoformat(),
        "created_by": app_name,
        "file_size": filepath.stat().st_size,
        "checksum": f"sha256:{checksum}",
        "row_count": len(data.splitlines()),
        "next_app": "validator"
    }

    meta_filepath = filepath.with_suffix('.csv.meta.json')
    with open(meta_filepath, 'w') as f:
        json.dump(metadata, f, indent=2)

    return filepath
```

### 2. File Reader (Consumer)

```python
import json
from pathlib import Path
import hashlib

def read_input_files(input_dir, app_name):
    """Read files intended for this application"""

    for meta_file in Path(input_dir).rglob('*.meta.json'):
        # Read metadata
        with open(meta_file) as f:
            metadata = json.load(f)

        # Check if file is for this app
        if metadata.get('next_app') != app_name:
            continue

        # Get data file path
        data_file = meta_file.with_suffix('').with_suffix('')

        # Verify checksum
        actual_checksum = hashlib.sha256(data_file.read_bytes()).hexdigest()
        expected_checksum = metadata['checksum'].replace('sha256:', '')

        if actual_checksum != expected_checksum:
            raise ValueError(f"Checksum mismatch for {data_file}")

        # Read and yield data
        with open(data_file) as f:
            yield {
                'data': f.read(),
                'metadata': metadata,
                'filepath': data_file
            }
```

## File Locking

Prevent concurrent access issues:

```python
import fcntl
import time

def safe_write_file(filepath, content):
    """Write file with lock to prevent concurrent access"""

    lock_file = filepath.with_suffix(filepath.suffix + '.lock')

    # Acquire lock
    with open(lock_file, 'w') as lock:
        try:
            fcntl.flock(lock.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)

            # Write the file
            with open(filepath, 'w') as f:
                f.write(content)

        finally:
            fcntl.flock(lock.fileno(), fcntl.LOCK_UN)
            lock_file.unlink()
```

## Atomic File Operations

Use atomic operations to prevent partial reads:

```python
from pathlib import Path
import tempfile
import shutil

def atomic_write(filepath, content):
    """Write file atomically"""

    filepath = Path(filepath)

    # Write to temporary file in same directory
    with tempfile.NamedTemporaryFile(
        mode='w',
        dir=filepath.parent,
        delete=False,
        prefix='.tmp_',
        suffix=filepath.suffix
    ) as tmp_file:
        tmp_file.write(content)
        tmp_path = Path(tmp_file.name)

    # Atomic move
    shutil.move(str(tmp_path), str(filepath))
```

## File Watching

Monitor directories for new files:

```python
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class FileHandler(FileSystemEventHandler):
    def __init__(self, app_name, callback):
        self.app_name = app_name
        self.callback = callback

    def on_created(self, event):
        if event.is_directory:
            return

        if event.src_path.endswith('.meta.json'):
            # Wait a moment for file to be fully written
            time.sleep(0.5)

            # Check if file is for this app
            with open(event.src_path) as f:
                metadata = json.load(f)

            if metadata.get('next_app') == self.app_name:
                data_file = Path(event.src_path).with_suffix('').with_suffix('')
                self.callback(data_file, metadata)

# Usage
observer = Observer()
handler = FileHandler('validator', process_file)
observer.schedule(handler, '/data/imports', recursive=True)
observer.start()
```

## Error Handling

Move failed files to error directory:

```python
def process_with_error_handling(input_file, metadata):
    """Process file with error handling"""

    try:
        # Process file
        result = process_file(input_file)

        # Move to success directory
        success_dir = input_file.parent / 'processed'
        success_dir.mkdir(exist_ok=True)
        input_file.rename(success_dir / input_file.name)

        return result

    except Exception as e:
        # Move to error directory
        error_dir = input_file.parent / 'errors'
        error_dir.mkdir(exist_ok=True)

        # Write error details
        error_file = error_dir / f"{input_file.name}.error"
        with open(error_file, 'w') as f:
            json.dump({
                'filename': input_file.name,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }, f, indent=2)

        # Move file
        input_file.rename(error_dir / input_file.name)

        raise
```

## File Archiving

Archive processed files:

```python
import gzip
import shutil
from datetime import datetime, timedelta

def archive_old_files(data_dir, archive_dir, days_old=7):
    """Archive files older than specified days"""

    cutoff_date = datetime.now() - timedelta(days=days_old)

    for file_path in Path(data_dir).rglob('*'):
        if not file_path.is_file():
            continue

        # Check file age
        file_time = datetime.fromtimestamp(file_path.stat().st_mtime)
        if file_time < cutoff_date:
            # Create archive structure
            rel_path = file_path.relative_to(data_dir)
            archive_path = Path(archive_dir) / rel_path
            archive_path.parent.mkdir(parents=True, exist_ok=True)

            # Compress and move
            with open(file_path, 'rb') as f_in:
                with gzip.open(f"{archive_path}.gz", 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)

            # Remove original
            file_path.unlink()
```

## Best Practices Summary

1. **Always generate metadata files** alongside data files
2. **Use atomic writes** to prevent partial reads
3. **Implement checksums** for data integrity
4. **Use consistent naming conventions**
5. **Archive old files** to manage disk space
6. **Implement error handling** and move failed files
7. **Use file locking** for concurrent access
8. **Monitor file ages** to detect stuck files

## Related Documentation

- [File Importer](/apps/file-importer)
- [File Exporter](/apps/file-exporter)
- [Integration Patterns Overview](/integrations/)
