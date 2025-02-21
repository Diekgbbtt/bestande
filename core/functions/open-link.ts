import {Linking, Platform} from 'react-native';
import {Colors} from './Colors';

let openInSafari: any;
if (Platform.OS === 'ios') {
	openInSafari = require('react-native-safari-view').default;
}

export const openLink = (url: string) => {
	const normalizedUrl =
		url.startsWith('http://') || url.startsWith('https://')
			? url
			: `https://${url}`;
	if (Platform.OS === 'ios') {
		openInSafari.show({
			url: encodeURI(normalizedUrl),
			tintColor: Colors.Green,
		});
	} else if (Platform.OS === 'web') {
		window.open(normalizedUrl, '_blank');
	} else {
		return Linking.openURL(normalizedUrl);
	}
};
