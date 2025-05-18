import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'flex rounded-sm border-2 border-r-4 border-b-4 px-4 py-2 text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 justify-center',
	variants: {
		variants: {
			primary: 'font-bold border-green-900 bg-green-500 active:bg-green-600',
			secondary: 'border-slate-900 bg-sky-600 active:bg-sky-700 dark:border-slate-800',
			tertiary:
				'border-slate-900 bg-neutral-200 active:bg-neutral-300 dark:border-slate-800 dark:bg-slate-600 dark:active:bg-slate-700 text-slate-800 dark:text-slate-100'
		},
		size: {
			normal: 'px-4 py-2',
			compact: 'px-2 py-1'
		},
		disabled: {
			true: 'cursor-not-allowed border-slate-900 bg-neutral-400 active:bg-neutral-500 dark:border-slate-800 dark:bg-slate-600 dark:active:bg-slate-700'
		}
	}
});
