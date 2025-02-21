import memoize from 'lodash/memoize';
import {createSelector} from 'reselect';
import {
	Credit,
	CustomModule,
	Institution,
	ModuleCollection,
} from '../models/credit';
import {ETH, UZH} from '../models/university';
import {CreditOverrideState} from '../reducers/creditOverrides';
import {ApiResponseState} from '../types/api-reducer-state';
import {AppState} from '../types/app-state';
import {UzhLoginResponse} from '../types/uzh-login';
import {CreditHelpers} from './CreditHelpers';
import {getChatRoomIdentifier} from './get-chat-room-identifier';
import {getUniqueIdentifier} from './get-unique-identifier';
import {humanToPeriod, periodToString} from './uzh-period';

export const getCreditsFromSummary = (
	summary: UzhLoginResponse,
	overrides: CreditOverrideState | null
): Credit[] => {
	if (!summary || !summary.credits) {
		return [];
	}

	return summary.credits.map((credit) => {
		return {
			...credit,
			...(credit.institution ? {} : {institution: UZH}),
			...(overrides ? overrides[getUniqueIdentifier(credit)] : {}),
		};
	});
};

const getPureCreditsFromSummary = (summary: UzhLoginResponse) =>
	getCreditsFromSummary(summary, null);

const findPureCredit = createSelector(
	[
		getPureCreditsFromSummary,
		(summary: UzhLoginResponse, moduleId: string) => moduleId,
		(summary: UzhLoginResponse, moduleId: string, semester: string) => semester,
	],
	(pureCredits, moduleId: string, semester: string) => {
		// Want the pure version without overrides
		return pureCredits.find((c) => {
			return [
				[
					c.uni_identifier === moduleId,
					c.link?.includes(`sm-${moduleId}`),
				].some(Boolean),
				CreditHelpers.getSemester(c) === semester,
			].every(Boolean);
		});
	}
);

const findCreditInCollection = createSelector(
	[
		(moduleCollection: ModuleCollection) => moduleCollection,
		(moduleCollection: ModuleCollection, uni_identifier: string) =>
			uni_identifier,
		(
			moduleCollection: ModuleCollection,
			uni_identifier: string,
			semester: string
		) => semester,
	],
	(moduleCollection, uni_identifier, semester) => {
		return moduleCollection.find(
			(mc) =>
				mc.uni_identifier === uni_identifier &&
				mc.period === humanToPeriod(semester)
		);
	}
);

const findCreditOfAnySemesterInCollection = createSelector(
	[
		(moduleCollection: ModuleCollection) => moduleCollection,
		(moduleCollection: ModuleCollection, uni_identifier: string) =>
			uni_identifier,
	],
	(moduleCollection, uni_identifier) => {
		return moduleCollection.find((mc) => mc.uni_identifier === uni_identifier);
	}
);

const makeLink = (
	semester: string,
	institution: Institution,
	moduleId: string
) => {
	return institution === ETH
		? `https://bestande.ch/eth/${moduleId}/${semester}`
		: `http://www.vorlesungen.uzh.ch/${semester}/suche/sm-${moduleId}.modveranst.html`;
};

const findCreditInApi = memoize(
	(
		apiState: ApiResponseState | undefined,
		moduleId: string,
		semester: string,
		institution: Institution
	): Credit | null => {
		if (!apiState || !apiState.details) {
			return null;
		}

		const s = apiState.details.semesters.find(
			(_s) => _s.period === humanToPeriod(semester)
		);
		if (!s) {
			return null;
		}

		return {
			link: makeLink(semester, institution, moduleId),
			name: apiState.details.name,
			short_name: apiState.details.short_name,

			credits_worth: s.credits,
			credits_received: null,
			status: 'NOT_BOOKED',

			grade: null,
			module: null,
			uni_identifier: moduleId,
			semester,
			institution,
		};
	},
	(
		apiState: ApiResponseState | undefined,
		moduleId: string,
		semester: string,
		institution: Institution
		// eslint-disable-next-line no-unsafe-optional-chaining
	) => apiState?.details?.uni_identifier + moduleId + semester + institution
);

export const mapCollectionToCredit = memoize(
	(creditInCollection: CustomModule): Credit => {
		return {
			link: makeLink(
				periodToString(creditInCollection.period),
				creditInCollection.university,
				creditInCollection.uni_identifier
			),
			name: creditInCollection.name,
			short_name: creditInCollection.short_name,
			credits_worth: creditInCollection.credits_worth
				? parseFloat(String(creditInCollection.credits_worth))
				: null,
			credits_received: null,
			status: 'ADDED',

			grade: null,
			module: null,
			uni_identifier: creditInCollection.uni_identifier,
			institution: creditInCollection.university,
			semester: periodToString(creditInCollection.period),
		};
	}
);

export const getPureCredit = memoize(
	(
		stateInstitution: Institution,
		multiSummary: {
			UZH: UzhLoginResponse | null;
			ETH: UzhLoginResponse | null;
		},
		moduleCollection: ModuleCollection,
		api: ApiResponseState | undefined,
		moduleId: string,
		semester: string,
		institution: Institution = UZH
	): Credit => {
		const credit = findPureCredit(
			multiSummary[stateInstitution] as UzhLoginResponse,
			semester,
			true
		);
		if (credit) {
			return credit;
		}

		const creditInCollection = findCreditInCollection(
			moduleCollection,
			moduleId,
			semester
		);
		if (creditInCollection) {
			return mapCollectionToCredit(creditInCollection);
		}

		const creditOfAnySemesterInCollection = findCreditOfAnySemesterInCollection(
			moduleCollection,
			moduleId
		);
		if (creditOfAnySemesterInCollection) {
			return mapCollectionToCredit(creditOfAnySemesterInCollection);
		}

		const inApi = findCreditInApi(api, moduleId, semester, institution);
		if (inApi) {
			return inApi;
		}

		// This should be triggered from search
		return {
			link: makeLink(semester, institution, moduleId),
			short_name: 'Laden...',
			name: 'Laden...',
			credits_worth: null,
			credits_received: null,

			status: 'NOT_BOOKED',

			grade: null,
			module: null,
			institution,
			semester,
			uni_identifier: moduleId,
		};
	},
	(
		stateInstitution: Institution,
		multiSummary: {
			UZH: UzhLoginResponse | null;
			ETH: UzhLoginResponse | null;
		},
		moduleCollection: ModuleCollection,
		api: ApiResponseState | undefined,
		moduleId: string,
		semester: string,
		institution: Institution = UZH
	) => {
		return (
			stateInstitution +
			// eslint-disable-next-line no-unsafe-optional-chaining
			multiSummary.UZH?.success +
			moduleCollection.map((m) => m.uni_identifier).join('') +
			// eslint-disable-next-line no-unsafe-optional-chaining
			api?.details?.uni_identifier +
			moduleId +
			semester +
			institution
		);
	}
);

export const getCredit = createSelector(
	[
		(state: AppState) => state.creditOverrides,
		(
			state: AppState,
			moduleId: string,
			semester: string,
			institution: Institution
		) =>
			getPureCredit(
				state.institution.institution,
				state.multiSummary,
				state.moduleCollection,
				state.api[getChatRoomIdentifier(moduleId, institution)],
				moduleId,
				semester,
				institution
			),
	],
	(overrides, credit) => {
		const override = overrides[getUniqueIdentifier(credit)];
		if (override) {
			return {
				...credit,
				...override,
			};
		}

		return credit;
	}
);
