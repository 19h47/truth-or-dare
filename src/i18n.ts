import tasksEn from '@/inc/tasks.en.json';
import tasksFr from '@/inc/tasks.fr.json';

const en = {
	title: 'Truth or dare',
	by: 'by',
	tagline: 'Pic or it didn’t happen',
	reload: 'Reload',
	share: 'Share',
	save: 'Save',
	truth: 'Truth',
	dare: 'Dare',
	lightMode: 'Light mode',
	darkMode: 'Dark mode',
	alternate: { lang: 'fr', label: 'Français', href: 'fr/' },
	tasks: tasksEn,
};

const fr: typeof en = {
	title: 'Action ou vérité',
	by: 'par',
	tagline: 'Photo ou ça compte pas',
	reload: 'Encore',
	share: 'Partager',
	save: 'Enregistrer',
	truth: 'Vérité',
	dare: 'Action',
	lightMode: 'Mode clair',
	darkMode: 'Mode sombre',
	alternate: { lang: 'en', label: 'English', href: '../' },
	tasks: tasksFr,
};

export const locale = document.documentElement.lang === 'fr' ? 'fr' : 'en';
export const t = { en, fr }[locale];
