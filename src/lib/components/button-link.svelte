<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { buttonVariants } from './shared';

	type BaseProps = {
		variant?: 'primary' | 'secondary' | 'tertiary';
		size?: 'normal' | 'compact';
		disabled?: boolean;
	};

	type Props = BaseProps & HTMLAnchorAttributes;

	let {
		variant = 'secondary',
		size = 'normal',
		disabled = false,
		children,
		...rest
	}: Props = $props();

	const buttonClass = $derived(
		buttonVariants({
			variants: variant,
			size: size,
			disabled: Boolean(disabled)
		})
	);
</script>

<a class={buttonClass} {...rest}>
	{@render children?.()}
</a>
