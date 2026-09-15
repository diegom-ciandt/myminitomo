import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ptBR from './locales/pt-BR'
import frFR from './locales/fr-FR'

const SUPPORTED = ['en', 'pt-BR', 'fr-FR'];
const urlLang = new URLSearchParams(window.location.search).get('lang') ?? '';
const initialLocale = SUPPORTED.includes(urlLang) ? urlLang : 'en';

export const i18n = createI18n({
  legacy: true,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    'pt-BR': ptBR,
    'fr-FR': frFR,
  },
})
