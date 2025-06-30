<template>
  <div class="mindmap-wrapper">
    <textarea v-model="md" @input="onInput" />
    <div ref="view" class="mindmap-view" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMarkdownStore } from "@/store/markdown.store";
import { useWS } from "@/api/ws";

import { Markmap } from "markmap-view";
import { Transformer } from "markmap-lib"; // ← правильный импорт

const transformer = new Transformer(); // один экземпляр на компонент

const { markdown, setMarkdown } = useMarkdownStore();
const md = ref(markdown);
const view = ref<HTMLElement>();
const ws = useWS();

function onInput() {
  setMarkdown(md.value);
  ws.emit({ type: "update_md", md: md.value });
}

function render(text: string) {
  if (!view.value) return;

  // преобразуем Markdown → дерево IPureNode
  const { root } = transformer.transform(text);

  // инициализируем / обновляем карту
  const mm = Markmap.create(view.value, undefined, root);
  mm.fit();
}

onMounted(() => {
  render(md.value); // первый рендер

  ws.on("patch", (e: any) => {
    // обновления по WebSocket
    setMarkdown(e.md);
    md.value = e.md;
    render(e.md);
  });
});
</script>

<style scoped src="./MindmapWrapper.scss" />
