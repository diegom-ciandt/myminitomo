<template>
  <div class="help-box">
    <h3>Help Box</h3>

    <section v-for="section in sections" :key="section.key" class="help-section">
      <h4 class="section-title" @click="toggle(section.key)">
        {{ section.label }}
        <span class="chevron" :class="{ open: openSections[section.key] }">▸</span>
      </h4>
      <div v-show="openSections[section.key]">
        <ol v-if="section.key === 'howto'" class="how-to-use">
          <li>Use the filters on the Spell List to narrow down spells by name, level, or class.</li>
          <li>Click on any spell in the list to add it to your selection.</li>
          <li>At each card, you can change the main image for one that you think it fits more to your taste.</li>
          <li>Once you have all the cards you want, click <strong>Print all Cards</strong> to print them.</li>
        </ol>
        <ul v-else class="icon-list">
          <li v-for="item in section.items" :key="item.id">
            <span class="icon" :class="'icon icon-' + item.icon"></span>
            {{ item.text }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { reactive } from 'vue';

export default {
  name: "HelpBox",
  setup() {
    const openSections = reactive({
      howto: true,
      cardIcons: false,
      schoolIcons: false,
      classIcons: false,
    });

    function toggle(key: string) {
      openSections[key] = !openSections[key];
    }

    const sections = [
      { key: 'howto', label: 'How to use:', items: [] },
      {
        key: 'cardIcons', label: 'Card Icons:', items: [
          { id: 1, icon: 'range',         text: 'Range: How far the spell reaches.' },
          { id: 2, icon: 'casting-time',  text: 'Casting Time: How long it takes to cast.' },
          { id: 3, icon: 'duration',      text: 'Duration: How long the spell lasts.' },
          { id: 4, icon: 'concentration', text: 'Concentration: Requires sustained focus to maintain.' },
          { id: 5, icon: 'ritual',        text: 'Ritual: Can be cast as a ritual (takes 10 extra minutes, no spell slot).' },
          { id: 6, icon: 'somatic',       text: 'Somatic (S): Requires a specific hand gesture.' },
          { id: 7, icon: 'verbal',        text: 'Verbal (V): Requires a spoken incantation.' },
          { id: 8, icon: 'material',      text: 'Material (M): Requires a physical component. The component is described next to it, also with information if it\'s consumed as part of the spell.' },
        ]
      },
      {
        key: 'schoolIcons', label: 'Magic School Icons:', items: [
          { id: 1, icon: 'abjuration',    text: 'Abjuration: Protective magic that blocks, banishes, or negates threats.' },
          { id: 2, icon: 'conjuration',   text: 'Conjuration: Summons creatures, objects, or teleports the caster.' },
          { id: 3, icon: 'divination',    text: 'Divination: Reveals hidden knowledge, predicts the future, or detects the unseen.' },
          { id: 4, icon: 'enchantment',   text: 'Enchantment: Influences the minds of others, charming or commanding them.' },
          { id: 5, icon: 'evocation',     text: 'Evocation: Channels raw magical energy to deal damage or heal.' },
          { id: 6, icon: 'illusion',      text: 'Illusion: Creates false sensory impressions and deceives the mind.' },
          { id: 7, icon: 'necromancy',    text: 'Necromancy: Manipulates life force, raising the dead or draining vitality.' },
          { id: 8, icon: 'transmutation', text: 'Transmutation: Transforms matter, energy, or properties of creatures and objects.' },
        ]
      },
      {
        key: 'classIcons', label: 'Class Icons:', items: [
          { id: 1,  icon: 'barbarian', text: 'Barbarian: A fierce warrior who can enter a battle rage.' },
          { id: 2,  icon: 'fighter',   text: 'Fighter: A master of martial combat, skilled with a variety of weapons and armor.' },
          { id: 3,  icon: 'ranger',    text: 'Ranger: A warrior who combines martial prowess with nature magic.' },
          { id: 4,  icon: 'rogue',     text: 'Rogue: A scoundrel who uses stealth and trickery to overcome obstacles.' },
          { id: 5,  icon: 'paladin',   text: 'Paladin: A holy warrior bound to a sacred oath.' },
          { id: 6,  icon: 'bard',      text: 'Bard: An inspiring magician whose power echoes the music of creation.' },
          { id: 7,  icon: 'cleric',    text: 'Cleric: A priestly champion who wields divine magic.' },
          { id: 8,  icon: 'druid',     text: 'Druid: A priest of the Old Faith, wielding the powers of nature.' },
          { id: 9,  icon: 'sorcerer',  text: 'Sorcerer: A spellcaster who draws on inherent magic from a bloodline.' },
          { id: 10, icon: 'warlock',   text: 'Warlock: A spellcaster who gains magic through a pact with a powerful entity.' },
          { id: 11, icon: 'wizard',    text: 'Wizard: A scholarly magic-user who casts spells through rigorous study.' },
        ]
      },
    ];

    return { sections, openSections, toggle };
  }
}
</script>

<style lang="scss" scoped>
.help-box {
  background-color: lightgray;
  padding: 20px;
  border-top-right-radius: 50px;
  border-bottom-left-radius: 50px;
}

.help-section {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  margin: 0 0 6px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    opacity: 0.75;
  }
}

.chevron {
  display: inline-block;
  transition: transform 0.2s ease;
  font-style: normal;

  &.open {
    transform: rotate(90deg);
  }
}

.how-to-use {
  margin: 0;
  padding-left: 20px;

  li {
    margin-bottom: 4px;
  }
}

.icon-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
}
</style>
