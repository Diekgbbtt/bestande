import {ThunkDispatch} from 'redux-thunk';
import {apiRequest, ErrorWithStatusCode} from '../functions/api-request';
import {PromotionResponse} from '../models/promotion';
import {UpdatePromotionResponse} from '../types/promotion-state';

export const FETCH_PROMOTIONS_REQUEST = 'FETCH_PROMOTIONS_REQUEST';
export const FETCH_PROMOTIONS_ERROR = 'FETCH_PROMOTIONS_ERROR';
export const PROMOTIONS_FETCHED = 'PROMOTIONS_FETCHED';

export const FETCH_PROMOTION_REQUEST = 'FETCH_PROMOTION_REQUEST';
export const FETCH_PROMOTION_ERROR = 'FETCH_PROMOTION_ERROR';

export const CREATE_PROMOTION_REQUEST = 'CREATE_PROMOTION_REQUEST';
export const CREATE_PROMOTION_ERROR = 'CREATE_PROMOTION_ERROR';

export const SAVE_PROMOTION_REQUEST = 'SAVE_PROMOTION_REQUEST';
export const SAVE_PROMOTION_ERROR = 'SAVE_PROMOTION_ERROR';
export const PROMOTION_UPDATED = 'PROMOTION_UPDATED';

const DELETE_PROMOTION_REQUEST = 'DELETE_PROMOTION_REQUEST';
export const DELETE_PROMOTION_ERROR = 'DELETE_PROMOTION_ERROR';
export const PROMOTION_REMOVED = 'PROMOTION_REMOVED';

export const HIDE_BADGE = 'HIDE_BADGE';

export type HideBadge = {
	type: 'HIDE_BADGE';
};

export type CreatePromotionRequest = {
	type: 'CREATE_PROMOTION_REQUEST';
	promotion: PromotionResponse;
};

const createPromotionRequest = (
	promotion: PromotionResponse
): CreatePromotionRequest => {
	return {
		type: CREATE_PROMOTION_REQUEST,
		promotion,
	};
};

export type ErrorCreatingPromotion = {
	type: 'CREATE_PROMOTION_ERROR';
	promotion: PromotionResponse;
	err: ErrorWithStatusCode;
};

const errorCreatingPromotion = (
	promotion: PromotionResponse,
	err: Error
): ErrorCreatingPromotion => {
	return {
		type: CREATE_PROMOTION_ERROR,
		promotion,
		err,
	};
};

export type SavePromotionRequest = {
	type: 'SAVE_PROMOTION_REQUEST';
	promotion: PromotionResponse;
};

const savePromotionRequest = (
	promotion: PromotionResponse
): SavePromotionRequest => {
	return {
		type: SAVE_PROMOTION_REQUEST,
		promotion,
	};
};

export type ErrorSavingPromotion = {
	type: 'SAVE_PROMOTION_ERROR';
	promotion: PromotionResponse;
	err: ErrorWithStatusCode;
};

const errorSavingPromotion = (
	promotion: PromotionResponse,
	err: Error
): ErrorSavingPromotion => {
	return {
		type: SAVE_PROMOTION_ERROR,
		promotion,
		err,
	};
};

export type PromotionUpdated = {
	type: 'PROMOTION_UPDATED';
	promotion: PromotionResponse;
};

export const promotionUpdated = (promotion: PromotionResponse): PromotionUpdated => {
	return {
		type: PROMOTION_UPDATED,
		promotion,
	};
};

export type ErrorDeletingPromotion = {
	type: 'DELETE_PROMOTION_ERROR';
	promotion: PromotionResponse;
};

const errorDeletingPromotion = (
	promotion: PromotionResponse
): ErrorDeletingPromotion => {
	return {
		type: DELETE_PROMOTION_ERROR,
		promotion,
	};
};

export type PromotionRemoved = {
	type: 'PROMOTION_REMOVED';
	promotionId: string;
};

export const promotionRemoved = (promotionId: string): PromotionRemoved => {
	return {
		type: PROMOTION_REMOVED,
		promotionId,
	};
};

