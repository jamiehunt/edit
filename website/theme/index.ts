import type { Theme } from 'vitepress'
import Components from '@fmhy/components'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Post from './PostLayout.vue'

import './style.scss'
import 'virtual:uno.css'

import Feedback from './components/Feedback.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(Components)
    app.component('Post', Post)
    app.component('Feedback', Feedback)
  }
} satisfies Theme
