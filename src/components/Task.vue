<template>
	<transition @enter="enter" @after-enter="emit('ready')" @leave="leave" mode="out-in">
		<div
			class="task"
			aria-hidden="true"
			v-html="store.task.content"
			:key="store.task.content"
		></div>
	</transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { useTaskStore } from '@/stores/task';

gsap.registerPlugin(SplitText);

const emit = defineEmits<{ ready: [] }>();

const store = useTaskStore();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function enter(element: Element, done: () => void) {
	if (reducedMotion.matches) {
		gsap.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, onComplete: done });
		return;
	}

	const { chars } = SplitText.create(element, {
		type: 'chars,words,lines',
		charsClass: 'character',
		wordsClass: 'word',
		linesClass: 'line',
		aria: 'none',
	});

	gsap.fromTo(
		chars,
		{ y: 10, autoAlpha: 0 },
		{
			y: 0,
			autoAlpha: 1,
			stagger: 0.05,
			onComplete: done,
		},
	);
}

function leave(element: Element, done: () => void) {
	if (reducedMotion.matches) {
		gsap.to(element, { autoAlpha: 0, onComplete: done });
		return;
	}

	gsap.to(element, {
		autoAlpha: 0,
		y: -5,
		onComplete: done,
	});
}
onMounted(() => emit('ready'));
</script>
