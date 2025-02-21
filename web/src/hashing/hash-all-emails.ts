import {ratingsCollection, studentsCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {DatabaseStudent} from '../db/students';
import Rating from '../models/rating';
import {hashEmail} from './hashing-functions';

export async function hashAllEmail() {
	await hashAllRatingEmails();
	await hashAllStudentEmails();
}

async function hashAllRatingEmails() {
	await connectToMongo();
	const ratings: Rating[] = await ratingsCollection().find().toArray();
	for (const rating of ratings) {
		let isRatingModified = false;
		const ratingEmail = rating.email;
		if (ratingEmail && ratingEmail.endsWith('@uzh.ch')) {
			console.log('Hashing creator-email of rating with ID: ', rating._id);
			const hashedEmail = hashEmail(ratingEmail);
			rating.email = hashedEmail;
			isRatingModified = true;
		}

		if (rating.upvotes) {
			rating.upvotes = rating?.upvotes.map((upvote) => {
				if (upvote.endsWith('@uzh.ch')) {
					console.log(
						'Hashing upvote email of rating with ID: ',
						rating._id
					);
					isRatingModified = true;
					return hashEmail(upvote);
				}
				return upvote;
			});
		}

		if (rating.downvotes) {
			rating.downvotes = rating.downvotes.map((downvote) => {
				if (downvote.endsWith('@uzh.ch')) {
					console.log(
						'Hashing downvote email of rating with ID: ',
						rating._id
					);
					isRatingModified = true;
					return hashEmail(downvote);
				}
				return downvote;
			});
		}
		if (isRatingModified) {
			await ratingsCollection().updateOne(
				{
					_id: rating._id,
				},
				{
					$set: rating,
				}
			);
		}
	}
}

async function hashAllStudentEmails() {
	await connectToMongo();
	const students: DatabaseStudent[] = await studentsCollection().find().toArray();
	for (const student of students) {
		const studentEmail = student.email;
		if (studentEmail.endsWith('@uzh.ch')) {
			const hashedEmail = hashEmail(studentEmail);
			student.email = hashedEmail;
			console.log('Hashing email of student with ID: ', student._id);
			await studentsCollection().updateOne(
				{
					_id: student._id,
				},
				{
					$set: student,
				}
			);
		}
	}
}
