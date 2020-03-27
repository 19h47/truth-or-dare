<template>
	<div id="app">
		<header class="header" v-if="showTask">
			<value></value>
			<p>Pic or it didn't happen</p>
		</header>
		<div class="container" ref="canvas">
			<transition name="fade" mode="out-in" appear>
				<div v-if="!showTask" key="button">
					<h1 style="line-height: 30px;">
						Truth or dare<br />
						<span style="font-size: 18px; font-weight: 300;"
							>by <strong>ines a</strong> & <strong>19h47</strong></span
						>
					</h1>
					<button
						type="button"
						class="button"
						@click="
							showTask = !showTask;
							$store.dispatch('updateAction');
						"
						style="margin-right: 7.5px;"
					>
						Truth or dare</button
					><!--
					--><a
						class="button"
						href="http://lebitchclub.fr/"
						rel="noopener noreferrer"
						style="margin-left: 7.5px;"
						target="_blank"
						>Le Bitch Club</a
					>
				</div>
				<div v-if="showTask" key="wish">
					<task />
				</div>
			</transition>
		</div>

		<transition name="fade">
			<footer v-if="showTask">
				<div class="Footer__column Footer__column--left">
					<button
						class="button"
						@click="$store.dispatch('updateAction')"
						type="button"
						style="margin-right: 7.5px;"
					>
						Reload
					</button>
					<button
						class="button"
						@click="share($refs.canvas)"
						type="button"
						style="margin: 0 15px 0 7.5px;"
					>
						Save
					</button>

					<url></url>
				</div>

				<div class="Footer__column Footer__column--right" style="color: white;">
					<small
						>By
						<a href="http://inesa.fr" target="_blank"><strong>ines a</strong></a>
						&
						<a href="https://19h47.fr" target="_blank"><strong>19h47</strong></a></small
					>
				</div>
			</footer>
		</transition>
	</div>
</template>

<script>
const task = () =>
	import(/* webpackChunkName: "task" */ './components/Task.vue').then(c => c.default);
const value = () =>
	import(/* webpackChunkName: "value" */ './components/Value.vue').then(c => c.default);
const url = () => import(/* webpackChunkName: "url" */ './components/Url.vue').then(c => c.default);

import html2canvas from 'html2canvas';

export default {
	name: 'App',
	components: { task, value, url },
	data() {
		return {
			showTask: false,
			canvas: null,
		};
	},
	methods: {
		share(element) {
			html2canvas(element).then(canvas => {
				const link = document.createElement('a');
				this.canvas = canvas.toDataURL('image/png');

				// const tab = window.open();

				// tab.document.body.style.margin = '0px';
				// tab.document.body.style.padding = '0px';

				// tab.document.body.innerHTML = `
				// 	<img
				// 		src="${this.canvas}"
				// 		width="${window.innerWidth}"
				// 		height="${window.innerHeight}">
				// `;

				link.download = 'truth-or-dare.png';
				link.href = this.canvas;
				link.click();
			});
		},
	},
};
</script>

<style lang="scss">
* {
	box-sizing: border-box;
}

html {
	height: 100%;
	width: 100%;
}
body {
	overflow: hidden;
	margin: 0;

	height: 100%;
	width: 100%;

	position: relative;
	font: {
		family: 'Work Sans', sans-serif;
		weight: 300;
		size: 18px;
	}
	line-height: 22px;
}

a {
	color: white;
}

#app {
	height: 100%;
	width: 100%;
}

h1,
.h1 {
	font: {
		size: 43px;
		weight: 500;
	}
	line-height: 44px;
}

h2,
.h2 {
	font-size: 32px;
	line-height: 44px;
}

h3,
.h3 {
	font-size: 24px;
	line-height: 44px;
}

.container {
	height: 100%;

	padding: {
		right: 15px;
		left: 15px;
	}

	@media (min-width: 768px) {
		padding: {
			right: 30px;
			left: 30px;
		}
	}

	background-color: black;
	color: white;

	display: flex;
	align-items: center;
	justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	border: {
		radius: 30px;
		color: white;
		style: solid;
		width: 1px;
	}
	padding: {
		top: 15px;
		right: 15px;
		bottom: 15px;
		left: 15px;
	}
	color: white;
	background-color: transparent;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	cursor: pointer;
	outline: none;
	font: {
		weight: 500;
		size: 13px;
	}
	line-height: normal;

	transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;

	&:hover {
		background-color: white;
		color: black;
	}
}

header {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	color: white;

	margin: {
		top: 30px;
		right: 30px;
		left: 30px;
	}

	display: flex;
	align-items: center;
	justify-content: space-between;
}

footer {
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;

	margin: {
		bottom: 30px;
		right: 30px;
		left: 30px;
	}

	@media (min-width: 768px) {
		display: flex;
		align-items: center;
	}

	svg {
		height: 15px;
		width: 15px;

		fill: white;
	}
}

.Footer {
	&__column {
		width: 100%;

		@media (min-width: 768px) {
			width: 50%;
		}

		&--right {
			margin-top: 15px;
			margin-left: 15px;

			@media (min-width: 768px) {
				margin-top: 0;
				margin-left: 0;
				text-align: right;
			}
		}

		&--left {
			display: flex;
			align-items: center;
			@media (min-width: 768px) {
			}
		}
	}
}
</style>
