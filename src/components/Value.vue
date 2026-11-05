<template>
	<transition name="fade" mode="out-in" appear>
		<img v-if="store.task.type === 'dare'" :src="flexedBiceps" :alt="t.dare" />
		<img v-else :src="indexPointingUp" :alt="t.truth" />
	</transition>
</template>

<script setup lang="ts">
import { watch } from 'vue';

import flexedBiceps from '@/assets/img/png/flexed-biceps.png';
import indexPointingUp from '@/assets/img/png/index-pointing-up.png';
import { t } from '@/i18n';
import { useTaskStore } from '@/stores/task';

const store = useTaskStore();

watch(
	() => store.task.type,
	type => {
		const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");

		if (link) {
			link.href = type === 'dare' ? flexedBiceps : indexPointingUp;
		}
	},
);
</script>

<style scoped>
img {
	width: var(--space-l);
	height: var(--space-l);
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
