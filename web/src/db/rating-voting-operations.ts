import {ratingsCollection} from './collections';

export async function removeVoteFromDownvotes(ratingId: string, email: string) {
	await ratingsCollection().updateOne(
		{_id: ratingId},
		{$pull: {downvotes: email}}
	);
}

export async function removeVoteFromUpvotes(ratingId: string, email: string) {
	await ratingsCollection().updateOne({_id: ratingId}, {$pull: {upvotes: email}});
}

export async function addVoteToUpvotes(ratingId: string, email: string) {
	await ratingsCollection().updateOne(
		{_id: ratingId},
		{
			$addToSet: {upvotes: email},
			$pull: {downvotes: email},
		}
	);
}

export async function addVoteToDownvotes(ratingId: string, email: string) {
	await ratingsCollection().updateOne(
		{_id: ratingId},
		{
			$addToSet: {downvotes: email},
			$pull: {upvotes: email},
		}
	);
}
