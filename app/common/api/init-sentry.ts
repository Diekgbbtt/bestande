import * as Sentry from '@sentry/react-native';

export const initializeSentry = () => {
	if (!__DEV__) {
		Sentry.init({
			dsn:
				'https://abfc2afcc8ee428499b6bd5174ba6048@o55939.ingest.sentry.io/119689',
		});
	}
};
