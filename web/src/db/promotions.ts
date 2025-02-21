import {CLICK, CTA, VIEW} from '../../../core/models/impression-level';
import {PROMOTION} from '../../../core/models/impression-type';
import {impressionsCollection} from './collections';
import {connectToMongo} from './modern';

export const getDbPromotionStats = async (content_id: string) => {
	await connectToMongo();
	return Promise.all(
		[VIEW, CLICK, CTA].map((level: 'CTA' | 'CLICK' | 'CTA') => {
			return impressionsCollection().countDocuments({
				content: PROMOTION,
				content_id,
				level,
			});
		})
	);
};

export const getDbPromotionPlatforms = async (content_id: string) => {
	await connectToMongo();

	return impressionsCollection()
		.aggregate([
			{$match: {platform: {$exists: true}, content_id, content: PROMOTION}},
			{$unwind: '$platform'},
			{$group: {_id: '$platform', users: {$addToSet: '$identifier'}}},
			{$project: {platform: 1, count: {$size: '$users'}}},
		])
		.toArray();
};

export const getDbPromotionLanguages = async (content_id: string) => {
	await connectToMongo();

	return impressionsCollection()
		.aggregate([
			{$match: {language: {$exists: true}, content_id, content: PROMOTION}},
			{$unwind: '$language'},
			{$group: {_id: '$language', users: {$addToSet: '$identifier'}}},
			{$project: {language: 1, count: {$size: '$users'}}},
		])
		.toArray();
};

export const getDbInstitutions = async (content_id: string) => {
	await connectToMongo();

	return impressionsCollection()
		.aggregate([
			{$match: {institution: {$exists: true}, content_id, content: PROMOTION}},
			{$unwind: '$institution'},
			{$group: {_id: '$institution', users: {$addToSet: '$identifier'}}},
			{$project: {institution: 1, count: {$size: '$users'}}},
		])
		.toArray();
};
