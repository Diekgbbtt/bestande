import {Institution} from '../../../../core/models/credit';

export interface CreateRatingDto {
	score: number;
	review: string;
	uni_identifier: string;
	university: Institution;
}
