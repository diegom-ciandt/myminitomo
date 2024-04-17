<template>
  <div class="spell-list-container">
    <h2 class="spell-list-title">Spell List</h2>
    <ul v-if="!loading && spells && spells.length">
      <li v-for="spell of spells" :id="spell.index" class="spell-item">
        <p><strong>{{spell.name}}</strong></p>
        <p>Level: {{spell.level}}</p>
      </li>
    </ul>
    <p v-if="loading">
      Loading
    </p>
    <p v-if="error">
      Oh no! We couldn't load the Spells! I bet it's the Necromancer fault!
    </p>
  </div>
</template>
<script lang="ts" allowJs>
import { ref, onMounted } from "vue";
export default {
  name: 'SpellList',
  setup() {
    const spells = ref(null);
    const loading = ref(true);
    const error = ref(null);

    function fetchSpells() {
      loading.value = true;
      // @todo Main domain need to be in a global config.
      return fetch('https://www.dnd5eapi.co/api/spells', {
        method: 'get',
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) {
          // @todo Need a better error handling.
          const error = new Error(res.statusText);
          throw error;
        }

        return res.json();
      })
      .then(json => {
        // set the response data
        spells.value = json.results;
      })
      .catch(err => {
        error.value = err;
      })
      .then(() => {
        loading.value = false;
      });
    }

    onMounted(() => {
      fetchSpells();
    });

    return {
      spells,
      loading,
      error
    };
  }
}
</script>
<style lang="scss">
.spell-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>