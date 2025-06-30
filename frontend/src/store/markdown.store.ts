import { defineStore } from 'pinia';

export const useMarkdownStore = defineStore('md', {
  state: () => ({ markdown: '# Hello mindmap' }),
  actions: {
    setMarkdown(md: string) {
      this.markdown = md;
    }
  }
});
