import omitBy from 'lodash/omitBy';
import zipObject from 'lodash/zipObject';
import {
	CreatePromotionRequest,
	CREATE_PROMOTION_ERROR,
	CREATE_PROMOTION_REQUEST,
	DELETE_PROMOTION_ERROR,
	ErrorCreatingPromotion,
	ErrorDeletingPromotion,
	ErrorSavingPromotion,
	FetchPromotionError,
	FetchPromotionRequest,
	FetchPromotionsError,
	FetchPromotionsRequest,
	FETCH_PROMOTIONS_ERROR,
	FETCH_PROMOTIONS_REQUEST,
	FETCH_PROMOTION_ERROR,
	FETCH_PROMOTION_REQUEST,
	HideBadge,
	HIDE_BADGE,
	PromotionRemoved,
	PromotionsFetched,
	PROMOTIONS_FETCHED,
	PromotionUpdated,
	PROMOTION_REMOVED,
	PROMOTION_UPDATED,
	SavePromotionRequest,
	SAVE_PROMOTION_ERROR,
	SAVE_PROMOTION_REQUEST,
} from '../actions/promotions';
import {PromotionResponse} from '../models/promotion';
import {PromotionState, SinglePromotionState} from '../types/promotion-state';

export const defaultPromotionState: SinglePromotionState = {
	loading: true,
	data: null,
	error: null,
	saving: false,
	deleting: false,
};

const defaultState: PromotionState = {
	triedLoading: false,
	loading: false,
	promotions: {},
	creating: false,
	hideBadge: false,
};

export const parsePromotions = (state: PromotionState) => {
	return Object.keys(state.promotions)
		.map((p) => (state.promotions[p] as SinglePromotionState).data)
		.filter((p): p is PromotionResponse => p !== null);
};

export const getPromotion = (state: PromotionState, _id: string) => {
	const obj = state.promotions[_id];
	if (!obj) {
		return defaultPromotionState;
	}

	return obj;
};

export const promotions = (
	state: PromotionState = defaultState,
	action:
		| CreatePromotionRequest
		| ErrorCreatingPromotion
		| SavePromotionRequest
		| ErrorSavingPromotion
		| PromotionUpdated
		| ErrorDeletingPromotion
		| PromotionRemoved
		| FetchPromotionsRequest
		| PromotionsFetched
		| FetchPromotionsError
		| FetchPromotionRequest
		| FetchPromotionError
		| HideBadge
): PromotionState => {
	switch (action.type) {
		case FETCH_PROMOTIONS_REQUEST:
			return {
				...state,
				loading: true,
			};
		case FETCH_PROMOTIONS_ERROR:
			return {
				...state,
				loading: false,
				triedLoading: true,
			};
		case PROMOTIONS_FETCHED:
			return {
				...state,
				loading: false,
				triedLoading: true,
				promotions: zipObject(
					action.promotions.map((a) => a._id as string),
					action.promotions.map((a) => ({
						...defaultPromotionState,
						loading: false,
						data: a,
					}))
				),
			};
		case CREATE_PROMOTION_REQUEST:
			return {
				...state,
				creating: true,
			};
		case CREATE_PROMOTION_ERROR:
			return {
				...state,
				creating: false,
			};
		case SAVE_PROMOTION_REQUEST:
			return {
				...state,
				promotions: {
					...state.promotions,
					[action.promotion._id as string]: {
						...state.promotions[action.promotion._id as string],
						saving: true,
					},
				},
			};
		case SAVE_PROMOTION_ERROR:
			return {
				...state,
				promotions: {
					...state.promotions,
					[action.promotion._id as string]: {
						...state.promotions[action.promotion._id as string],
						saving: false,
					},
				},
			};
		case PROMOTION_UPDATED:
			return {
				...state,
				creating: false,
				promotions: {
					...state.promotions,
					[action.promotion._id as string]: {
						...state.promotions[action.promotion._id as string],
						...defaultPromotionState,
						loading: false,
						data: action.promotion,
					},
				},
			};
		case DELETE_PROMOTION_ERROR:
			return {
				...state,
				promotions: {
					...state.promotions,
					[action.promotion._id as string]: {
						...state.promotions[action.promotion._id as string],
						deleting: false,
					},
				},
			};
		case PROMOTION_REMOVED:
			return {
				...state,
				promotions: omitBy(state.promotions, (promotion, _id) => {
					return _id === action.promotionId;
				}),
			};
		case FETCH_PROMOTION_REQUEST:
			return {
				...state,
				promotions: {
					...state.promotions,
					[action._id]: {
						...state.promotions[action._id],
						...defaultPromotionState,
					},
				},
			};
		case FETCH_PROMOTION_ERROR:
			return {
				...state,
				promotions: {
					...state.promotions,
					[action._id]: {
						...state.promotions[action._id],
						...defaultPromotionState,
						loading: false,
						error: action.err,
					},
				},
			};
		case HIDE_BADGE:
			return {
				...state,
				hideBadge: true,
			};
		default:
			return state;
	}
};
