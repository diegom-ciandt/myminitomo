<template>
  <header>
    <h1>My Minitomo</h1>
    <select v-model="$i18n.locale" class="lang-selector">
      <option value="en">English</option>
      <option value="pt-BR">Português (BR)</option>
      <option value="fr-FR">Français</option>
    </select>
  </header>
</template>
<script lang="ts" allowJs>
export default {
  name: 'TheHeader',
  watch: {
    '$i18n.locale'(val: string) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', val);
      history.replaceState(null, '', url.toString());
    }
  }
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
  gap: 16px;
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

  .lang-selector {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(232, 213, 255, 0.4);
    border-radius: 6px;
    color: #e8d5ff;
    padding: 4px 8px;
    font-size: 0.9rem;
    cursor: pointer;

    option {
      background: #1a0033;
      color: #e8d5ff;
    }
  }
}
</style>
