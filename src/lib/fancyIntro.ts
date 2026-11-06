const MIN_INTRO_CHARS = 200;

/** True if the first paragraph is long enough to deserve a drop-cap / fancy first line. */
export function hasFancyIntro(html: string): boolean {
	const match = html.match(/<p[\s>][\s\S]*?<\/p>/i);
	if (!match) return false;
	const text = match[0]
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return text.length >= MIN_INTRO_CHARS;
}
