# Report Generator

Generates reports in various formats including PDF, Excel, HTML, and PowerPoint from processed data using customizable templates.

## Overview

The Report Generator creates professional reports and dashboards from enriched data, supporting multiple output formats and custom branding.

### Key Features

- 📄 Multiple format support (PDF, Excel, HTML, PPTX)
- 🎨 Template-based generation
- 📊 Charts and visualizations
- 🎯 Custom branding and styling
- 📧 Email-ready outputs
- ⚡ Batch report generation

## Configuration

```json
{
  "input_path": "./data/enriched",
  "output_path": "./reports",
  "templates": [
    {
      "name": "monthly_sales",
      "template_file": "templates/sales_report.html",
      "output_format": "pdf",
      "data_source": "sales_data.csv",
      "schedule": "monthly"
    }
  ],
  "branding": {
    "logo": "assets/company_logo.png",
    "colors": {
      "primary": "#646cff",
      "secondary": "#535bf2"
    }
  }
}
```

## Template System

Create HTML templates with template variables:

```html
<!DOCTYPE html>
<html>
<head>
  <title>{{report_title}}</title>
</head>
<body>
  <h1>{{report_title}}</h1>
  <p>Period: {{start_date}} to {{end_date}}</p>

  <table>
    {{#each sales_data}}
    <tr>
      <td>{{this.product}}</td>
      <td>{{this.revenue}}</td>
    </tr>
    {{/each}}
  </table>

  <chart type="bar" data="{{chart_data}}"></chart>
</body>
</html>
```

## Usage Examples

```bash
# Generate all configured reports
./report-generator --config config.json

# Generate specific report
./report-generator --template monthly_sales

# Generate with custom data
./report-generator --template monthly_sales --data custom_data.csv

# Preview without saving
./report-generator --template monthly_sales --preview
```

## Output Formats

### PDF Reports
- High-quality print-ready PDFs
- Supports charts, tables, and images
- Custom page sizes and margins

### Excel Reports
- Multiple worksheets
- Formatted tables
- Embedded charts

### HTML Dashboards
- Interactive visualizations
- Responsive design
- Embeddable in portals

## Integration Points

- **Receives from**: Enricher
- **Sends to**: Notification Service, File Exporter
- **Output**: Reports in configured formats

## Related Documentation

- [Notification Service](/apps/notification-service)
- [File Exporter](/apps/file-exporter)
