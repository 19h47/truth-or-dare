import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { t } from '@/i18n';

export const useTaskStore = defineStore('task', () => {
	const index = ref(Math.floor(Math.random() * t.tasks.length));
	const task = computed(() => t.tasks[index.value]);
	const text = computed(() => {
		const { body } = new DOMParser().parseFromString(task.value.content, 'text/html');

		body.querySelectorAll('br').forEach(br => br.replaceWith(' '));

		return body.textContent;
	});

	function next() {
		const offset = 1 + Math.floor(Math.random() * (t.tasks.length - 1));

		index.value = (index.value + offset) % t.tasks.length;
	}

	return { index, task, text, next };
});
