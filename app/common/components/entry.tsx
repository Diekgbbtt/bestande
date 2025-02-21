'use strict';
import React from 'react';
import {AppRegistry, Platform} from 'react-native';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from '../../../core/reducers/store';
import {initializeSentry} from '../api/init-sentry';
import {startUp} from '../startUp';
import {Main} from './Main';

initializeSentry();

const TabBar = () => {
	return (
		<Provider store={store}>
			<Main />
		</Provider>
	);
};

AppRegistry.registerComponent('BestandeReact', () => TabBar);
if (Platform.OS === 'web') {
	AppRegistry.runApplication('BestandeReact', {
		rootTag: document.getElementById('root'),
	});
}

startUp()
	.then(() => {
		// noop
	})
	.catch((err) => {
		console.log('Could not start up', err);
	});
