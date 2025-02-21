export const getCorrelationHue = (ratio: number, l: number): string => {
	const shade = 1 - ratio;
	const hue = ((1 - Math.min(1, shade)) * 120).toString(10);
	return 'hsl(' + hue + ',100%,' + l + '%)';
};

export const getPassedHue = (ratio: number): string => {
	const shade = 1 - ratio;
	const hue = ((1 - Math.min(1, shade * 2)) * 120).toString(10);
	return 'hsl(' + hue + ',100%,' + 40 + '%)';
};
