import { expect, test, type Page } from '@playwright/test';

const locales = [
	{
		lang: 'en',
		path: './',
		title: 'Truth or dare',
		byline: 'by 19h47, January 2019',
		alternate: { label: 'Français', lang: 'fr' },
		reload: 'Reload',
		alts: ['Truth', 'Dare'],
	},
	{
		lang: 'fr',
		path: 'fr/',
		title: 'Action ou vérité',
		byline: 'par 19h47, janvier 2019',
		alternate: { label: 'English', lang: 'en' },
		reload: 'Encore',
		alts: ['Vérité', 'Action'],
	},
] as const;

const [en] = locales;

async function start(page: Page, title: string = en.title) {
	await page.getByRole('button', { name: title }).click();
	await expect(page.locator('.task')).toBeVisible();
}

function announcement(page: Page) {
	return page.locator('[aria-live]');
}

for (const locale of locales) {
	test.describe(locale.lang, () => {
		test('introduces the game', async ({ page, request }) => {
			await page.goto(locale.path);

			await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
			await expect(page).toHaveTitle(locale.title);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(locale.title);
			await expect(page.locator('.byline')).toHaveText(locale.byline);

			const image = await request.get(`open-graph-image.${locale.lang}.jpg`);

			expect(image.ok()).toBe(true);
		});

		test('links to the other language', async ({ page }) => {
			await page.goto(locale.path);
			await page.getByRole('link', { name: locale.alternate.label }).click();

			await expect(page.locator('html')).toHaveAttribute('lang', locale.alternate.lang);
		});

		test('announces each task and its type', async ({ page }) => {
			await page.goto(locale.path);
			await start(page, locale.title);

			await expect(announcement(page)).not.toBeEmpty();
			await expect(page.getByRole('banner').getByRole('img')).toHaveAttribute(
				'alt',
				new RegExp(`^(${locale.alts.join('|')})$`),
			);
		});
	});
}

test('never draws the same task twice in a row', async ({ page }) => {
	await page.goto(en.path);
	await start(page);

	let previous = await announcement(page).textContent();

	for (let draw = 0; draw < 20; draw++) {
		await page.getByRole('button', { name: en.reload }).click();
		await expect(announcement(page)).not.toHaveText(previous ?? '');
		previous = await announcement(page).textContent();
	}
});

test('skips the letter animation when motion is reduced', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto(en.path);
	await start(page);
	await page.getByRole('button', { name: en.reload }).click();

	await expect(page.locator('.task')).toHaveCSS('opacity', '1');
	await expect(page.locator('.task .character')).toHaveCount(0);
});

test('shows the keyboard focus', async ({ page }) => {
	const button = page.getByRole('button', { name: en.title });

	await page.goto(en.path);
	await page.keyboard.press('Shift');
	await button.focus();

	await expect(button).toHaveCSS('outline-style', 'solid');
});

test.describe('sharing', () => {
	test('saves the image without the Web Share API', async ({ page }) => {
		await page.addInitScript(() => {
			Reflect.deleteProperty(Navigator.prototype, 'canShare');
			Reflect.deleteProperty(Navigator.prototype, 'share');
		});
		await page.goto(en.path);
		await start(page);

		const download = page.waitForEvent('download');

		await page.getByRole('button', { name: 'Save' }).click();

		expect((await download).suggestedFilename()).toBe('truth-or-dare.png');
	});

	test('shares the image, the task and the page', async ({ page }) => {
		await page.addInitScript(() => {
			Navigator.prototype.canShare = () => true;
			Navigator.prototype.share = async (data: ShareData = {}) => {
				const files = data.files?.map(file => file.type);

				Object.assign(window, { shared: { ...data, files } });
			};
		});
		await page.goto(en.path);
		await start(page);
		await page.getByRole('button', { name: 'Share' }).click();

		const shared = await page.waitForFunction(() => Reflect.get(window, 'shared'));

		expect(await shared.jsonValue()).toEqual({
			title: en.title,
			text: await announcement(page).textContent(),
			url: page.url(),
			files: ['image/png'],
		});
	});

	test('saves the image when sharing fails', async ({ page }) => {
		await page.addInitScript(() => {
			Navigator.prototype.canShare = () => true;
			Navigator.prototype.share = () =>
				Promise.reject(new DOMException('', 'NotAllowedError'));
		});
		await page.goto(en.path);
		await start(page);

		const download = page.waitForEvent('download');

		await page.getByRole('button', { name: 'Share' }).click();

		expect((await download).suggestedFilename()).toBe('truth-or-dare.png');
	});

	test('does nothing when sharing is cancelled', async ({ page }) => {
		await page.addInitScript(() => {
			Navigator.prototype.canShare = () => true;
			Navigator.prototype.share = () => {
				Object.assign(window, { cancelled: true });

				return Promise.reject(new DOMException('', 'AbortError'));
			};
		});
		await page.goto(en.path);
		await start(page);

		let downloaded = false;

		page.on('download', () => (downloaded = true));
		await page.getByRole('button', { name: 'Share' }).click();
		await page.waitForFunction(() => Reflect.get(window, 'cancelled'));
		await page.waitForTimeout(500);

		expect(downloaded).toBe(false);
	});
});

test.describe('color scheme', () => {
	const black = 'rgb(0, 0, 0)';
	const white = 'rgb(255, 255, 255)';

	function background(page: Page) {
		return page.locator('body');
	}

	test('follows the system', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto(en.path);
		await expect(background(page)).toHaveCSS('background-color', black);

		await page.emulateMedia({ colorScheme: 'light' });
		await expect(background(page)).toHaveCSS('background-color', white);
	});

	test('remembers the chosen scheme', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await page.goto(en.path);
		await page.getByRole('button', { name: 'Dark mode' }).click();
		await expect(background(page)).toHaveCSS('background-color', black);

		await page.reload();
		await expect(background(page)).toHaveCSS('background-color', black);

		await page.getByRole('button', { name: 'Light mode' }).click();
		await expect(background(page)).toHaveCSS('background-color', white);
		expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBeNull();
	});

	test('applies the chosen scheme before the app loads', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await page.addInitScript(() => localStorage.setItem('color-scheme', 'dark'));
		await page.route('**/assets/*.js', route => route.abort());
		await page.goto(en.path);

		await expect(background(page)).toHaveCSS('background-color', black);
	});
});
