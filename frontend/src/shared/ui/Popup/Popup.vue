<template>
  <div v-if="show" class="popup-overlay" @click.self="close">
    <div class="popup-window">
      <slot />
    </div>
    <div class="popup-list">
      <slot name="list" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

function close() {
  emit("update:show", false);
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-list {
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

.popup-window {
  background: #1e1e1e;
  padding: 24px;
  margin: 16px;
  border-radius: 12px;
  min-width: 300px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}
</style>
