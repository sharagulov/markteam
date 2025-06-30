<template>
  <button class="tile" @click="onClick">
    <div class="main">
      <slot />
    </div>
    <div class="time">
      <slot name="time" />
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  onClick?: () => void;
}>();
</script>

<style scoped>
.tile {
  width: 100px;
  min-height: 40px;
  padding: 10px 14px;
  background-color: #222;
  border: none;
  border-radius: 8px;
  color: #999;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.tile:hover {
  background-color: #252525;
  .main {
    color: #fff;
  }
}

.main {
  font-weight: 500;
  color: #999;
  transition: color 0.3s;
}

.time {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>
