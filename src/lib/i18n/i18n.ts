import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';

import uk from './locales/uk.json';

addMessages('uk', uk);

init({
	fallbackLocale: 'uk',
	initialLocale: getLocaleFromNavigator()
});

export type I18NLabel = keyof typeof uk;
