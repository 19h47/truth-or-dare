import Vuex from 'vuex';
import Vue from 'vue';

import tasks from '@/tasks';

Vue.use(Vuex);

// console.log(wishes);

export default new Vuex.Store({
	state: {
		index: 0,
		value: tasks[0].value,
		task: tasks[0].content,
	},
	actions: {
		updateAction(context) {
			context.commit('updateMutation');
		},
	},
	mutations: {
		updateMutation(state) {
			const random = Math.floor(Math.random() * tasks.length);

			state.task = tasks[random].content;
			state.value = tasks[random].value;
			state.index = random;
		},
	},
	getters: {
		index: state => state.index,
		value: state => state.value,
		wish: state => state.task,
	},
});