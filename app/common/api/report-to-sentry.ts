import * as Sentry from '@sentry/react-native';

export const reportToSentry = (err: Error) => {
	Sentry.captureException(err);
};
