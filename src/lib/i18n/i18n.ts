import i18next, { type i18n as I18NType } from 'i18next';
import uk from './locales/uk.json';
import en from './locales/en.json';
import ko from './locales/ko.json';
import sk from './locales/sk.json';
import type { ObjectValues } from '$lib/common/types/common.types';
import { createSubscriber } from 'svelte/reactivity';

export const LOCALES = {
	UK: 'uk',
	EN: 'en',
	KO: 'ko',
	SK: 'sk'
} as const;

export type Locales = ObjectValues<typeof LOCALES>;

export type I18NLabel = keyof typeof uk;

const queryLocaleRaw = new URL(window.location.href).searchParams.get('lang');
const queryLocale =
	queryLocaleRaw && Object.values(LOCALES).includes(queryLocaleRaw as Locales)
		? queryLocaleRaw
		: null;
const defaultLocale = queryLocale || window.localStorage.getItem('lang') || LOCALES.UK;

const i18nextOptions = {
	lng: defaultLocale,
	debug: true,
	resources: {
		uk: {
			translation: uk
		},
		en: {
			translation: en
		},
		ko: {
			translation: ko
		},
		sk: {
			translation: sk
		}
	}
};

export class ReactiveI18Next {
	#subscription;
	#i18next: I18NType;

	constructor() {
		this.#i18next = i18next;
		this.#i18next.init(i18nextOptions);

		this.#subscription = createSubscriber((update) => {
			this.#i18next.on('initialized', update);
			this.#i18next.on('languageChanged', () => {
				window.localStorage.setItem('lang', i18next.resolvedLanguage ?? '');
				update();
			});
		});
	}

	get t() {
		this.#subscription();

		return this.#i18next.t;
	}

	get isInitialized() {
		this.#subscription();

		return this.#i18next.isInitialized;
	}

	get resolvedLanguage() {
		this.#subscription();

		return this.#i18next.resolvedLanguage;
	}

	get changeLanguage() {
		this.#subscription();

		return this.#i18next.changeLanguage;
	}
}

export const i18n = new ReactiveI18Next();
