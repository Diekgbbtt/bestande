export const getOnlyNumberIdentifier = (identifier: string | number | null) => {
	return parseInt(String(identifier).replace(/-/g, '').replace(/,/g, ''), 10);
};
