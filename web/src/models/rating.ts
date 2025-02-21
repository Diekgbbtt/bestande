import {Institution} from '../../../core/models/credit';
import {RatingBaseCore} from '../../../core/types/ratings';

class Rating {
	score: number;
	review: string | null;
	uni_identifier: string;
	university: Institution;
	username?: string | null;
	email?: string | null;
	upvotes?: string[];
	downvotes?: string[];
	name: string | null;
	grade: string | null;
	direction: string | null;
	_id?: string | null;
	deleting?: boolean;
	censored?: boolean;
	ups?: number;
	downs?: number;
	voteScore?: number;
	hasReview?: boolean;
	date: number;
	token?: string;
	constructor(
		data: RatingBaseCore & {
			upvotes?: string[];
			downvotes?: string[];
		}
	) {
		this.score = 0;
		this.review = data.review;
		this.university = data.university;
		this.uni_identifier = data.uni_identifier;
		this.username = data.username;
		this.email = data.email;
		this.name = null;
		this.grade = null;
		this.direction = null;
		this.upvotes = [];
		this.downvotes = [];
		this._id = null;
		Object.assign(this, data);
		const server = Boolean(data.upvotes);
		if (server) {
			Object.defineProperty(this, 'ups', {
				enumerable: true,
				get: () => (this.upvotes as string[]).length,
			});

			Object.defineProperty(this, 'downs', {
				enumerable: true,
				get: () => (this.downvotes as string[]).length,
			});

			Object.defineProperty(this, 'voteScore', {
				enumerable: true,
				get: () =>
					(this.upvotes as string[]).length -
					(this.downvotes as string[]).length,
			});

			Object.defineProperty(this, 'hasReview', {
				enumerable: true,
				get: () => Boolean(this.review),
			});
		}
	}
}

export default Rating;

