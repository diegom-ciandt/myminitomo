<template>
  <footer>
    <p>Content under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC-BY-4.0</a> · Wizards of the Coast</p>
    <p>{{ $t('footer.translation') }} <a href="https://github.com/5e-bits/5e-database" target="_blank" rel="noopener">{{ $t('footer.translationLink') }}</a>.</p>
  </footer>
</template>
<script lang="ts" allowJs>
export default {
  name: 'TheFooter',  
}
</script>
<style lang="scss">
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 16px;
  font-size: 1.3rem;
  background: linear-gradient(135deg, #1a0033 0%, #3b0764 100%);
  color: #e8d5ff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.4);
  z-index: 2147483647;

  p {
    margin: 0;
  }

  a {
    color: #c084fc;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>