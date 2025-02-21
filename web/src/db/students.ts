import {v4 as uuid} from 'uuid';
import {studentsCollection} from './collections';

export interface DatabaseStudent {
	_id: string;
	email: string;
	username: string;
}

export const getStudent = async (
	hashedEmail: string
): Promise<DatabaseStudent | null> => {
	confirmEmailIsHashed(hashedEmail);
	try {
		return await studentsCollection().findOne({email: hashedEmail});
	} catch (e) {
		console.log(e);
		throw new Error('Error getting user');
	}
};

export const updateUsername = async (
	hashedEmail: string,
	username: string
): Promise<DatabaseStudent | null> => {
	confirmEmailIsHashed(hashedEmail);
	try {
		await studentsCollection().updateOne(
			{email: hashedEmail},
			{$set: {username}}
		);
		return getStudent(hashedEmail);
	} catch (e) {
		console.log(e);
		throw new Error('Error updating username');
	}
};

export const addStudent = async (
	hashedEmail: string,
	username: string
): Promise<DatabaseStudent> => {
	confirmEmailIsHashed(hashedEmail);
	try {
		const _id = uuid();
		await studentsCollection().insertOne({email: hashedEmail, username, _id});
		return {_id, email: hashedEmail, username};
	} catch (e) {
		console.log(e);
		throw new Error('Error adding user');
	}
};

export const deleteStudent = async (hashedEmail: string): Promise<undefined> => {
	confirmEmailIsHashed(hashedEmail);
	try {
		await studentsCollection().deleteOne({email: hashedEmail});
	} catch (e) {
		console.log(e);
		throw new Error('Error deleting user');
	}
};

const confirmEmailIsHashed = (email: string) => {
	if (typeof email !== 'string') {
		throw new Error('Email is not a string');
	}
	if (email.endsWith('@uzh.ch')) {
		throw new Error('Email is not hashed');
	}
};

