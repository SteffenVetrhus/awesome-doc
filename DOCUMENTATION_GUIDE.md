# Console Applications Documentation Guide

Welcome to the console applications documentation system! This guide will help you understand how to use and contribute to the documentation.

## 🚀 Quick Start

### Running the Documentation Locally

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

The documentation will be available at `http://localhost:5173`

## 📁 Project Structure

```
awesome-doc/
├── docs/                          # Documentation source
│   ├── .vitepress/               # VitePress configuration
│   │   ├── config.mjs           # Main configuration
│   │   └── theme/               # Custom theme
│   │       ├── index.js         # Theme entry
│   │       ├── custom.css       # Custom styles
│   │       └── components/      # Vue components
│   │           ├── AppGraph.vue          # Interactive app graph
│   │           ├── AppCard.vue           # App info cards
│   │           └── IntegrationFlow.vue   # Flow diagrams
│   ├── apps/                    # Application documentation
│   ├── integrations/            # Integration patterns
│   ├── architecture.md          # Architecture overview
│   └── index.md                 # Homepage
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 📝 Adding New Application Documentation

### 1. Create New Application Page

Create a new file in `docs/apps/` folder:

```bash
touch docs/apps/your-app-name.md
```

### 2. Use the Documentation Template

```markdown
# Your App Name

Brief description of what the application does.

<script setup>
import IntegrationFlow from '../.vitepress/theme/components/IntegrationFlow.vue'
</script>

## Overview

Detailed description...

## Configuration

\`\`\`json
{
  "config": "example"
}
\`\`\`

## Usage Examples

\`\`\`bash
./your-app --config config.json
\`\`\`

## Data Flow

<IntegrationFlow
  :steps="[
    { name: 'Source', icon: '📥', description: 'Input', outputLabel: 'Data' },
    { name: 'Your App', icon: '⚙️', description: 'Process', outputLabel: 'Result' },
    { name: 'Target', icon: '📤', description: 'Output' }
  ]"
/>

## Related Documentation

- [Other App](/apps/other-app)
```

### 3. Update Sidebar Navigation

Edit `docs/.vitepress/config.mjs` and add your app to the sidebar:

```javascript
sidebar: {
  '/apps/': [
    {
      text: 'Your Category',
      items: [
        { text: 'Your App', link: '/apps/your-app-name' }
      ]
    }
  ]
}
```

### 4. Update Graph (Optional)

If your app connects to others, update the default data in `AppGraph.vue`.

## 🎨 Using Components

### AppCard Component

Display application information in a card format:

```vue
<AppCard
  name="App Name"
  type="input|processing|output"
  description="App description"
  :inputs="['Input 1', 'Input 2']"
  :outputs="['Output 1']"
  :connections="['Connected App']"
  link="/apps/app-name"
/>
```

### IntegrationFlow Component

Show data flow between applications:

```vue
<IntegrationFlow
  :steps="[
    {
      name: 'App Name',
      icon: '📦',
      description: 'Brief description',
      outputLabel: 'Data Type'
    },
    // ... more steps
  ]"
/>
```

### AppGraph Component

Display interactive graph of all applications:

```vue
<AppGraph />

<!-- Or with custom data -->
<AppGraph
  :apps="[
    { id: 'app1', label: 'App 1', type: 'input' },
    { id: 'app2', label: 'App 2', type: 'processing' }
  ]"
  :connections="[
    { from: 'app1', to: 'app2', label: 'Data' }
  ]"
/>
```

## 🎯 Best Practices

### Documentation Standards

1. **Clear Titles**: Use descriptive titles for pages and sections
2. **Code Examples**: Always provide working examples
3. **Visual Aids**: Use IntegrationFlow for data flows
4. **Cross-Reference**: Link to related documentation
5. **Keep Updated**: Update docs when applications change

### Writing Style

- Use present tense ("Application processes data", not "will process")
- Be concise but comprehensive
- Use bullet points for lists
- Include emojis sparingly for visual markers
- Provide both high-level overview and detailed examples

### Configuration Examples

Always provide example configurations:

```json
{
  "input_path": "./data/input",
  "output_path": "./data/output",
  "setting": "value"
}
```

### Command Examples

Show complete, runnable commands:

```bash
# Good: Complete command with context
./app-name --config config.json --input ./data

# Bad: Incomplete or unclear
./app-name ...
```

## 🔧 Customization

### Adding New Themes

Edit `docs/.vitepress/theme/custom.css` to customize colors:

```css
:root {
  --vp-c-brand: #646cff;
  --vp-c-brand-light: #747bff;
}
```

### Creating New Components

1. Create component in `docs/.vitepress/theme/components/`
2. Register in `docs/.vitepress/theme/index.js`:

```javascript
import YourComponent from './components/YourComponent.vue'

export default {
  enhanceApp({ app }) {
    app.component('YourComponent', YourComponent)
  }
}
```

### Modifying the Graph

Edit default data in `AppGraph.vue`:

```javascript
const defaultApps = [
  { id: 'new-app', label: 'New App', type: 'input' }
]

const defaultConnections = [
  { from: 'new-app', to: 'other-app', label: 'Data Type' }
]
```

## 🐛 Troubleshooting

### Documentation Not Building

```bash
# Clear cache and rebuild
rm -rf docs/.vitepress/cache docs/.vitepress/dist
npm run docs:build
```

### Components Not Rendering

1. Check component is imported in `theme/index.js`
2. Verify `<script setup>` block in markdown
3. Check console for JavaScript errors

### Styles Not Applying

1. Check `custom.css` is imported in `theme/index.js`
2. Clear browser cache
3. Restart dev server

## 📚 Resources

- [VitePress Documentation](https://vitepress.dev)
- [Vue.js Guide](https://vuejs.org/guide/)
- [Cytoscape.js (Graph Library)](https://js.cytoscape.org)
- [Markdown Guide](https://www.markdownguide.org)

## 🤝 Contributing

### Documentation Updates

1. Edit markdown files in `docs/` folder
2. Test locally with `npm run docs:dev`
3. Commit changes with clear message
4. Create pull request

### Adding Features

1. Discuss proposal first
2. Create new branch
3. Implement feature
4. Update documentation
5. Submit pull request

## 📞 Support

For questions or issues:
- Check existing documentation
- Review example applications
- Contact the documentation team

---

Built with ❤️ using [VitePress](https://vitepress.dev)
