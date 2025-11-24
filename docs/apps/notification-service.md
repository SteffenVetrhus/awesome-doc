# Notification Service

Sends notifications via email, Slack, Microsoft Teams, and other channels for alerts, reports, and status updates.

## Overview

The Notification Service provides multi-channel notification capabilities for the console application ecosystem, ensuring stakeholders are informed of important events.

### Key Features

- 📧 Email notifications (SMTP, SendGrid, SES)
- 💬 Slack integration
- 👥 Microsoft Teams webhooks
- 📱 SMS notifications (Twilio)
- 🔔 Custom webhooks
- 📝 Template-based messages

## Configuration

```json
{
  "channels": {
    "email": {
      "provider": "smtp",
      "host": "smtp.gmail.com",
      "port": 587,
      "from": "notifications@example.com",
      "username": "${SMTP_USERNAME}",
      "password": "${SMTP_PASSWORD}"
    },
    "slack": {
      "webhook_url": "${SLACK_WEBHOOK_URL}",
      "default_channel": "#data-ops"
    },
    "teams": {
      "webhook_url": "${TEAMS_WEBHOOK_URL}"
    }
  },
  "notifications": [
    {
      "name": "daily_report",
      "channels": ["email", "slack"],
      "template": "templates/daily_report.html",
      "recipients": ["team@example.com"],
      "trigger": "on_completion"
    }
  ]
}
```

## Notification Types

### 1. Alert Notifications
Immediate notifications for errors and failures

### 2. Report Notifications
Scheduled delivery of generated reports

### 3. Status Updates
Regular status updates on pipeline progress

### 4. Custom Notifications
User-defined notifications based on conditions

## Usage Examples

```bash
# Send configured notification
./notification-service --notification daily_report

# Send ad-hoc notification
./notification-service --channel email \
  --to "user@example.com" \
  --subject "Test" \
  --message "Hello World"

# Send with attachment
./notification-service --notification daily_report \
  --attach reports/monthly_sales.pdf

# Test notification without sending
./notification-service --notification daily_report --dry-run
```

## Email Templates

Create HTML email templates:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #646cff; color: white; padding: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
  </div>
  <div class="content">
    <p>{{message}}</p>
    {{#if has_attachments}}
    <p>Reports are attached.</p>
    {{/if}}
  </div>
</body>
</html>
```

## Slack Message Formatting

Send rich Slack messages:

```json
{
  "channel": "#data-ops",
  "username": "Data Pipeline Bot",
  "icon_emoji": ":robot_face:",
  "attachments": [
    {
      "color": "good",
      "title": "Daily Pipeline Complete",
      "text": "Successfully processed 10,000 records",
      "fields": [
        {
          "title": "Duration",
          "value": "45 minutes",
          "short": true
        },
        {
          "title": "Status",
          "value": "Success",
          "short": true
        }
      ]
    }
  ]
}
```

## Integration Points

- **Receives from**: Report Generator, All applications (for alerts)
- **Sends to**: Email servers, Slack, Teams, SMS gateways
- **Triggers**: Completion, errors, schedules, custom conditions

## Related Documentation

- [Report Generator](/apps/report-generator)
- [Architecture Overview](/architecture)
