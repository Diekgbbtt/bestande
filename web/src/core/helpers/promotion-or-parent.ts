import {PromotionResponse} from '../../../../core/models/promotion';
import {UniversalState} from '../../../../core/types/universalState';

export const promotionOrParent = (
	state: UniversalState,
	promotion: PromotionResponse
): PromotionResponse => {
	if (!promotion.child_of && !promotion.alternative_of) {
		return promotion;
	}

	if (promotion.child_of) {
		return state.promotions.promotions?.[promotion.child_of]?.data || promotion;
	}

	if (promotion.alternative_of) {
		return (
			state.promotions.promotions?.[promotion.alternative_of]?.data || promotion
		);
	}

	return promotion;
};
