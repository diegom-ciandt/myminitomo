<template>
  <div class="spell-list-container">
    <h2 class="spell-list-title">Spell List</h2>
    <button @click="clearLocalStorage" class="spell-list-refresh">Recast loading Spells</button>
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
        loading.value = true;
        try {
          const spellIndexesResponse = await fetch(BASE_URL + "/api/spells");
          const spellIndexes = await spellIndexesResponse.json();

          const spellsPromises = spellIndexes.results.map(async index => {
            const spellResponse = await fetch(BASE_URL + index.url);
            return spellResponse.json();
          });

          let fetchedSpells = await Promise.all(spellsPromises);
          fetchedSpells = fetchedSpells.sort((a, b) => {
            return parseInt(a.level) - parseInt(b.level);
          });
          
          spells.value = fetchedSpells;
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
  },
  methods: {
    clearLocalStorage() {
      localStorage.removeItem('spells');
      location.reload();
    }
  }
};
</script>


<style lang="scss">
.spell-list {
  &-container {
    max-width: 500px;
  }

  &-refresh {
    background-color: purple;
    border: 1px solid purple;
    color: white;
    padding: 10px;
    margin-top: 10px;
    opacity: 0.2;
    transition: opacity 0.8s;

    &:hover {
      opacity: 1;
    }
  }
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
    width: 90px;
    text-align: right;
  }
}

</style>