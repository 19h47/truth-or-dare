<template>
	<transition name="fade" mode="out-in" appear>
		<img v-if="$store.getters['value']" :src="flexedBiceps" />
		<img v-else :src="indexPointingUp" />
	</transition>
</template>

<script>
import { mapState } from 'vuex';

import flexedBiceps from '@/img/png/flexed-biceps.png';
import indexPointingUp from '@/img/png/index-pointing-up.png';

export default {
	name: 'Value',
	data() {
		return {
			flexedBiceps,
			indexPointingUp,
		};
	},
	computed: {
		...mapState(['value']),
	},
	watch: {
		value(val = false) {
			const link = document.querySelector("link[rel*='icon']");

			link.href = indexPointingUp;

			if (val) {
				link.href = flexedBiceps;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
img {
	width: 30px;
	height: 30px;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}
</style>
