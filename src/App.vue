<template>
  <the-header />
  <SpellList />
  <the-footer />
</template>

<script lang="ts" allowJs="true">
import { defineComponent } from "vue";
import uniqueId from "lodash.uniqueid";
import TheHeader from "./components/TheHeader.vue"
import TheFooter from "./components/TheFooter.vue"
import SpellList from "./components/SpellList.vue"

export default defineComponent({
  components: {
    TheHeader,
    TheFooter,
    SpellList,
  }
});
</script>
<style lang="scss">

</style>
