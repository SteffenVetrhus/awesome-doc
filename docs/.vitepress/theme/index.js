import DefaultTheme from 'vitepress/theme'
import './custom.css'
import AppGraph from './components/AppGraph.vue'
import AppCard from './components/AppCard.vue'
import IntegrationFlow from './components/IntegrationFlow.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AppGraph', AppGraph)
    app.component('AppCard', AppCard)
    app.component('IntegrationFlow', IntegrationFlow)
  }
}
