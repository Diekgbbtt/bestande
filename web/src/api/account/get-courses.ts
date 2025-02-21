import createHttpError from 'http-errors';
import groupBy from 'lodash/groupBy';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import {truthy} from '../../../../core/functions/truthy';
import {GetCoursesResponse, Institution} from '../../../../core/models/credit';
import {
	moduleCollection,
	moduleCollectionCollection,
	userCollection,
} from '../../db/collections';
import {asyncHandler} from '../../handlers';

export const getCourses = asyncHandler<{}, GetCoursesResponse>(async (req) => {
	const token = req.get('x-bestande-token');
	if (!token) {
		throw createHttpError(401, 'Unauthenticated');
	}

	const user = await userCollection().findOne({
		token,
	});
	const courses = await moduleCollectionCollection()
		.find({
			user: user?.token,
		})
		.toArray();
	const coursesByUniversity = groupBy(courses, (c) => c.university);
	const modules = (
		await Promise.all(
			Object.keys(coursesByUniversity).map((u: Institution) => {
				return moduleCollection()
					.find(
						{
							university: u,
							uni_identifier: {
								$in: coursesByUniversity[u].map((c) => c.uni_identifier),
							},
						},
						{
							projection: {
								name: 1,
								uni_identifier: 1,
								university: 1,
								short_name: 1,
								'semesters.credits': 1,
								'semesters.period': 1,
							},
						}
					)
					.toArray();
			})
		)
	).flat(1);
	return {
		nonce: user?.moduleCollectionNonce ?? 0,
		courses: courses
			.map((c) => {
				const mod = modules.find(
					(m) =>
						m.uni_identifier === c.uni_identifier &&
						m.university === c.university
				);
				if (!mod) {
					return null;
				}

				const sortedSemesters = sortBy(mod.semesters, (s) => s.period);
				const latestSemester = last(sortedSemesters);
				const matchedSemester = sortedSemesters.find(
					(s) => s.period === latestSemester?.period
				);
				const credits = (matchedSemester ?? latestSemester)?.credits as number;
				return {
					created: c.created,
					period: c.period,
					uni_identifier: c.uni_identifier,
					university: c.university,
					grade: c.grade,
					short_name: mod.short_name as string,
					name: mod.name as string,
					credits,
				};
			})
			.filter(truthy),
	};
});
