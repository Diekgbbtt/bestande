import type {PlatformOSType} from 'react-native';
import {Config} from '../data/Config';

let systemVersion = 1000;
let versionNumber = null;

const isNode = Boolean(process?.versions?.node);
const os = isNode ? 'web' : require('react-native').Platform.OS;

if (!isNode) {
	try {
		const DeviceInfo = require('react-native-device-info');
		versionNumber = DeviceInfo.default.getVersion();
		systemVersion = DeviceInfo.default.getSystemVersion();
	} catch (err) {
		console.log('Error with Device Info', err);
	}
}

export const VERSION_NUMBER = versionNumber;

const majorSystemVersion = parseInt(String(systemVersion), 10);

export const getDomainForOS = (_os: PlatformOSType) => {
	if (Config.IS_WEBSITE) {
		return '/api';
	}

	return _os === 'android' && majorSystemVersion < 5 && majorSystemVersion > 1
		? 'http://api.bestande.ch'
		: 'https://api.bestande.ch';
};

// Dev mode :http://localhost:3000/api
// Prod https://api.bestande.ch
// 'http://api.bestande.ch'
export const DOMAIN = getDomainForOS(os);

export const getWsDomainForOS = (_os: PlatformOSType) => {
	return Config.IS_WEBSITE ? '/' : getDomainForOS(_os);
};

export const WS_DOMAIN = getWsDomainForOS(os);
