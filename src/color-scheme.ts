import { computed, ref, watchEffect } from 'vue';

type ColorScheme = 'light' | 'dark';

const storageKey = 'color-scheme';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function read(): ColorScheme | null {
	try {
		const value = localStorage.getItem(storageKey);

		return value === 'light' || value === 'dark' ? value : null;
	} catch {
		return null;
	}
}

function write(value: ColorScheme | null) {
	try {
		if (value) {
			localStorage.setItem(storageKey, value);
		} else {
			localStorage.removeItem(storageKey);
		}
	} catch {
		// Storage can be blocked: the choice then only lasts for this visit.
	}
}

const systemScheme = ref<ColorScheme>(prefersDark.matches ? 'dark' : 'light');
const chosenScheme = ref(read());

prefersDark.addEventListener('change', ({ matches }) => {
	systemScheme.value = matches ? 'dark' : 'light';
});

watchEffect(() => {
	document.documentElement.style.colorScheme = chosenScheme.value ?? '';
	write(chosenScheme.value);
});

export const colorScheme = computed(() => chosenScheme.value ?? systemScheme.value);

export function toggleColorScheme() {
	const next = colorScheme.value === 'dark' ? 'light' : 'dark';

	chosenScheme.value = next === systemScheme.value ? null : next;
}
