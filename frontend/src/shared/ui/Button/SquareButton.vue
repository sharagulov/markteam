<template>
  <button>
    <slot />
    <svg
      v-if="iconPath"
      class="icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path :d="iconPath" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  iconPath?: string;
}>();
</script>

<style scoped>
button {
  width: 100%;
  aspect-ratio: 2 / 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  border: none;
  cursor: pointer;
  background-color: #222;
  border-radius: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #252525;
}

.icon {
  position: absolute;
  right: 20px;
  bottom: -25px;
  width: 85px;
  height: 85px;
  fill: white;
  opacity: 0.1;
  transition: transform 0.3s;
}

button:hover {
  .icon {
    transform: translateY(-3px);
  }
}


@media (max-width: 500px) {
  button {
    aspect-ratio: 3 / 1;
  }
}

@media (max-width: 380px) {
  button {
    aspect-ratio: 2 / 1;
  }
}
</style>
