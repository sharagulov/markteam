<template>
  <div ref="editor" class="editor" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue"]);

const editor = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;

function createEditor(value: string) {
  view = new EditorView({
    state: EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        history(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            emit("update:modelValue", update.state.doc.toString());
          }
        }),
      ],
    }),
    parent: editor.value!,
  });
}

onMounted(() => {
  if (editor.value) createEditor(props.modelValue);
});


watch(
  () => props.modelValue,
  (val) => {
    if (!view) return;
    const current = view.state.doc.toString();
    if (val !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: val },
      });
    }
  }
);
</script>

<style scoped>
.editor {
  width: 100%;
  height: 100%;
  font-family: monospace;
  background-color: transparent;
  color: #eee;
}
</style>
