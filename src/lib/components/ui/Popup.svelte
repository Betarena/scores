<script lang="ts">
	import { onMount, tick } from 'svelte';

	export let isOpen = false;
  export let closeOnOutsideClick = true;
	let popupElement: HTMLDivElement;
	let triggerElement: HTMLElement;

	interface Position {
		bottom: number;
		left: number;
	}

	let position: Position = { bottom: 0, left: 0 };

	function calculatePosition(): Position {
		if (!triggerElement || !popupElement) return { bottom: 0, left: 0 };


		const MARGIN = 8;

		let left = 0;

		return {
			bottom: Math.round(-MARGIN),
			left: Math.round(left)
		};
	}

	function open(event: Event): void {
		triggerElement = event.currentTarget as HTMLElement;
		isOpen = true;
    tick().then(() => {
      position = calculatePosition();
    });
	}

	function close(): void {
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			close();
		}
	}

	function handleOutsideClick(event: MouseEvent): void {
    if (!closeOnOutsideClick) return;
		const target = event.target as HTMLElement;

		if (
			popupElement &&
			triggerElement &&
			!popupElement.contains(target) &&
			!triggerElement.contains(target)
		) {
			close();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('click', handleOutsideClick);

		const handleResize = (): void => {
			if (isOpen) {
				tick().then(() => {
					position = calculatePosition();
				});
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('click', handleOutsideClick);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="popup-wrapper">
	<div on:click={open} role="button" tabindex="0" class="trigger-wrapper">
		<slot name="trigger" />
	</div>

	{#if isOpen}
		<div
			bind:this={popupElement}
			class="popup-container"
			style="bottom: {position.bottom}px; left: {position.left}px; transform: translateY(100%)"
			on:click|stopPropagation={() => {}}
		>
			<slot name="content" />
		</div>
	{/if}
</div>

<style>
	.popup-wrapper {
		display: contents;
	}

	.trigger-wrapper {
		position: relative;
		display: inline-block;
	}

	.popup-container {
		position: absolute;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000;
	}

	div[role='button'] {
		cursor: pointer;
	}
</style>
