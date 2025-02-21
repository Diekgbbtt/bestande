import createError from 'http-errors';
import uniq from 'lodash/uniq';
import {Db, MongoClient} from 'mongodb';
import {Institution} from '../../../core/models/credit';
import Module from '../../../core/models/module';
import {ApiResponse} from '../../../core/reducers/api';

let client: Db | null = null;

export const connect = async (_client: MongoClient) => {
	client = _client.db();
};

const moduleCollection = (connection: Db) =>
	connection.collection<ApiResponse>('modules');

const queryModuleByGuess = async (
	university: Institution,
	slugOrId: string
) => {
	if (/\w*[a-zA-Z-]\w*/i.exec(slugOrId)) {
		const result = await moduleCollection(client as Db).findOne({
			university,
			slug: slugOrId.toLowerCase(),
		});

		if (result) {
			return result;
		}
	}

	return moduleCollection(client as Db).findOne({
		university,
		uni_identifier: slugOrId,
	});
};

export const getByGuess = async (
	university: Institution,
	slugOrId: string
): Promise<Module | null> => {
	const result = await queryModuleByGuess(university, slugOrId);
	if (!result) {
		return null;
	}

	return new Module(result);
};

export const moduleAddSlug = async (
	mod: Module,
	slug: string
): Promise<Module> => {
	if (!/^([a-z0-9-]+)$/.test(slug)) {
		throw createError(
			400,
			'Slug can only contain lowercase characters, numbers and dashes.'
		);
	}

	const slugExists = await moduleCollection(client as Db).findOne({
		slug,
		university: mod.university,
	});
	if (slugExists) {
		throw createError(
			409,
			'Slug already belongs to another module of this university'
		);
	}

	if (!mod.slug) {
		mod.slug = [];
	}

	mod.slug.push(slug);
	mod.slug = uniq(mod.slug);
	await moduleCollection(client as Db).update(
		{uni_identifier: mod.uni_identifier as string, university: mod.university},
		// @ts-expect-error
		{...mod}
	);
	return new Module(mod);
};
