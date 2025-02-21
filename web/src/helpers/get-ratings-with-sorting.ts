import max from 'lodash/max';
import min from 'lodash/min';
import sortBy from 'lodash/sortBy';
import {RatingSortOption} from '../../../core/types/ratings';
import {ratingsCollection} from '../db/collections';
import Rating from '../models/rating';

function hot({
	ups,
	downs,
	date,
	highestDate,
	lowestDate,
	highestScore,
	lowestScore,
	hasReview,
}: {
	ups: number;
	downs: number;
	date: number;
	highestDate: number;
	lowestDate: number;
	highestScore: number;
	lowestScore: number;
	hasReview: boolean;
}) {
	const score = ups - downs;
	const scoreScore = (score - lowestScore) / (highestScore - lowestScore);
	const dateScore = (date - lowestDate) / (highestDate - lowestDate);
	return scoreScore + dateScore * 1.5 - (hasReview ? 0 : 1000);
}

export const getRatingsWithSorting = async (
	query: any,
	sort: RatingSortOption,
	offset: number
): Promise<Rating[]> => {
	query.review = {$ne: ""};
	query.review = {$ne : null};
	if (sort === 'best') {
		const results = await ratingsCollection().find(query).toArray();
		if (results.length === 0) {
			return [];
		}

		const highestScore = max(
			results.map((s) => (s.ups ?? 0) - (s.downs ?? 0))
		) as number;
		const lowestScore = min(
			results.map((s) => (s.ups ?? 0) - (s.downs ?? 0))
		) as number;
		const highestDate = max(results.map((s) => s.date)) as number;
		const lowestDate = min(results.map((s) => s.date)) as number;
		const sorted = sortBy(results, (r) =>
			hot({
				ups: r.ups ?? 0,
				downs: r.downs ?? 0,
				date: r.date,
				highestDate,
				highestScore,
				lowestDate,
				lowestScore,
				hasReview: Boolean(r.review),
			})
		);
		return sorted
			.slice()
			.reverse()
			.slice(offset, offset + 15);
	}

	const sortQuery =
		sort === 'top'
			? {hasReview: -1, voteScore: -1, _id: -1}
			: sort === 'newest'
			? {
					hasReview: -1,
					_id: -1,
			  }
			: sort === 'oldest'
			? {
					hasReview: -1,
					_id: 1,
			  }
			: {};
	
	const ratings = await ratingsCollection()
		.find(query)
		.sort(sortQuery)
		.skip(offset)
		.limit(15)
		.toArray();
	
	return ratings;
};
