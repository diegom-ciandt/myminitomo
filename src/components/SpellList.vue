<template>
  <div class="spell-list-container">
    <h2 class="spell-list-title">Spell List</h2>
    <button @click="clearLocalStorage" class="btn btn-primary spell-list-refresh">Recast loading Spells</button>
    <div class="spell-list-filters">
      <input id="spell-search-name" type="text" class="form-control" placeholder="Filter by name" @keyup="filterSpells()" />
      <div class="float-shows-next">
        <b v-if="isFilteredByLevel()">Filter by level</b>
        <span v-else>Filter by level</span>
        <div id="spell-filter-level" class="form-control show-on-float">
          <label for="spell-filter-level-0">
            <input type="checkbox" value="0" id="spell-filter-level-0" @change="filterSpells()" />
            Cantrip
          </label>
          <label for="spell-filter-level-1">
            <input type="checkbox" value="1" id="spell-filter-level-1" @change="filterSpells()" />
            1º Circle
          </label>
          <label for="spell-filter-level-2">
            <input type="checkbox" value="2" id="spell-filter-level-2" @change="filterSpells()" />
            2º Circle
          </label>
          <label for="spell-filter-level-3">
            <input type="checkbox" value="3" id="spell-filter-level-3" @change="filterSpells()" />
            3º Circle
          </label>
          <label for="spell-filter-level-4">
            <input type="checkbox" value="4" id="spell-filter-level-4" @change="filterSpells()" />
            4º Circle
          </label>
          <label for="spell-filter-level-5">
            <input type="checkbox" value="5" id="spell-filter-level-5" @change="filterSpells()" />
            5º Circle
          </label>
          <label for="spell-filter-level-6">
            <input type="checkbox" value="6" id="spell-filter-level-6" @change="filterSpells()" />
            6º Circle
          </label>
          <label for="spell-filter-level-7">
            <input type="checkbox" value="7" id="spell-filter-level-7" @change="filterSpells()" />
            7º Circle
          </label>
          <label for="spell-filter-level-8">
            <input type="checkbox" value="8" id="spell-filter-level-8" @change="filterSpells()" />
            8º Circle
          </label>
          <label for="spell-filter-level-9">
            <input type="checkbox" value="9" id="spell-filter-level-9" @change="filterSpells()" />
            9º Circle
          </label>
        </div>
      </div>
      <div class="float-shows-next">
        <b v-if="isFilteredByClass()">Filter by class</b>
        <span v-else>Filter by class</span>
        <div id="spell-filter-class" class="form-control show-on-float">
          <label for="spell-filter-class-bard">
            <input type="checkbox" value="bard" id="spell-filter-class-bard" @change="filterSpells()" />
            <span class="icon icon-bard"></span>Bard
          </label>
          <label for="spell-filter-class-cleric">
            <input type="checkbox" value="cleric" id="spell-filter-class-cleric" @change="filterSpells()" />
            <span class="icon icon-cleric"></span>Cleric
          </label>
          <label for="spell-filter-class-druid">
            <input type="checkbox" value="druid" id="spell-filter-class-druid" @change="filterSpells()" />
            <span class="icon icon-druid"></span>Druid
          </label>
          <label for="spell-filter-class-paladin">
            <input type="checkbox" value="paladin" id="spell-filter-class-paladin" @change="filterSpells()" />
            <span class="icon icon-paladin"></span>Paladin
          </label>
          <label for="spell-filter-class-ranger">
            <input type="checkbox" value="ranger" id="spell-filter-class-ranger" @change="filterSpells()" />
            <span class="icon icon-ranger"></span>Ranger
          </label>
          <label for="spell-filter-class-sorcerer">
            <input type="checkbox" value="sorcerer" id="spell-filter-class-sorcerer" @change="filterSpells()" />
            <span class="icon icon-sorcerer"></span>Sorcerer
          </label>
          <label for="spell-filter-class-warlock">
            <input type="checkbox" value="warlock" id="spell-filter-class-warlock" @change="filterSpells()" />
            <span class="icon icon-warlock"></span>Warlock
          </label>
          <label for="spell-filter-class-wizard">
            <input type="checkbox" value="wizard" id="spell-filter-class-wizard" @change="filterSpells()" />
            <span class="icon icon-wizard"></span>Wizard
          </label>
        </div>
      </div>  
    </div>
    <ul v-if="!loading && spells && spells.length">
      <li v-for="spell of spells" :id="spell.index" class="spell-item" @click="selectCard(spell)">
        <p class="spell-item-name"><strong>{{spell.name}}</strong></p>
        <p v-if="spell.level==0" class="spell-item-level">Cantrip</p>
        <p v-else class="spell-item-level">{{spell.level }}º Circle</p>
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
import { ref, onMounted, defineComponent, computed } from "vue";

const BASE_URL = 'https://www.dnd5eapi.co';
export default defineComponent({
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
      error,
    };
  },
  methods: {
    clearLocalStorage() {
      localStorage.removeItem('spells');
      location.reload();
    },
    selectCard(spell: never) {
      this.$emit('deigo', spell);
    },
    filterSpells() {
      const levelFilters = Array.from(document.querySelectorAll('#spell-filter-level input:checked')).map((el: any) => el.value);
      const classFilters = Array.from(document.querySelectorAll('#spell-filter-class input:checked')).map((el: any) => el.value);
      const spellName = (document.querySelector('#spell-search-name') as HTMLInputElement).value.toLowerCase();

      const spells = JSON.parse(localStorage.getItem('spells') || '[]');
      const filteredSpells = spells.filter((spell: any) => {
        const levelCheck = levelFilters.length <= 0 || levelFilters.includes(spell.level.toString());
        const classCheck = classFilters.length <= 0 || classFilters.some((dndClass: string) => spell.classes.some((spellClass: any) => spellClass.name.toLowerCase() === dndClass));
        const nameCheck = spellName === '' || spell.name.toLowerCase().includes(spellName);
        return levelCheck && classCheck && nameCheck;
      });

      this.spells = filteredSpells;
    },
    isFilteredByLevel() {
      return Array.from(document.querySelectorAll('#spell-filter-level input:checked')).map((el: any) => el.value).length > 0;
    },
    isFilteredByClass() {
      return Array.from(document.querySelectorAll('#spell-filter-class input:checked')).map((el: any) => el.value).length > 0;
    },
  }
});
</script>
<style lang="scss">
.spell-list {
  &-container {
    max-width: 500px;
  }

  &-filters {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 10px 0;
  }
}

.spell-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;

  &:nth-child(even) {
    background-color: lightgray;
  }

  &:hover {
    background-color: lightblue;
  }

  &-name {
    width: 100px;
    word-break: break-all;
  }

  &-classes {
    width: 90px;
    text-align: right;
  }
}

#spell-search-name {
  width: 200px;
}

.show-on-float {
  display: none;

  position: absolute;
  background-color: lightgray;
  flex-direction: column;
  min-width: 120px;
  justify-content: space-between;
  align-items: center;

  > * {
    padding: 5px;
    font-size: 14px;
  }
}

.float-shows-next {
  &:hover > .show-on-float {
    display: flex;
  }
}

</style>