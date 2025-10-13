<script lang="ts">
	type Issue = { href?: string; label: string };

	let issues: Issue[] = [
		{
			href: 'https://drive.google.com/drive/folders/1OAAxCE5PoewjhNHo2bBUyPz1E-slCheg?usp=sharing',
			label: 'All'
		},
		{
			href: 'https://drive.google.com/drive/folders/1b4a1Xx_aorMT36VL0pUsxCK8LGB4GPfJ',
			label: 'V19: 2025-2026'
		},
		{
			href: 'https://drive.google.com/drive/folders/1d9CgeRF-29cpkPj0UWDldiFfahNWplzu',
			label: 'V18: 2024-2025'
		},
		{
			href: 'https://drive.google.com/drive/folders/1eqbcpAVWtB8FUC1dHlSNO_IQ4y11RJPU',
			label: 'V17: 2023-2024'
		},
		{
			href: 'https://drive.google.com/drive/folders/1jOjAr6JwbWkIW4-ADW7dhXuJnBHiRK0Q?usp=share_link',
			label: 'V16: 2022-23'
		},
		{
			href: '/school-year/21-22',
			label: 'V15: 2021-22 (Online only)'
		},
		{
			href: '/school-year/20-21',
			label: 'V14: 2020-21 (Online only)'
		},
		{
			href: 'https://drive.google.com/drive/folders/1Z98rL-Wew48JcPb-Vo19MYFpnDCBrSGE?usp=share_link',
			label: 'V13 2019-20'
		},
		{
			href: 'https://drive.google.com/drive/folders/1Mq04Uh2tq0GxuB8NNs7sGu0dQuQ1qLCj?usp=share_link',
			label: 'V12 2018-19'
		},
		{
			href: 'https://drive.google.com/drive/folders/1PDgK4Mi3Tjc9IFSL7ZHGzHsOMZUd-kRr?usp=share_link',
			label: 'V11 2017-18'
		},
		{
			href: 'https://drive.google.com/drive/folders/1BPdXyYVXI9LrwjPkobj0fgzEeOs4KLdh?usp=share_link',
			label: 'V10 2016-17'
		},
		{
			href: 'https://drive.google.com/drive/folders/1jHVYIgJbbkn2P0kL58WuM1rRUtSMtCdg?usp=share_link',
			label: 'V09 2015-16'
		},
		{
			href: 'https://drive.google.com/drive/folders/12zC7ArGxAcS8J1n8HNoUiyv689ZuqCKc?usp=share_link',
			label: 'V08 2014-15'
		},
		{
			href: 'https://drive.google.com/drive/folders/1icRVmXKP3eb54Np4fMqD8U7vWPmAqC5r?usp=share_link',
			label: 'V07 2013-14'
		},
		{
			href: 'https://drive.google.com/drive/folders/1LDZKGN8Zg0doOWu03I-n5AijpkbfWjlE?usp=share_link',
			label: 'V06 2012-13'
		},
		{ href: 'https://drive.google.com/open?id=0BysJP8Am5UC3SjFNcGxjd0FyV3M', label: 'V05 2011-12' },
		{
			href: 'https://drive.google.com/drive/folders/1z-mykZBBvHPVmTSHYo3bVHdWEpoIruJe?usp=share_link',
			label: 'V04 2010-11'
		},
		{
			href: 'https://drive.google.com/drive/folders/1bTYSxx-3QJHJWRq8PZUTpOGqAsO8lhRW?usp=share_link',
			label: 'V03 2009-10'
		},
		{
			href: 'https://drive.google.com/drive/folders/1Qzef-JwATjz3AhvbG75diUpBDfHMy1VQ?usp=sharing',
			label: 'V02 2008-09'
		},
		{
			href: 'https://drive.google.com/drive/folders/1UvYtAM-m9_bjbLz8nF7kly9vVx3UUar0?usp=sharing',
			label: 'V01 2007-08'
		}
	];
</script>

<div>
	<h2 class="widget-title">Past Issue PDFs</h2>
	{#each issues as issue}
		{#if issue.href}
			<a href={issue.href}>{issue.label}</a>
		{:else}
			<span>{issue.label}</span>
		{/if}
		<br />
	{/each}
</div>

<style>
	a {
		text-decoration: none;
		color: inherit;
	}
	a:hover {
		text-decoration: underline;
	}
</style>
