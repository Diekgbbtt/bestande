import {lighten} from 'polished';

export const colorPalette = (baseColor: string, length: number) => {
	const lightest = 0.5;
	return new Array(length).fill(1).map((a, i) => {
		return lighten((i / length) * lightest, baseColor);
	});
};
