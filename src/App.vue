<template>
  <the-header />
  <div class="main" id="main">
    <HelpBox :classes="dndClasses" :schools="dndSchools" :class="{ 'tab-active': activeTab === 'help' }" />
    <SpellList :classes="dndClasses" @select-card="addNewSelectedCard" :class="{ 'tab-active': activeTab === 'spells' }" />
    <div class="selected-list-container" :class="{ 'tab-active': activeTab === 'cards' }">
      <h2 class="selected-list-title">{{ $t('app.selectedCards') }} <span v-if="selectedCards.length" class="selected-list-count">({{ selectedCards.length }})</span></h2>
      <button @click="clearSelectedCards" class="btn btn-primary selected-list-refresh">{{ $t('app.removeAll') }}</button>
      <button @click="printSelectedCards" class="btn btn-primary selected-list-print">{{ $t('app.printAll') }}</button>
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
  <nav class="mobile-nav">
    <button :class="{ active: activeTab === 'help' }" @click="activeTab = 'help'">
      <span class="mobile-nav-icon">❓</span>
      <small>Help</small>
    </button>
    <button :class="{ active: activeTab === 'spells' }" @click="activeTab = 'spells'">
      <span class="mobile-nav-icon">📜</span>
      <small>Spells</small>
    </button>
    <button :class="{ active: activeTab === 'cards' }" @click="activeTab = 'cards'">
      <span class="mobile-nav-icon">🃏</span>
      <small>Cards <span v-if="selectedCards.length" class="mobile-nav-badge">{{ selectedCards.length }}</span></small>
    </button>
  </nav>
  <the-footer />
</template>

<script lang="ts" allowJs="true">
import { defineComponent } from "vue";
import uniqueId from "lodash.uniqueid";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
      dndClasses: [] as any[],
      dndSchools: [] as any[],
      activeTab: 'spells' as string,
    };
  },
  created() {
    this.loadSelectedCards();
    this.loadClasses(this.$i18n.locale);
    this.loadSchools(this.$i18n.locale);
    window.addEventListener('storage', this.loadSelectedCards);
  },
  watch: {
    '$i18n.locale'(newLocale: string) {
      this.loadClasses(newLocale);
      this.loadSchools(newLocale);
    }
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.loadSelectedCards);
  },
  methods: {
    async loadSchools(locale: string) {
      const cacheKey = `schools_${locale}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) { this.dndSchools = JSON.parse(cached); return; }
      try {
        const query = `{ magicSchools(lang: "${locale}") { index name desc } }`;
        const response = await fetch('https://www.dnd5eapi.co/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const json = await response.json();
        if (json.errors) throw new Error(json.errors[0].message);
        const sorted = json.data.magicSchools.slice().sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.dndSchools = sorted;
        localStorage.setItem(cacheKey, JSON.stringify(sorted));
      } catch (e) {
        console.error('Failed to load magic schools', e);
      }
    },
    async loadClasses(locale: string) {
      const cacheKey = `classes_${locale}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) { this.dndClasses = JSON.parse(cached); return; }
      try {
        const query = `{ classes(lang: "${locale}") { index name } }`;
        const response = await fetch('https://www.dnd5eapi.co/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const json = await response.json();
        if (json.errors) throw new Error(json.errors[0].message);
        const sorted = json.data.classes.slice().sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.dndClasses = sorted;
        localStorage.setItem(cacheKey, JSON.stringify(sorted));
      } catch (e) {
        console.error('Failed to load classes', e);
      }
    },
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
    async printSelectedCards() {
      const CARD_W = 63.5;
      const CARD_H = 88.9;
      const MARGIN = 10;
      const GAP = 2;
      const PAGE_W = 297;
      const PAGE_H = 210;

      const cols = Math.floor((PAGE_W - MARGIN * 2 + GAP) / (CARD_W + GAP));
      const rows = Math.floor((PAGE_H - MARGIN * 2 + GAP) / (CARD_H + GAP));
      const perPage = cols * rows;

      const cardEls = document.querySelectorAll<HTMLElement>('.selected-list .card-container');
      if (!cardEls.length) return;

      document.body.style.cursor = 'wait';
      try {
        const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });

        for (let i = 0; i < cardEls.length; i++) {
          if (i > 0 && i % perPage === 0) pdf.addPage();

          const canvas = await html2canvas(cardEls[i], { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL('image/png');

          const pos = i % perPage;
          const x = MARGIN + (pos % cols) * (CARD_W + GAP);
          const y = MARGIN + Math.floor(pos / cols) * (CARD_H + GAP);

          pdf.addImage(imgData, 'PNG', x, y, CARD_W, CARD_H);
        }

        const now = new Date();
        const timestamp = now.toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
        pdf.save(`spell-cards_${timestamp}.pdf`);
      } finally {
        document.body.style.cursor = '';
      }
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

.mobile-nav {
  display: none;
}

@media (max-width: 430px) {
  :root {
    --hdr: 70px;
    --ftr: 66px;
    --nav: 64px;
  }

  .main {
    position: fixed;
    top: var(--hdr);
    bottom: calc(var(--ftr) + var(--nav));
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    padding-bottom: 0;
    overflow: hidden;

    & > div {
      display: none;
      width: 100%;
      margin: 0;
      height: 100%;
      overflow-y: auto;

      &.tab-active {
        display: block;
      }
    }
  }

  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: var(--ftr);
    left: 0;
    width: 100%;
    height: var(--nav);
    z-index: 2147483646;
    background: linear-gradient(135deg, #1a0033 0%, #3b0764 100%);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.5);

    button {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 4px;
      background: transparent;
      border: none;
      color: #c084fc;
      cursor: pointer;
      gap: 2px;
      opacity: 0.6;
      transition: opacity 0.2s;

      small {
        font-size: 1rem;
        position: relative;
      }

      &.active {
        opacity: 1;
        color: #e8d5ff;
        border-top: 2px solid #c084fc;
      }
    }
  }

  .mobile-nav-icon {
    font-size: 1.6rem;
    line-height: 1;
  }

  .selected-list-container {
    padding: 0 12px;
    box-sizing: border-box;
  }

  .selected-card {
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(128, 0, 128, 0.35);
  }

  .spell-list-title,
  .spell-list-refresh,
  .spell-list-filters {
    padding-left: 12px;
    padding-right: 12px;
  }

  .mobile-nav-badge {
    position: absolute;
    top: -6px;
    right: -12px;
    background: purple;
    color: white;
    border-radius: 50%;
    font-size: 0.8rem;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    content: '🌑';
  }

  &-paladin::after {
    content: '⚜️';
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

  &-monk::after {
    content: '🥋';
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
</style>
