<template>
	<p class="preferences">
		<a :href="t.alternate.href" :hreflang="t.alternate.lang" :lang="t.alternate.lang">{{
			t.alternate.label
		}}</a>
		<button type="button" class="link" @click="toggleColorScheme">
			{{ colorScheme === 'dark' ? t.lightMode : t.darkMode }}
		</button>
		<slot />
	</p>
</template>

<script setup lang="ts">
import { colorScheme, toggleColorScheme } from '@/color-scheme';
import { t } from '@/i18n';
</script>
