<template>
  <button><slot /></button>
</template>

<style scoped>
button {
  width: 100%;
  aspect-ratio: 2 / 1;
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
  background-color: #333;
}
</style>
