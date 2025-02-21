import {ErrorWithStatusCode} from '../functions/api-request';
import {PromotionResponse} from '../models/promotion';

export type SinglePromotionState = {
	loading: boolean;
	data: PromotionResponse | null;
	error: ErrorWithStatusCode | null;
	saving: boolean;
	deleting: boolean;
};

type PromotionsMap = {[key: string]: SinglePromotionState};

export type UpdatePromotionResponse = {
	promotion: PromotionResponse;
};

export type PromotionState = {
	triedLoading: boolean;
	loading: boolean;
	promotions: PromotionsMap;
	creating: boolean;
	hideBadge: boolean;
};
