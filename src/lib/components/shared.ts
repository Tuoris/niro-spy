import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'flex font-bold rounded-sm border-2 border-r-4 border-b-4 px-4 py-2 text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 justify-center',
	variants: {
		variants: {
			primary: ' border-lime-900 bg-lime-500 active:bg-lime-600 text-neutral-50',
			secondary:
				'border-neutral-900 bg-sky-600 active:bg-sky-700 dark:border-sky-800 text-neutral-50',
			tertiary:
				'border-neutral-900 bg-neutral-200 active:bg-neutral-300 dark:border-neutral-800 dark:bg-neutral-600 dark:active:bg-neutral-700 text-neutral-800 dark:text-neutral-100'
		},
		size: {
			normal: 'px-4 py-2',
			compact: 'px-2 py-1'
		},
		disabled: {
			true: 'cursor-not-allowed border-neutral-950 bg-neutral-400 active:bg-neutral-500 dark:border-neutral-800 dark:bg-neutral-600 dark:active:bg-neutral-700 dark:text-neutral-400'
		}
	}
});
