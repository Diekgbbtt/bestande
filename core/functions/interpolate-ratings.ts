import {truthy} from './truthy';

export const interpolateRating = ({
	averageRating,
	totalRatings,
	ratingToAdd = null,
	ratingToRemove = null,
}: {
	averageRating: number;
	totalRatings: number;
	ratingToAdd: number | null;
	ratingToRemove: number | null;
}): number | null => {
	const ratingArray: number[] = new Array(totalRatings).fill(averageRating);
	const ratingsAdded = [...ratingArray, ratingToAdd].filter(truthy);
	let amount = ratingsAdded.length;
	if (ratingToRemove) {
		amount--;
	}

	let total = ratingsAdded.reduce((a, b) => a + b, 0);
	if (ratingToRemove) {
		total -= ratingToRemove;
	}

	if (amount === 0) {
		return null;
	}

	return total / amount;
};
