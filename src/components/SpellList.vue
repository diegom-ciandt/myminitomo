<template>
  <div class="spell-list-container">
    <h2 class="spell-list-title">Spell List</h2>
    <ul v-if="!loading && spells && spells.length">
      <li v-for="spell of spells" :id="spell.index" class="spell-item">
        <p class="spell-item-name"><strong>{{spell.name}}</strong></p>
        <p class="spell-item-level">Level: {{spell.level}}</p>
        <p class="spell-item-classes"><span v-for="dndClass of spell.classes" :class="'no-text icon icon-' + dndClass.name.toLowerCase()"></span></p>
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
    const spells = ref(JSON.parse(localStorage.getItem('spells') || 'null'));
    const loading = ref(!spells.value);
    const error = ref(null);

    const getAllSpells = async () => {
      if (!spells.value) {
        try {
          const spellIndexesResponse = await fetch(BASE_URL + "/api/spells");
          const spellIndexes = await spellIndexesResponse.json();
          
          const spellsPromises = spellIndexes.results.map(async index => {
            const spellResponse = await fetch(BASE_URL + index.url);
            return spellResponse.json();
          });

          spells.value = await Promise.all(spellsPromises);
          localStorage.setItem('spells', JSON.stringify(spells.value));
        } catch (e:any) {
          error.value = e;
        } finally {
          loading.value = false;
        }
      }
    };

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
.spell-list-container {
  max-width: 500px;
}

.spell-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  &:nth-child(even) {
    background-color: lightgray;
  }

  &:hover {
    background-color: lightblue;
  }

  &-name {
    width: 100px;
  }

  &-classes {
    min-width: 100px;
    text-align: right;
  }
}

</style>