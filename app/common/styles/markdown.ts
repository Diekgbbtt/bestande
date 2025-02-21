import {uiKit} from '../../../core/functions/ui-kit';
import {AppearanceMap} from '../../../core/functions/use-appearance';

export const markdownStyles = (appearance: AppearanceMap) => ({
	paragraph: {
		...uiKit.footnoteObject,
		fontSize: 14,
		marginTop: 4,
		marginBottom: 4,
		color: appearance.TITLE,
	},
});
