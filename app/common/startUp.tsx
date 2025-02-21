import {LogBox} from 'react-native';
import {FirstInstallBrandmark} from './api/FirstInstallBrandmark';

LogBox.ignoreLogs([
	'Warning: Failed prop type: Invalid prop `rightText`',
	'componentWillUpdate',
	'componentWillMount',
	'componentWillReceiveProps',
	'`-[RCTRootView cancelTouches]`',
	'Non-serializable values were found in the navigation state',
]);

// ts-unused-exports:disable-next-line
export const startUp = async function () {
	FirstInstallBrandmark.setIfNot();
};
