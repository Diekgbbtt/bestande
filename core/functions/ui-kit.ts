import {Platform, StyleSheet} from 'react-native';
import {systemWeights} from '../data/systemWeights';
import {human} from './human';

const suffixProperties = (object, suffix) =>
	Object.keys(object).reduce(
		(acc, key) => ({...acc, [`${key}${suffix}`]: object[key]}),
		{}
	);
// Extracted from the sketch file
// https://developer.apple.com/design/resources/
// These are the textStyles that fall under the category of iOS UIKit

const getStylesForColor = (color) => {
	const colorSuffix = color === 'white' ? 'White' : '';
	return {
		largeTitleEmphasized: {
			...human[`largeTitle${colorSuffix}Object`],
			...systemWeights.bold,
			letterSpacing: Platform.OS === 'ios' ? 0.41 : undefined,
		},
		title3: human[`title3${colorSuffix}Object`],
		title3Emphasized: {
			...human[`title3${colorSuffix}Object`],
			...systemWeights.semibold,
			letterSpacing: Platform.OS === 'ios' ? 0.75 : undefined,
		},
		body: human[`body${colorSuffix}Object`],
		bodyEmphasized: {
			...human[`body${colorSuffix}Object`],
			...systemWeights.semibold,
			letterSpacing: Platform.OS === 'ios' ? -0.41 : undefined,
		},
		subhead: human[`subhead${colorSuffix}Object`],
		subheadShort: {
			...human[`subhead${colorSuffix}Object`],
			lineHeight: 18,
		},
		subheadEmphasized: {
			...human[`subhead${colorSuffix}Object`],
			...systemWeights.semibold,
			letterSpacing: Platform.OS === 'ios' ? -0.24 : undefined,
		},
		callout: human[`callout${colorSuffix}Object`],
		footnote: human[`footnote${colorSuffix}Object`],
		footnoteEmphasized: {
			...human[`footnote${colorSuffix}Object`],
			...systemWeights.semibold,
			letterSpacing: Platform.OS === 'ios' ? -0.08 : undefined,
		},
		caption2: human[`caption2${colorSuffix}Object`],
		caption2Emphasized: {
			...human[`caption2${colorSuffix}Object`],
			...systemWeights.semibold,
			letterSpacing: Platform.OS === 'ios' ? 0.06 : undefined,
		},
	};
};

const create = (object: any) => ({
	...suffixProperties(object, 'Object'),
	...StyleSheet.create(object),
});

export const uiKit = create({
	...getStylesForColor('black'),
	...suffixProperties(getStylesForColor('white'), 'White'),
});
