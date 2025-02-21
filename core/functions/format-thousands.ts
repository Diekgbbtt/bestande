export function thousands(num: number | string, separator: string): string {
	if (!num) {
		return '0';
	}

	const parts = (String(num || num === 0 ? num : '')).split('.');

	if (parts.length) {
		parts[0] = parts[0].replace(
			/(\d)(?=(\d{3})+\b)/g,
			'$1' + (separator || ',')
		);
	}

	return parts.join('.');
}
