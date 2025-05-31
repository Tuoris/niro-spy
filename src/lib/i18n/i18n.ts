import i18next from 'i18next';
import uk from './locales/uk.json';
import en from './locales/en.json';
import type { ObjectValues } from '$lib/common/types/common.types';

export const LOCALES = {
	UK: 'uk',
	EN: 'en'
} as const;

export type Locales = ObjectValues<typeof LOCALES>;

export const currentLocale = window.localStorage.getItem('lang') || LOCALES.UK;

await i18next.init({
	lng: currentLocale,
	debug: true,
	resources: {
		uk: {
			translation: uk
		},
		en: {
			translation: en
		}
	}
});

export type I18NLabel = keyof typeof uk;
