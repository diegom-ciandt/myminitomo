<template>
  <header>
    <h1>My Minitomo</h1>
  </header>
</template>
<script lang="ts" allowJs>
export default {
  name: 'TheHeader',  
}
</script>
<style lang="scss">
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1a0033 0%, #3b0764 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  z-index: 2147483647;

  h1 {
    margin: 0;
    font-size: 2.4rem;
    color: #e8d5ff;
    letter-spacing: 0.05em;
  }
}
</style>