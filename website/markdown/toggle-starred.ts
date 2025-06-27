import type { MarkdownRenderer } from 'vitepress'

const excluded = ['Beginners Guide']

export function toggleStarredPlugin(md: MarkdownRenderer) {
  md.renderer.rules.list_item_open = (tokens, index, options, env, self) => {
    const contentToken = tokens[index + 2]

    // Ensure the token exists
    if (contentToken) {
      const content = contentToken.content

      if (
        !excluded.includes(env.frontmatter.title) &&
        (content.includes(':star:') || content.includes(':glowing-star:'))
      ) {
        return `<li class="starred">`
      }
    }

    return self.renderToken(tokens, index, options)
  }
}
