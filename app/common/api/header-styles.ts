import {AppearanceMap} from '../../../core/functions/use-appearance';

export const headerStyles = (appearance: AppearanceMap, noShadow: boolean) => {
	return {
		headerStyle: {
			backgroundColor: appearance.HEADER_BACKGROUND,
			...(noShadow
				? {
						borderBottomWidth: 0,
						shadowOpacity: 0,
						shadowColor: 'black',
						elevation: 0,
				  }
				: {}),
		},
		headerTitleStyle: {
			color: 'white',
		},
		headerBackTitle: '',
		headerBackTitleVisible: false,
		headerTintColor: 'white',
	};
};
