<template>
  <div :id="id" class="card">
    {{ card.name }}
    <pre>{{ card }}</pre>
  </div>
</template>
<script lang="ts" allowJs>


export default {
  name: 'Card',
  props: {
    id: { required: true, type: String },
    card: { required: true, type: Object },
  },
}
</script>
<style lang="scss">
.card {
  border: 1px solid black;
  padding: 1rem;
  margin: 1rem;
  width: 200px;

  pre {
    display: none;
  }
}
</style>