export type FetchPromotionsRequest = {
	type: 'FETCH_PROMOTIONS_REQUEST';
};

const fetchPromotionsRequest = (): FetchPromotionsRequest => {
	return {
		type: FETCH_PROMOTIONS_REQUEST,
	};
};

export type PromotionsFetched = {
	type: 'PROMOTIONS_FETCHED';
	promotions: PromotionResponse[];
};

const promotionsFetched = (promotions: PromotionResponse[]): PromotionsFetched => {
	return {
		type: PROMOTIONS_FETCHED,
		promotions,
	};
};

export type FetchPromotionsError = {
	type: 'FETCH_PROMOTIONS_ERROR';
	err: ErrorWithStatusCode;
};

const fetchPromotionsError = (err: Error): FetchPromotionsError => {
	return {
		type: FETCH_PROMOTIONS_ERROR,
		err,
	};
};

export type FetchPromotionRequest = {
	type: 'FETCH_PROMOTION_REQUEST';
	_id: string;
};

const fetchPromotionRequest = (_id: string): FetchPromotionRequest => ({
	type: 'FETCH_PROMOTION_REQUEST',
	_id,
});

export type FetchPromotionError = {
	type: 'FETCH_PROMOTION_ERROR';
	err: ErrorWithStatusCode;
	_id: string;
};

const fetchPromotionError = (err: Error, _id: string): FetchPromotionError => ({
	type: FETCH_PROMOTION_ERROR,
	err,
	_id,
});

export const getPromotions = ({profile = {}, admin = false}) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(fetchPromotionsRequest());
		try {
			const url = admin ? '/promotions' : '/promotions/live';
			const body = JSON.stringify({
				...profile,
			});
			const response: any = await apiRequest(url, {
				method: admin ? 'GET' : 'POST',
				body: admin ? null : body,
			});
			const promotions = response.promotions;
			dispatch(promotionsFetched(promotions));
		} catch (err) {
			console.log(err);
			dispatch(fetchPromotionsError(err));
		}
	};
};

export const fetchPromotion = (_id: string) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(fetchPromotionRequest(_id));
		try {
			const response = await apiRequest(`/promotions/${_id}`);
			const promotion = (response as any).promotion as PromotionResponse;
			dispatch(promotionUpdated(promotion));
		} catch (err) {
			dispatch(fetchPromotionError(err, _id));
		}
	};
};

export const addPromotion = (promotion: PromotionResponse, cb?: () => void) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(createPromotionRequest(promotion));
		try {
			const {promotion: update} = (await apiRequest('/promotions', {
				method: 'PUT',
				body: JSON.stringify({
					promotion,
				}),
			})) as {promotion: PromotionResponse};
			dispatch(promotionUpdated(update));
			if (cb) {
				cb();
			}
		} catch (err) {
			// eslint-disable-next-line no-alert
			alert(`Couldn't create promotion: ${err.message}`);
			dispatch(errorCreatingPromotion(promotion, err));
		}
	};
};

export const savePromotion = (promotion: PromotionResponse, cb: () => void) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(savePromotionRequest(promotion));
		try {
			const {promotion: update} = await apiRequest<UpdatePromotionResponse>(
				`/promotions/${promotion._id}`,
				{
					method: 'POST',
					body: JSON.stringify({
						promotion,
					}),
				}
			);
			dispatch(promotionUpdated(update));
			if (cb) {
				cb();
			}
		} catch (err) {
			dispatch(errorSavingPromotion(promotion, err));
		}
	};
};

export const removePromotion = (promotion: PromotionResponse) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch({
			type: DELETE_PROMOTION_REQUEST,
			promotion,
		});
		try {
			await apiRequest(`/promotions/${promotion._id}`, {
				method: 'DELETE',
			});
			dispatch(promotionRemoved(promotion._id as string));
		} catch (err) {
			dispatch(errorDeletingPromotion(promotion));
		}
	};
};
