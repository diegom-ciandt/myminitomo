<template>
  <the-header />
  <div class="main" id="main">
    <HelpBox />
    <SpellList />
  </div>
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
.main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;

  & > div {
    width: 25vw;
    margin: 0 5vw;
  }
}

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
