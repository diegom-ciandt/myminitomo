<template>
  <div class="spell-list-container">
    <h2 class="spell-list-title">{{ $t('spellList.title') }}</h2>
    <button @click="clearLocalStorage" class="btn btn-primary spell-list-refresh">{{ $t('spellList.recast') }}</button>
    <div class="spell-list-filters">
      <input id="spell-search-name" type="text" class="form-control" :placeholder="$t('spellList.filterByName')" @keyup="filterSpells()" />
      <div class="float-shows-next" @click.stop="toggleFilter('level')">
        <b v-if="isFilteredByLevel()">{{ $t('spellList.filterByLevel') }}</b>
        <span v-else>{{ $t('spellList.filterByLevel') }}</span>
        <div id="spell-filter-level" class="form-control show-on-float" v-if="openFilter === 'level'" @click.stop>
          <label for="spell-filter-level-0">
            <input type="checkbox" value="0" id="spell-filter-level-0" @change="filterSpells()" />
            {{ $t('spellList.cantrip') }}
          </label>
          <label v-for="n in 9" :for="'spell-filter-level-' + n" :key="n">
            <input type="checkbox" :value="n" :id="'spell-filter-level-' + n" @change="filterSpells()" />
            {{ $t('spellList.circle', { n }) }}
          </label>
        </div>
      </div>
      <div class="float-shows-next" @click.stop="toggleFilter('class')">
        <b v-if="isFilteredByClass()">{{ $t('spellList.filterByClass') }}</b>
        <span v-else>{{ $t('spellList.filterByClass') }}</span>
        <div id="spell-filter-class" class="form-control show-on-float" v-if="openFilter === 'class'" @click.stop>
          <label v-for="cls of classes" :for="'spell-filter-class-' + cls.index" :key="cls.index">
            <input type="checkbox" :value="cls.index" :id="'spell-filter-class-' + cls.index" @change="filterSpells()" />
            <span :class="'icon icon-' + cls.index"></span>{{ cls.name }}
          </label>
        </div>
      </div>
    </div>
    <ul v-if="!loading && spells && spells.length">
      <li v-for="spell of spells" :id="spell.index" class="spell-item" @click="selectCard(spell)">
        <p class="spell-item-name"><strong>{{spell.name}}</strong></p>
        <p class="spell-item-level">
          {{ spell.level == 0 ? $t('spellList.cantrip') : $t('spellList.circle', { n: spell.level }) }}
        </p>
        <p class="spell-item-classes"><span v-for="dndClass of spell.classes" :class="'no-text icon icon-' + dndClass.name.toLowerCase()"></span></p>
      </li>
    </ul>
    <p v-if="loading">{{ $t('spellList.loading') }}</p>
    <p v-if="error">{{ $t('spellList.error') }}</p>
  </div>
</template>
<script lang="ts" allowJs>
import { defineComponent } from "vue";

const BASE_URL = 'https://www.dnd5eapi.co';

export default defineComponent({
  name: 'SpellList',
  props: {
    classes: { type: Array as () => any[], default: () => [] },
  },
  data() {
    return {
      spells: null as any[] | null,
      loading: true,
      error: null as any,
      openFilter: null as string | null,
    };
  },
  created() {
    this.loadSpells(this.$i18n.locale);
  },
  mounted() {
    document.addEventListener('click', this.closeFilters);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeFilters);
  },
  watch: {
    '$i18n.locale'(newLocale: string) {
      this.spells = null;
      this.loadSpells(newLocale);
    }
  },
  methods: {
    async loadSpells(locale: string) {
      const cacheKey = `spells_${locale}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        this.spells = JSON.parse(cached);
        this.loading = false;
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const query = `{
          spells(limit: 500, lang: "${locale}") {
            index name level range casting_time duration
            concentration ritual components material
            school { index name }
            classes { index name }
            desc
          }
        }`;
        const response = await fetch(`${BASE_URL}/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const json = await response.json();
        if (json.errors) throw new Error(json.errors[0].message);
        const sorted = json.data.spells.slice().sort((a: any, b: any) => a.level - b.level);
        this.spells = sorted;
        localStorage.setItem(cacheKey, JSON.stringify(sorted));
      } catch (e: any) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    clearLocalStorage() {
      localStorage.removeItem(`spells_${this.$i18n.locale}`);
      location.reload();
    },
    selectCard(spell: any) {
      this.$emit('select-card', spell);
    },
    filterSpells() {
      const levelFilters = Array.from(document.querySelectorAll('#spell-filter-level input:checked')).map((el: any) => el.value);
      const classFilters = Array.from(document.querySelectorAll('#spell-filter-class input:checked')).map((el: any) => el.value);
      const spellName = (document.querySelector('#spell-search-name') as HTMLInputElement).value.toLowerCase();

      const spells = JSON.parse(localStorage.getItem(`spells_${this.$i18n.locale}`) || '[]');
      const filteredSpells = spells.filter((spell: any) => {
        const levelCheck = levelFilters.length <= 0 || levelFilters.includes(spell.level.toString());
        const classCheck = classFilters.length <= 0 || classFilters.some((dndClass: string) => spell.classes.some((spellClass: any) => spellClass.index === dndClass));
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
    toggleFilter(name: string) {
      this.openFilter = this.openFilter === name ? null : name;
    },
    closeFilters() {
      this.openFilter = null;
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

  &-refresh {
    display: none;
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

@media (max-width: 430px) {
  #spell-search-name {
    width: 100px;
  }

  .spell-list-filters {
    .float-shows-next:last-child {
      width: 90px;
      text-align: right;
    }
  }

  .float-shows-next {
    position: relative;

    > .show-on-float {
      right: 0;
      left: auto;
    }
  }
}

.show-on-float {
  display: flex;
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
  cursor: pointer;
}

</style>
