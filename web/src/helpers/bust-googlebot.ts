import createHttpError from 'http-errors';

export const bustGooglebot = (ip: string) => {
	// Bust Googlebot
	if (ip?.startsWith('108.177') || ip?.startsWith('66.102')) {
		throw createHttpError(
			400,
			'You have been identified as Googlebot and are not allowed to upload pictures'
		);
	}
};
