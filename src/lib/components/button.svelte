<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { buttonVariants } from './shared';

	type BaseProps = {
		variant?: 'primary' | 'secondary' | 'tertiary';
		size?: 'normal' | 'compact';
		disabled?: boolean;
	};

	type Props = BaseProps & HTMLButtonAttributes;

	let { variant = 'secondary', size = 'normal', disabled, children, ...rest }: Props = $props();

	const buttonClass = buttonVariants({
		variants: variant,
		size: size,
		disabled: Boolean(disabled)
	});
</script>

<button class={buttonClass} {...rest}>
	{@render children?.()}
</button>
