import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, withRouter} from 'react-router-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import reduxCatch from 'redux-catch';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import 'regenerator-runtime/runtime.js';
import {ThemeProvider} from 'styled-components/native';
import {useAppearance} from '../../../core/functions/use-appearance';
import {WebState} from '../../../core/types/web-state';
import webReducer from '../reducers';
import {webSaga} from '../saga';
import Inner from './inner';
import AndroidDownloadBanner from './banners/app-download-banner';
import {initializeOneSignal} from './push-notifications/push-notifications';
import PushNotificationBanner from './banners/push-notification-banner';
import AppDownloadBanner from './banners/app-download-banner';
import ErrorSuccessBanner from './banners/error-success-banner';
import {AuthProvider} from 'react-oidc-context';
import {WebStorageStateStore} from 'oidc-client-ts';

const sagaMiddleware = createSagaMiddleware<WebState>();

const errorHandler = (err) => {
	console.error(err);
};

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION__?: () => any;
		initialState?: WebState;
	}
}

const store = createStore(
	webReducer,
	window.initialState,
	compose(
		applyMiddleware(thunk, reduxCatch(errorHandler), sagaMiddleware),
		window.__REDUX_DEVTOOLS_EXTENSION__
			? window.__REDUX_DEVTOOLS_EXTENSION__()
			: (f) => f
	)
);

const oidcConfig = {
	authority: 'https://login.eduid.ch/',
	client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
	redirect_uri: process.env.REACT_APP_OIDC_REDIRECT_URI,
	scope: 'openid profile email https://login.eduid.ch/authz/User.Read',
	userStore: new WebStorageStateStore({
		store: localStorage,
	}),
	// metadata: {
	//     issuer: "https://login.eduid.ch/",
	//     authorization_endpoint: "https://login.eduid.ch/idp/profile/oidc/authorize",
	//     userinfo_endpoint: "https://login.eduid.ch/idp/profile/oidc/userinfo",
	//     token_endpoint: "https://login.eduid.ch/idp/profile/oidc/token",
	// }
};

sagaMiddleware.run(webSaga);

const InnerConnected = withRouter(Inner);

initializeOneSignal();

const WithoutProvider = () => {
	const appearanceMap = useAppearance();
	return (
		<ThemeProvider
			theme={{
				promotedEventHeight: 0,
				...appearanceMap,
			}}
		>
			<SafeAreaProvider>
				{/* <MensaAllergensModal /> */}
				{/* <MensaDietModal /> */}
				{/* <MensaPriceModal /> */}
				{/* <MensaCategoriesModal /> */}
				<Router>
					<AppDownloadBanner />
					<PushNotificationBanner />
					<ErrorSuccessBanner />
					<InnerConnected />
				</Router>
			</SafeAreaProvider>
		</ThemeProvider>
	);
};

export const App = () => {
	return (
		<>
			<AuthProvider {...oidcConfig}>
				<Provider store={store}>
					<WithoutProvider />
				</Provider>
			</AuthProvider>
		</>
	);
};
