import crypto from 'crypto';
require('dotenv').config();

function getSecretKey(): string {
	const secretKey: string | undefined = process.env.SECRET_KEY;
	if (!secretKey) {
		const errorMessage =
			'SECRET_KEY for email hashing is not set\n set it in the .env file as SECRET_KEY=your-secret-key';
		console.error(errorMessage);
		throw new Error(errorMessage);
	}
	return secretKey;
}

export function hashEmail(email: string): string {
	const lowerCaseEmail = email.toLowerCase();
	return crypto
		.createHmac('sha256', getSecretKey())
		.update(lowerCaseEmail)
		.digest('hex');
}
