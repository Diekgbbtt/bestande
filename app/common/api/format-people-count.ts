import {thousands} from '../../../core/functions/format-thousands';
import {ApiResponseState} from '../../../core/types/api-reducer-state';

export const formatPeopleCount = (
	apiResponse: ApiResponseState
): string | null => {
	if (!apiResponse.details) {
		return null;
	}

	return thousands(Number(apiResponse.details.userCount.all), "'");
};
