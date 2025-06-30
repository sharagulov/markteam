<template>
  <button><slot /></button>
</template>
<style scoped>
button {
  width: fit-content;
  height: 40px;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  background-color: #1760b3;
  border-radius: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1760b3a4;
  }
}
</style>
