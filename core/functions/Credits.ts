import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';
import {Credit} from '../models/credit';
import {AppState} from '../types/app-state';
import {CreditHelpers} from './CreditHelpers';
import {getCreditsFromSummary, mapCollectionToCredit} from './get-credit';
import {getModuleId} from './get-module-id';
import {getUniqueIdentifier} from './get-unique-identifier';

export const getVisibleCredits = createSelector(
	[
		(state: AppState) => state.moduleCollection,
		(state: AppState) => state.multiSummary[state.institution.institution],
		(state: AppState) => state.creditOverrides,
		(state: AppState) => state.customCredits.credits,
	],
	(moduleCollection, summary, creditOverrides, customCredits): Credit[] => {
		const moduleCredits = moduleCollection.map((coll) => {
			const credit = mapCollectionToCredit(coll);
			return {
				...credit,
				...creditOverrides[getUniqueIdentifier(credit)],
			};
		});
		const summaryCredits = summary
			? getCreditsFromSummary(summary, creditOverrides)
			: [];
		const all = uniqBy([...summaryCredits, ...moduleCredits], (m) => {
			const moduleId = getModuleId(m);
			return (
				String(m.institution) +
				moduleId +
				CreditHelpers.getSemester(m) +
				(moduleId ? '' : m.name) +
				(moduleId ? '' : m.module)
			);
		});
		const overridenCustomCredits = customCredits.map((c) => {
			return {...c, ...creditOverrides[getUniqueIdentifier(c)]};
		});
		return [
			...all.filter((b) => b.status !== 'DESELECTED'),
			...overridenCustomCredits,
		];
	}
);
