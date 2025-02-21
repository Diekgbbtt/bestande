import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fs from 'fs';
import mockery from 'mockery';
import {join} from 'path';

require('@jonny/react-native-mock/mock');

process.env.BABEL_ENV = 'development';

configure({adapter: new Adapter()});

global.fetch = require('node-fetch');

mockery.enable({
	warnOnUnregistered: false,
});

mockery.registerMock('react-native-userdefaults-ios', {
	stringForKey: () => Promise.resolve(),
	setStringForKey: () => Promise.resolve(),
	objectForKey: () => Promise.resolve(),
	boolForKey: () => Promise.resolve(),
});

mockery.registerMock('react-native-hyperlink', (props) => props.children);
mockery.registerMock(
	'@jonny/react-native-highlight-words',
	(props) => props.children
);
mockery.registerMock('react-native-modal', (props) => props.children);
mockery.registerMock('react-native-localize', {
	getLocales: () => [{languageCode: 'de'}],
});
mockery.registerMock('react-native-maps', (props) => props.children);
mockery.registerMock('react-native-device-info', {
	getBundleId: () => 'jonnyburger.bestande',
	getSystemVersion: () => '8.0.0',
	getVersion: () => '8.0.0',
	getUniqueId: () => 'gdfksgjsfldkgdjhs',
	default: {
		getBundleId: () => 'jonnyburger.bestande',
		getSystemVersion: () => '8.0.0',
		getVersion: () => '8.0.0',
	},
});
mockery.registerMock('react-native-flip-card', (props) => props.children);
mockery.registerMock('react-native-linear-gradient', (props) => props.children);
mockery.registerMock('@sentry/react-native', {
	config: () => ({
		install: () => null,
	}),
});
mockery.registerMock('react-native-dark-mode', {
	initialMode: 'light',
});

// Mock all images
const assets = fs.readdirSync(join(__dirname, '../common/assets'));
for (const asset of assets) {
	mockery.registerMock(`../assets/${asset}`, null);
}

// @ts-expect-error
global.__DEV__ = true;

// @ts-expect-error
process.env.TEST = true;
