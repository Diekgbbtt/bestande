import memoize from 'lodash/memoize';
import {Credit, CustomModule} from '../models/credit';
import {ModulePreview} from '../models/module';
import {ApiResponse} from '../reducers/api';

export const getModuleId = memoize(
	(
		credit: Credit | CustomModule | ModulePreview | ApiResponse
	): string | null => {
		if (!credit) {
			return null;
		}

		if ('custom' in credit) {
			// @ts-expect-error
			return credit._id;
		}

		if (credit.uni_identifier) {
			return credit.uni_identifier;
		}

		credit = credit as Credit;
		if (!credit.link || typeof credit.link !== 'string') {
			return null;
		}

		const match = /\/details\/([0-9]{4})\/(003|004)\/(SM|CW)\/([0-9]+)/.exec(
			credit.link
		);
		if (match) {
			return match[4];
		}

		const lastMatch = /[sm|e|cw]-([0-9A-Z-]+)\./.exec(credit.link);
		if (!lastMatch) {
			throw new Error('Could not get module id');
		}

		return lastMatch[1];
	}
);
