<template>
	<header v-if="showTask">
		<Value />
		<p>{{ t.tagline }}</p>
	</header>
	<div class="container" ref="canvas">
		<transition name="fade" mode="out-in" appear @after-enter="afterEnter">
			<div v-if="!showTask" key="button">
				<h1>{{ t.title }}</h1>
				<p class="byline">
					{{ t.by }}&nbsp;<strong>19h47</strong>,
					<time datetime="2019-01">{{ createdAt }}</time>
				</p>

				<button type="button" class="button primary" @click="start">{{ t.title }}</button>
				<Preferences />
			</div>
			<div v-else key="wish">
				<Task @ready="prepareShare" />
			</div>
		</transition>
	</div>
	<p class="visually-hidden" aria-live="polite">{{ showTask ? store.text : '' }}</p>

	<transition name="fade">
		<footer v-if="showTask">
			<div class="actions">
				<button class="button primary" @click="store.next()" type="button">
					{{ t.reload }}
				</button>
				<button class="button" @click="share" type="button">
					{{ canShare ? t.share : t.save }}
				</button>
			</div>

			<Preferences>
				<span
					>{{ t.by }}&nbsp;<a href="https://19h47.fr" target="_blank"
						><strong>19h47</strong></a
					></span
				>
			</Preferences>
		</footer>
	</transition>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, useTemplateRef } from 'vue';
import { domToBlob } from 'modern-screenshot';

import { colorScheme } from '@/color-scheme';
import Preferences from '@/components/Preferences.vue';
import { locale, t } from '@/i18n';
import { useTaskStore } from '@/stores/task';

const Task = defineAsyncComponent(() => import('./components/Task.vue'));
const Value = defineAsyncComponent(() => import('./components/Value.vue'));

const filename = 'truth-or-dare.png';
const url = new URL('./', window.location.href).href;
const createdAt = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
	new Date(2019, 0),
);
const canShare =
	navigator.canShare?.({ files: [new File([], filename, { type: 'image/png' })] }) ?? false;

const store = useTaskStore();
const showTask = ref(false);
const shareTarget = useTemplateRef('canvas');

let preparedImage: { key: string; blob: Promise<Blob> } | undefined;
let taskEntered = false;

function start() {
	showTask.value = true;
}

function capture(element: HTMLElement) {
	const key = [
		element.textContent,
		colorScheme.value,
		window.innerWidth,
		window.innerHeight,
		window.devicePixelRatio,
	].join();

	if (preparedImage?.key !== key) {
		const { backgroundColor } = getComputedStyle(document.body);
		const blob = domToBlob(element, { scale: window.devicePixelRatio, backgroundColor });

		blob.catch(() => (preparedImage = undefined));
		preparedImage = { key, blob };
	}

	return preparedImage.blob;
}

function prepareShare() {
	if (taskEntered && shareTarget.value) {
		capture(shareTarget.value);
	}
}

function afterEnter() {
	taskEntered = showTask.value;
	prepareShare();
}

function download(blob: Blob) {
	const href = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.download = filename;
	link.href = href;
	link.click();

	setTimeout(() => URL.revokeObjectURL(href));
}

async function share() {
	if (!shareTarget.value) {
		return;
	}

	const blob = await capture(shareTarget.value);

	if (!canShare) {
		download(blob);
		return;
	}

	const file = new File([blob], filename, { type: blob.type });

	try {
		await navigator.share({ files: [file], title: t.title, text: store.text, url });
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') {
			return;
		}

		download(blob);
	}
}
</script>

<style>
:root {
	color-scheme: light dark;

	--color-background: light-dark(white, black);
	--color-foreground: light-dark(black, white);

	--space-xs: 0.25rem;
	--space-s: 0.5rem;
	--space-m: 1rem;
	--space-l: 2rem;
	--gutter: var(--space-m);

	@media (min-width: 48rem) {
		--gutter: var(--space-l);
	}
}

* {
	box-sizing: border-box;
}

body {
	overflow: hidden;
	margin: 0;

	height: 100dvh;

	position: relative;
	font-family: 'Work Sans Variable', sans-serif;
	font-weight: 300;
	line-height: 1.5;
	background-color: var(--color-background);
	color: var(--color-foreground);
}

h1,
p {
	margin: 0;
}

sup {
	line-height: 0;
}

a {
	color: inherit;
}

#app {
	height: 100%;
}

h1 {
	font-size: 2.6875rem;
	font-weight: 500;
	line-height: 1.1;
}

.task {
	font-size: 1.5rem;
	font-weight: 500;
	line-height: 1.3;
}

.actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--space-s) var(--space-m);
}

.byline {
	margin-block-end: var(--space-l);
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	margin: -1px;
	padding: 0;
	border: 0;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
}

.container {
	height: 100%;

	padding-inline: var(--gutter);

	display: flex;
	align-items: center;
	justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	border: 1px solid;
	border-radius: var(--space-l);
	padding: calc(var(--space-m) - 1px);
	color: inherit;
	background-color: transparent;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	cursor: pointer;
	font: inherit;
	font-weight: 500;
	font-size: 0.8125rem;
	line-height: 1.2;

	transition:
		background-color 0.15s ease-in-out,
		color 0.15s ease-in-out;

	&:hover {
		background-color: var(--color-foreground);
		color: var(--color-background);
	}

	&:focus-visible {
		outline: 2px solid var(--color-foreground);
		outline-offset: var(--space-xs);
	}

	&.primary {
		background-color: var(--color-foreground);
		color: var(--color-background);

		&:hover {
			background-color: transparent;
			color: inherit;
		}
	}
}

.preferences {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--space-s) var(--space-m);
	font-size: 0.8125rem;

	.button + & {
		margin-block-start: var(--space-m);
	}
}

.link {
	padding: 0;
	border: 0;
	background-color: transparent;
	color: inherit;
	font: inherit;
	text-decoration: underline;
	cursor: pointer;
}

header {
	position: absolute;
	inset: var(--gutter) var(--gutter) auto;

	display: flex;
	align-items: center;
	justify-content: space-between;
}

footer {
	position: absolute;
	inset: auto var(--gutter) var(--gutter);

	display: flex;
	flex-direction: column;
	gap: var(--space-m);

	@media (min-width: 48rem) {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
}
</style>
