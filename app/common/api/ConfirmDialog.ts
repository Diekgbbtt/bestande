import {Alert} from 'react-native-normalized';
import {AppLanguage} from '../../../core/models/app-language';
import rawStrings from '../../../core/raw-strings';

export const confirmDialog = function (
	title: string,
	message: string,
	{
		style,
		noLabel,
		yesLabel,
	}: {
		style?: 'default' | 'cancel' | 'destructive' | undefined;
		noLabel?: string;
		yesLabel?: string;
	} = {},
	language: AppLanguage
) {
	return new Promise<void>((resolve, reject) => {
		Alert.alert(title, message, [
			{
				text: noLabel || rawStrings.NO[language],
				onPress: () => reject(new Error('denied')),
			},
			{
				text: yesLabel || rawStrings.YES[language],
				onPress: () => resolve(),
				style: style || 'default',
			},
		]);
	});
};
