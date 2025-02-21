import express, {CookieOptions} from 'express';
import {asyncHandler} from '../../handlers';
import {
	getEmailFromRequest,
	getEmailFromExternalSource,
	getJwtSecretKey,
} from '../../firebase-backend';
import {
	DatabaseStudent,
	addStudent,
	getStudent,
	updateUsername,
} from '../../db/students';
import {StudentDto} from '../dto/student.dto';
import {ratingsCollection} from '../../db/collections';
import {hashEmail} from '../../hashing/hashing-functions';
import {sign} from 'jsonwebtoken';

const router = express.Router();

router.put(
	'/',
	asyncHandler<{body: {username: string}}, StudentDto>(async (request) => {
		const email = await getEmailFromRequest(request);
		const hashedEmail = hashEmail(email);

		const {username} = request.body;

		const user: DatabaseStudent | null = await updateUsername(
			hashedEmail,
			username
		);
		if (!user) {
			throw new Error('Error updating username');
		}
		await ratingsCollection().updateMany(
			{email: hashedEmail},
			{$set: {username: username}}
		);
		const studentDto: StudentDto = {username: user.username, email: email};
		return studentDto;
	})
);

router.get(
	'/',
	asyncHandler<{}, StudentDto>(async (request, response) => {
		const email = await getEmailFromRequest(request);
		const hashedEmail = hashEmail(email);

		let user: DatabaseStudent | null = await getStudent(hashedEmail);
		if (!user) {
			const username = 'Guest ' + Math.floor(Math.random() * 10000);
			user = await addStudent(hashedEmail, username);
			if (!user) {
				throw new Error('Error creating user');
			}
		}
		const student: StudentDto = {username: user.username, email: email};
		return student;
	})
);

interface StudentEmail {
	email: string;
}

router.post(
	'/',
	asyncHandler<{}, StudentEmail>(async (request, response) => {
		const email = await getEmailFromRequest(request);
		const hashedEmail = hashEmail(email);

		const fetchedUser = await getStudent(hashedEmail);
		if (fetchedUser) {
			return {email: email};
		}
		await addStudent(hashedEmail, 'Guest ' + Math.floor(Math.random() * 10000));
		const student: StudentEmail = {email: email};
		return student;
	})
);

// milliseconds * seconds * minutes * hours * days
const jwtAccessDuration = 1000 * 60 * 60 * 24 * 30; // 30 days

export interface CustomJwtPayload {
	iss: string;
	email: string;
}

export interface AccessTokenResponse {
	accessTokenValidUntil: number;
}

router.post(
	'/accessToken',
	asyncHandler<{}, AccessTokenResponse>(async (request, response) => {
		const email = await getEmailFromExternalSource(request);

		const JWT_SECRET_KEY = getJwtSecretKey();

		const expiryDate = Date.now() + jwtAccessDuration;

		const payload: CustomJwtPayload = {
			// This is not really necessary -> we only really need the email from the token
			iss: 'bestande.ch',
			email: email,
		};

		const createdToken = sign(payload, JWT_SECRET_KEY, {
			algorithm: 'HS256',
			// expiresIn expects seconds, not milliseconds
			expiresIn: jwtAccessDuration / 1000,
		});

		const cookieOptions: CookieOptions = {
			// So it cannot be accessed in the Frontend by JavaScript
			httpOnly: true,
			// So it cannot be sent to any other domain other than bestande.ch
			sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',
			// So it can only be sent over HTTPS (and not unencrypted HTTP)
			secure: true,
			// So it expires after 30 days and is stored in the browser even when it is closed and reopened
			expires: new Date(expiryDate),
		};

		response.cookie('accessToken', createdToken, cookieOptions);

		return {accessTokenValidUntil: expiryDate};
	})
);

router.post(
	'/removeAccessToken',
	asyncHandler<{}, void>(async (request, response) => {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',
			secure: true,
			expires: new Date(0),
		};
		response.clearCookie('accessToken', cookieOptions);
	})
);

export default router;
