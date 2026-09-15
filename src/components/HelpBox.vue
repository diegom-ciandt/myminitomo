<template>
  <div class="help-box">
    <h3>{{ $t('helpBox.title') }}</h3>

    <section v-for="section in sections" :key="section.key" class="help-section">
      <h4 class="section-title" @click="toggle(section.key)">
        {{ section.label }}
        <span class="chevron" :class="{ open: openSections[section.key] }">▸</span>
      </h4>
      <div v-show="openSections[section.key]">
        <ol v-if="section.key === 'howto'" class="how-to-use">
          <li>{{ $t('helpBox.howto.step1') }}</li>
          <li>{{ $t('helpBox.howto.step2') }}</li>
          <li>{{ $t('helpBox.howto.step3') }}</li>
          <li>{{ $t('helpBox.howto.step4') }}</li>
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
import { reactive, computed } from 'vue';
import { i18n } from '../i18n';

export default {
  name: "HelpBox",
  props: {
    classes: { type: Array as () => any[], default: () => [] },
    schools: { type: Array as () => any[], default: () => [] },
  },
  setup(props: { classes: any[], schools: any[] }) {
    const t = i18n.global.t.bind(i18n.global);
    const openSections = reactive({
      howto: true,
      cardIcons: false,
      schoolIcons: false,
      classIcons: false,
    });

    function toggle(key: string) {
      openSections[key] = !openSections[key];
    }

    const sections = computed(() => [
      { key: 'howto', label: t('helpBox.howto.label'), items: [] },
      {
        key: 'cardIcons', label: t('helpBox.cardIcons.label'), items: [
          { id: 1, icon: 'range',         text: t('helpBox.cardIcons.range') },
          { id: 2, icon: 'casting-time',  text: t('helpBox.cardIcons.castingTime') },
          { id: 3, icon: 'duration',      text: t('helpBox.cardIcons.duration') },
          { id: 4, icon: 'concentration', text: t('helpBox.cardIcons.concentration') },
          { id: 5, icon: 'ritual',        text: t('helpBox.cardIcons.ritual') },
          { id: 6, icon: 'somatic',       text: t('helpBox.cardIcons.somatic') },
          { id: 7, icon: 'verbal',        text: t('helpBox.cardIcons.verbal') },
          { id: 8, icon: 'material',      text: t('helpBox.cardIcons.material') },
        ]
      },
      {
        key: 'schoolIcons', label: t('helpBox.schoolIcons.label'),
        items: props.schools.map(s => ({ id: s.index, icon: s.index, text: `${s.name}: ${s.desc}` })),
      },
      {
        key: 'classIcons', label: t('helpBox.classIcons.label'),
        items: props.classes.map(cls => ({ id: cls.index, icon: cls.index, text: cls.name })),
      },
    ]);

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
