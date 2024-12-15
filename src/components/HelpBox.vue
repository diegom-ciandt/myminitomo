<template>
  <div class="help-box not-printable">
    <h3>Help Box</h3>
    <ul>
      <li v-for="item in helpBoxItems" :key="item.id">
        <span class="icon" :class="'icon icon-' + item.icon"></span>
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">

export default {
  name: "HelpBox",
  setup() {
    return {
      helpBoxItems: [
        { id: 1, icon: 'barbarian', text: 'Barbarian: A fierce warrior of primitive background who can enter a battle rage.' },
        { id: 2, icon: 'fighter', text: 'Fighter: A master of martial combat, skilled with a variety of weapons and armor.' },
        { id: 3, icon: 'ranger', text: 'Ranger: A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.' },
        { id: 4, icon: 'rogue', text: 'Rogue: A scoundrel who uses stealth and trickery to overcome obstacles and enemies.' },
        { id: 5, icon: 'paladin', text: 'Paladin: A holy warrior bound to a sacred oath to uphold justice and righteousness.' },
        { id: 6, icon: 'bard', text: 'Bard: An inspiring magician whose power echoes the music of creation.' },
        { id: 7, icon: 'cleric', text: 'Cleric: A priestly champion who wields divine magic in service of a higher power.' },
        { id: 8, icon: 'druid', text: 'Druid: A priest of the Old Faith, wielding the powers of nature—moonlight and plant growth, fire and lightning—and adopting animal forms.' },
        { id: 9, icon: 'sorcerer', text: 'Sorcerer: A spellcaster who draws on inherent magic from a gift or bloodline.' },
        { id: 10, icon: 'warlock', text: 'Warlock: A spellcaster who gain magic by the help of a magic entity.'},
      ]
    };
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
</style>
