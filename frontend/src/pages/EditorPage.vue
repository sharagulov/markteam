<template>
  <div class="editor-wrapper">
    <div class="top-bar">
      <Button @click="goHome">Home</Button>
      <ul class="user-list">
        <span v-for="user in store.users" :key="user">{{ user }}</span>
      </ul>
    </div>

    <div class="mindmap-wrapper">
      <div class="editor-container">
        <BasicEditor v-model="localMd" />
      </div>

      <div class="mindmap-container">
        <svg ref="svg" class="mindmap-view"></svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDocStore } from "@/store/doc.store";
import { Transformer } from "markmap-lib";
import * as markmap from "markmap-view";
import BasicEditor from "@/shared/ui/BasicEditor/BasicEditor.vue";
import { watch } from "vue";
import Button from "@/shared/ui/Button/Button.vue";

const { Markmap, loadCSS, loadJS } = markmap;
const router = useRouter();

const svg = ref<SVGSVGElement>();
const mm = ref<ReturnType<typeof Markmap.create> | null>(null);

const store = useDocStore();
const route = useRoute();
const transformer = new Transformer();
const localMd = ref("# Loading…");
const view = ref<HTMLElement>();
let isRemoteUpdate = false;

onMounted(async () => {
  const id = route.params.id as string;
  store.setId(id);

  const username = sessionStorage.getItem("username") || "Anonymous";
  const storedPassword = sessionStorage.getItem(`pass:${id}`);
  if (!storedPassword) return alert("No password stored. Go back to login.");

  const res = await fetch(`/api/docs/${id}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: storedPassword }),
  });

  if (res.status === 403) return alert("Forbidden");
  const { md } = await res.json();
  store.setMd(md);
  localMd.value = md;
  render(localMd.value);

  const wsUrl =
    window.location.protocol === "https:"
      ? "wss://markteam.site/ws/"
      : "ws://localhost:3000";

  store.connect(wsUrl);

  store.ws?.addEventListener("open", () => {
    store.ws!.send(JSON.stringify({ type: "join", id, name: username }));

    setInterval(() => {
      store.ws!.send(JSON.stringify({ type: "ping", id }));
    }, 5000);
  });

  store.ws?.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === "patch" && msg.id === id) {
      isRemoteUpdate = true;
      localMd.value = msg.md;
      render(msg.md);
    }
  });
});

onBeforeUnmount(() => {
  store.disconnect();
});

watch(localMd, (val) => {
  if (isRemoteUpdate) {
    isRemoteUpdate = false;
    return;
  }

  store.setMd(val);
  render(val);

  if (store.ws?.readyState === WebSocket.OPEN) {
    store.sendPatch(val);
  } else {
    store.ws?.addEventListener("open", () => store.sendPatch(val), {
      once: true,
    });
  }
});

function render(text: string) {
  if (!svg.value) return;

  const { root, features } = transformer.transform(text);

  // 2. Ассеты для подключённых плагинов
  const { styles, scripts } = transformer.getUsedAssets(features);
  if (styles?.length) loadCSS(styles);
  if (scripts?.length) {
    loadJS(scripts, { getMarkmap: () => markmap });
  }

  // 3. Создаём или обновляем граф
  if (!mm.value) {
    mm.value = Markmap.create(svg.value, undefined, root);
  } else {
    mm.value.setData(root);
    mm.value.fit();
  }
}

function goHome() {
  router.push("/"); // переход на домашнюю
}
</script>

<style scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  height: 100dvh;
  padding: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
}

.mindmap-wrapper {
  display: flex;
  height: 100%;
  flex: 1;
  gap: 16px;
  box-sizing: border-box;
}

.editor-container,
.mindmap-container {
  flex: 1;
  background-color: #222;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.editor-container {
  overflow: auto;
}

.mindmap-view {
  flex: 1;
  width: 100%;
  overflow: auto;
  color: white;
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 8px;
  color: #aaa;
  font-size: 14px;
}
</style>
