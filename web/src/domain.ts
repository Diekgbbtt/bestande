export const getOwnDomain = () => {
	if (process.env.NODE_ENV === 'production') {
		const myDomain = process.env.DOMAIN;
		if (myDomain) {
			return myDomain;
		}
	}
	return 'http://localhost:3000';
};
