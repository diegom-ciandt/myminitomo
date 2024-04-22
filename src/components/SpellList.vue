<template>
  <div class="spell-list-container">
    <h2 class="spell-list-title">Spell List</h2>
    <ul v-if="!loading && spells && spells.length">
      <li v-for="spell of spells" :id="spell.index" class="spell-item">
        <p><strong>{{spell.name}}</strong></p>
        <p>Level: {{spell.level}}</p>
        <p>Classes: <span v-for="dndClass of spell.classes" class="icon icon-[dndClass.name]">{{dndClass.name}}</span></p>
      </li>
    </ul>
    <p v-if="loading">
      This action requires a lot of concentration... Loading Spells...
    </p>
    <p v-if="error">
      Oh no! We couldn't load the Spells! I bet it's the Necromancer fault!
    </p>
  </div>
</template>
<script lang="ts" allowJs>
import { ref, onMounted } from "vue";

const BASE_URL = 'https://www.dnd5eapi.co';
export default {
  name: 'SpellList',
  setup() {
    const spells = ref();
    const loading = ref(true);
    const error = ref(null);

    const getAllSpells = async () => {
      const spellIndexesResponse = await fetch(BASE_URL + "/api/spells");
      const spellIndexes = await spellIndexesResponse.json();
      
      const spellsPromises = spellIndexes.results.map(async index => {
        const spellResponse = await fetch(BASE_URL + index.url);
        return spellResponse.json();
      });

      spells.value = await Promise.all(spellsPromises);
      loading.value = false;
    };

    try {
      getAllSpells();
    } catch (e:any) {
      error.value = e;
      loading.value = false;
    }

    onMounted(getAllSpells);

    return {
      spells,
      loading,
      error
    };
  }
};

</script>
<style lang="scss">
.spell-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>