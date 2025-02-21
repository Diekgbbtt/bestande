export type GradeStatisticLastUploadedHashState = {
	hash: string | null;
	lastUploded: number | null;
};

export type GradeOptState = {
	lastUploadHash: GradeStatisticLastUploadedHashState;
	optedIn: boolean;
};

export const setLastUploadHash = (hash: string) => {
	return {
		type: 'SET_LAST_UPLOAD_HASH' as const,
		hash,
	};
};

type SetLastUploadHash = ReturnType<typeof setLastUploadHash>;

export const setLastUploadHashState = (
	state: GradeStatisticLastUploadedHashState
) => {
	return {
		type: 'SET_LAST_UPLOAD_HASH_STATE' as const,
		state,
	};
};

type SetLastUploadHashState = ReturnType<typeof setLastUploadHashState>;

export const setGradeStatisticsLastUploadState = (date: number) => {
	return {
		type: 'SET_GRADE_STATISTICS_LAST_UPLOADED' as const,
		date,
	};
};

type SetGradeStatisticsLastUploaded = ReturnType<
	typeof setGradeStatisticsLastUploadState
>;

export const getInitialGradeStatisticLastUploadedHashState = (): GradeStatisticLastUploadedHashState => {
	return {
		lastUploded: null,
		hash: null,
	};
};

export const setOptedIn = (optedIn: boolean) => {
	return {
		type: 'SET_GRADE_OPTED_IN' as const,
		optedIn,
	};
};

type SetOptedIn = ReturnType<typeof setOptedIn>;

export const gradeOptReducer = (
	state: GradeOptState = {
		lastUploadHash: getInitialGradeStatisticLastUploadedHashState(),
		optedIn: true,
	},
	action:
		| SetLastUploadHash
		| SetLastUploadHashState
		| SetGradeStatisticsLastUploaded
		| SetOptedIn
): GradeOptState => {
	switch (action.type) {
		case 'SET_LAST_UPLOAD_HASH_STATE':
			return {
				...state,
				lastUploadHash: action.state,
			};
		case 'SET_LAST_UPLOAD_HASH':
			return {
				...state,
				lastUploadHash: {
					...state.lastUploadHash,
					hash: action.hash,
				},
			};
		case 'SET_GRADE_STATISTICS_LAST_UPLOADED':
			return {
				...state,
				lastUploadHash: {
					...state.lastUploadHash,
					lastUploded: action.date,
				},
			};
		case 'SET_GRADE_OPTED_IN':
			return {
				...state,
				optedIn: action.optedIn,
			};
		default:
			return state;
	}
};
