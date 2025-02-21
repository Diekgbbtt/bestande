import {Router} from 'express';
import flattenDeep from 'lodash/flattenDeep';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';
import Module from '../../../core/models/module';
import {RawRelatedModule} from '../../../core/models/raw-related-module';
import {moduleCollection} from '../db/collections';
import {asyncHandler} from '../handlers';
import {minimumFields} from '../helpers/module-preview-minimum-fields';

const router = Router();

router.post(
	'/',
	asyncHandler<
		{
			body: {modules: {uni_identifier: string}[]};
		},
		{
			module: Module | undefined;
			count: number;
			correlated: {
				count: number | undefined;
				totalCount: number | null;
				related: Partial<Module>;
			} | null;
		}[]
	>(async (request, response) => {
		const {institution} = response.locals;
		const {modules} = request.body;
		const modulesInDb: Module[] = await moduleCollection()
			.find({
				university: institution,
				uni_identifier: {
					$in: modules.map((m) => m.uni_identifier),
				},
			})
			.toArray();
		const relatedNext = flattenDeep<RawRelatedModule>(
			modulesInDb.map((m) => {
				if (!m || !m.related || !m.related.next) {
					return [];
				}

				return m.related.next;
			})
		);
		let items: RawRelatedModule[] = [];
		for (const item of relatedNext) {
			const index = items.findIndex((i) => i.module === item.module);
			if (index > -1) {
				items[index].count += item.count;
			} else {
				items.push({...item});
			}
		}

		items = items.slice(0, 20);

		const itemsFetched = await moduleCollection()
			.find(
				{
					uni_identifier: {
						$in: items.map((i) => i.module),
					},
					university: institution,
				},
				{projection: minimumFields}
			)
			.toArray();

		return sortBy(
			items
				.map((item) => {
					const correlated = modulesInDb
						.filter((m) => {
							if (!m || !m.related || !m.related.next) {
								return false;
							}

							return true;
						})
						.map((m) => ({
							related: m.uni_identifier,
							userCount: m.userCount,
							next: m.related?.next.find((a) => a.module === item.module),
						}));
					const mostCorrelated = sortBy(
						correlated.filter((c) => c.next),
						(n) => 0 - (n.next?.count || 0)
					)[0];
					return {
						module: itemsFetched.find((m) => m.uni_identifier === item.module),
						count: item.count,
						correlated: mostCorrelated
							? {
								count: mostCorrelated.next?.count,
								totalCount: mostCorrelated.userCount
									? mostCorrelated.userCount.all
									: null,
								related: pick(
									modulesInDb.find(
										(m) => m.uni_identifier === mostCorrelated.related
									),
									Object.keys(minimumFields)
								),
							  }
							: null,
					};
				})
				.filter((m) => m.module),
			(i) => 0 - i.count
		);
	})
);

export default router;
