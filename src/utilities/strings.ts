export function camelToKebabCase(camelStr: string): string {
	let kebabStr: string = '';
	for (let i = 0; i < camelStr.length; i++) {
		const char = camelStr.charAt(i);
		if (char === char.toUpperCase()) {
			kebabStr += '-' + char.toLowerCase();
		} else {
			kebabStr += char;
		}
	}
	return kebabStr.replace(/^-/, '');
}

export function camelToTitleCase(camelStr: string): string {
	let titleizedStr: string = camelStr.charAt(0).toUpperCase();
	for (let i = 1; i < camelStr.length; i++) {
		const char = camelStr.charAt(i);
		if (char === char.toUpperCase()) {
			titleizedStr += ' ' + char;
		} else {
			titleizedStr += char;
		}
	}
	return titleizedStr;
}