<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { Row } from '$lib/components/ui/table/Table.svelte';
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts" >
  // #region ➤ 📦 Package Imports
	
	// ╭────────────────────────────────────────────────────────────────────────╮
	// │ NOTE:                                                                  │
	// │ Please add inside 'this' region the 'imports' that are required        │
	// │ by 'this' .svelte file is ran.                                         │
	// │ IMPORTANT                                                              │
	// │ Please, structure the imports as follows:                              │
	// │ 1. svelte/sveltekit imports                                            │
	// │ 2. project-internal files and logic                                    │
	// │ 3. component import(s)                                                 │
	// │ 4. assets import(s)                                                    │
	// │ 5. type(s) imports(s)                                                  │
	// ╰────────────────────────────────────────────────────────────────────────╯
	import type { Column, Row } from "$lib/types/types.table";
	import { createEventDispatcher, type EventDispatcher } from "svelte";
	import ArrowDown from "../assets/arrow-down.svelte";
  import session from "$lib/store/session";
	
	// #endregion ➤ 📦 Package Imports


	// #region ➤ 📌 VARIABLES

	

	export let columns: Column[] = [];
	export let rows: Row[] = [];
	export let selected: Row["id"][] = []
	export let sortable = false;
	export let hoverable = true;
	export let striped = false;
	export let classname = '';

	$: ({viewportType} = $session)

	let sortColumn: string | null = null;
	let sortDirection: 'asc' | 'desc' = 'asc';

	const dispatch: EventDispatcher<{sort: {column: string, direction: 'asc' | 'desc'}}> = createEventDispatcher();

	$: totalGrow = columns.reduce((sum, col) => {
		if (typeof col.grow === 'number' && col.grow > 0) {
			return sum + col.grow;
		}
		return sum;
	}, 0);

	function getColumnStyle(column: Column): string {
		const styles: string[] = [];
		
		if (column.width) {
			styles.push(`width: ${column.width}`);
		} else if (typeof column.grow === 'number' && column.grow > 0 && totalGrow > 0) {
			const proportion = column.grow / totalGrow;
			styles.push(`width: ${proportion * 100}%`);
		}
		
		if (column.flex) {
			styles.push(`flex: ${column.flex}`);
		}
		
		return styles.join('; ');
	}

	// #endregion ➤ 📌 VARIABLES

	// #region ➤ 🔄 REACTIVE

	// #endregion ➤ 🔄 REACTIVE

	// #region ➤ 🟦 FUNCTIONS

	function handleSort(columnId: string) {
		if (!sortable) return;

		if (sortColumn === columnId) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = columnId;
			sortDirection = 'asc';
		}
		dispatch('sort', { column: sortColumn, direction: sortDirection });
	}

	function handleHeaderClick(columnId: string) {
		handleSort(columnId);
	}

	// #endregion ➤ 🟦 FUNCTIONS
</script>

<div class="table-wrapper {classname} {viewportType}">
	<table class="table" class:striped>
		<thead class="table-header">
			<tr>
				{#each columns as column (column.id)}
					<th
						class="table-header-cell"
						class:sortable={sortable && column.sortable !== false}
						class:active={sortColumn === column.id}
						class:grow={column.grow}
						on:click={() => handleHeaderClick(column.id)}
						style={getColumnStyle(column)}
					>
						<div class="header-content">
							<span class="header-label">{column.label}</span>
							{#if sortable && column.sortable !== false && sortColumn === column.id}
								<span class="sort-indicator" class:desc={sortDirection === 'desc'}>
									<ArrowDown />
								</span>
							{/if}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="table-body">
			{#each rows as row (row.id)}
				<tr class="table-row" class:hoverable class:selected={selected.includes(row.id)}>
					{#each columns as column (column.id)}
						<td 
							class="table-cell"
							class:grow={column.grow}
							style={getColumnStyle(column)}
						>
							<slot name="cell" {row} {column} value={row[column.id]}>
								{#if row}
									 {row[column.id]}
								{/if}
							</slot>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
	.table-wrapper {
		width: 100%;
		overflow-x: auto;
		border: 1px solid var(--colors-border-border-secondary, #3b3b3b);
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-family-body, 'roboto', sans-serif);
		display: table;

		&.striped tbody tr:nth-child(even) {
			background-color: var(--colors-background-bg-secondary, #232323);
		}
	}

	// Table Header
	.table-header {
		background-color: var(--colors-background-bg-secondary, #232323);
		border-bottom: 1px solid var(--colors-border-border-secondary, #3b3b3b);
	}

	.table-header-cell {
		padding: var(--spacing-lg, 12px) var(--spacing-3xl, 24px);
		height: 44px;
		text-align: left;
		font-weight: 600;
		font-size: var(--font-size-text-xs, 12px);
		line-height: var(--line-height-text-xs, 18px);
		color: var(--colors-text-text-quaternary-500, #8c8c8c);
		user-select: none;
		white-space: nowrap;
		flex-shrink: 0;

		&.grow {
			width: 100%;
		}

		&.sortable {
			cursor: pointer;

			&:hover {
				background-color: var(--colors-background-bg-primary-hover, #3b3b3b);
			}
		}

	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.header-label {
		white-space: nowrap;
	}

	.sort-indicator {
		display: inline-flex;
		align-items: center;
		font-size: 12px;
		// transition: transform 0.2s ease;

		&.desc {
			transform: rotate(180deg);
		}
	}

	// Table Body
	.table-body {
		cursor: default;
		background-color: var(--colors-background-bg-primary, #1f1f1f);
	}

	.table-row {
		border-bottom: 1px solid var(--colors-border-border-secondary, #3b3b3b);
		transition: background-color 0.2s ease;

		&.hoverable:hover {
			background-color: var(--colors-background-bg-primary-hover, #2a2a2a);
		}
		&:last-of-type {
			border-bottom: none;
		}
		&.selected {
			background-color: var(--colors-background-bg-secondary, #232323);
		}
	}

	.table-cell {
		padding: var(--spacing-xl, 16px) var(--spacing-3xl, 24px);
		height: 72px;
		text-align: left;
		vertical-align: middle;
		font-weight: 400;
		font-size: var(--font-size-text-sm, 14px);
		line-height: var(--line-height-text-sm, 20px);
		color: var(--colors-text-text-tertiary-600, #8c8c8c);
		flex-shrink: 0;

		&.grow {
			width: 100%;
		}
	}

	.mobile {
		.table-cell {
			padding: var(--spacing-xl, 16px);
		}
	}
</style>
