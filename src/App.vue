<template>
  <the-header />
  <SpellList />
  <HelpBox />
  <the-footer />
</template>

<script lang="ts" allowJs="true">
import { defineComponent } from "vue";
import uniqueId from "lodash.uniqueid";
import TheHeader from "./components/TheHeader.vue"
import TheFooter from "./components/TheFooter.vue"
import SpellList from "./components/SpellList.vue"
import HelpBox from "./components/HelpBox.vue";

export default defineComponent({
  components: {
    TheHeader,
    TheFooter,
    HelpBox,
    SpellList,
  }
});
</script>
<style lang="scss">
.icon {
  &::after {
    display: inline;
  }

  &-barbarian::after {
    content: '🪓';
  }

  &-fighter::after {
    content: '⚔️';
  }

  &-ranger::after {
    content: '🏹';
  }

  &-rogue::after {
    content: '🗡️';
  }

  &-paladin::after {
    content: '🛡️';
  }

  &-bard::after {
    content: '🪕';
  }

  &-cleric::after {
    content: '🙏';
  }

  &-druid::after {
    content: '🌿';
  }

  &-sorcerer::after {
    content: '🔮';
  }

  &-warlock::after {
    content: '👹';
  }

  &-wizard::after {
    content: '🧙‍♂️';
  }
}
</style>
