<template>
  <the-header />
  <div class="main" id="main">
    <HelpBox />
    <SpellList @select-card="addNewSelectedCard"/>
    <div class="selected-list-container">
      <h2 class="selected-list-title not-printable">Selected Cards</h2>
      <button @click="clearSelectedCards" class="btn btn-primary selected-list-refresh not-printable">Remove all Cards</button>
      <button @click="printSelectedCards" class="btn btn-primary selected-list-print not-printable">Print all Cards</button>
      <ul v-if="selectedCards && selectedCards.length" class="selected-list" >
        <li v-for="card of selectedCards" class="selected-card">
          <Card
            :id="card.id"
            :card="card"
            @delete-selected-card="deleteSelectedCard(card)"
            @change-selected-card-image="changeSelectedCardImage(card)"/>
        </li>
      </ul>
    </div>
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
import Card from "./components/Card.vue";

export default defineComponent({
  components: {
    TheHeader,
    TheFooter,
    HelpBox,
    SpellList,
    Card,
  },
  data() {
    return {
      selectedCards: [] as any[],
    };
  },
  created() {
    this.loadSelectedCards();
    window.addEventListener('storage', this.loadSelectedCards);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.loadSelectedCards);
  },
  methods: {
    clearSelectedCards() {
      this.selectedCards = [];
      localStorage.setItem('selectedCards', JSON.stringify(this.selectedCards));
    },
    loadSelectedCards() {
      this.selectedCards = JSON.parse(localStorage.getItem('selectedCards') || '[]');
    },
    addNewSelectedCard(card: any) {
      if (this.selectedCards.find((c: any) => c.index === card.index)) {
        return;
      }
      card.id = uniqueId("selected-card-");
      this.selectedCards.push(card);
      localStorage.setItem('selectedCards', JSON.stringify(this.selectedCards));
      this.loadSelectedCards();
    },
    deleteSelectedCard(card: any) {
      this.selectedCards = this.selectedCards.filter((c: any) => c.id !== card.id);
      localStorage.setItem('selectedCards', JSON.stringify(this.selectedCards));
    },
    changeSelectedCardImage(card: any) {
      const index = this.selectedCards.findIndex((c: any) => c.id === card.id);
      this.selectedCards[index] = card;
      localStorage.setItem('selectedCards', JSON.stringify(this.selectedCards));
    },
    printSelectedCards() {
      window.print();
    }
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
    width: 30vw;
    margin: 0 3vw;
  }
}

.icon {
  &::after {
    display: inline;
  }

  //** Icons for classes */
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
    content: '⚔️';
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

  &-artificer::after {
    content: '🔧';
  }

  //** Icons for magic schools */
  &-necromancy::after {
    content: '💀';
  }

  &-abjuration::after {
    content: '🛡️';
  }

  &-evocation::after {
    content: '🔥';
  }

  &-enchantment::after {
    content: '✨';
  }

  &-illusion::after {
    content: '👻';
  }

  &-transmutation::after {
    content: '🐉';
  }

  &-divination::after {
    content: '✝️';
  }

  &-conjuration::after {
    content: '🎩';
  }

  /** Icons for Spell attributes */
  &-ritual::after {
    content: '🕯️';
  }

  &-concentration::after {
    content: '🧠';
  }

  &-somatic::after {
    content: '👋';
  }

  &-verbal::after {
    content: '🗣️';
  }

  &-material::after {
    content: '📦';
  }

  &-range::after {
    content: '🎯';
  }

  &-duration::after {
    content: '⏳';
  }

  &-casting-time::after {
    content: '⏱️';
  }

  &-negate{
    &::before {
      content: '🚫';
      position: absolute;
    }
    &::after {
      opacity: .5;
    }
  }

  /** Icon for damage types */
  &-damage-acid::after {
    content: '🟢';
  }

  &-damage-bludgeoning::after {
    content: '🔨';
  }

  &-damage-cold::after {
    content: '❄️';
  }

  &-damage-fire::after {
    content: '🔥';
  }

  &-damage-force::after {
    content: '💥';
  }

  &-damage-lightning::after {
    content: '⚡';
  }

  &-damage-necrotic::after {
    content: '💀';
  }

  &-damage-piercing::after {
    content: '🔪';
  }

  &-damage-poison::after {
    content: '☠️';
  }

  &-damage-psychic::after {
    content: '🌀';
  }

  &-damage-radiant::after {
    content: '🌞';
  }

  &-damage-slashing::after {
    content: '🗡️';
  }

  &-damage-thunder::after {
    content: '⚡';
  }
}

// Buttons.
.btn {
  padding: 10px;
  margin-top: 10px;
  opacity: 0.2;
  transition: opacity 0.8s;

  &:hover {
    opacity: 1;
  }

  &-primary {
    background-color: purple;
    border: 1px solid purple;
    color: white;
  }

  &-secondary {
    background-color: blue;
    border: 1px solid white;
    color: white;
  }
}

.selected-list {
  display: flex;
  flex-direction: column-reverse;
}

.selected-list-print {
  margin-left: 10px;
}

.selected-card + .selected-card {
  margin-bottom: 10px;
}

@media print {
  .selected-list-container ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    li {
      transform: scale(.5);
    }
  }
}
</style>
