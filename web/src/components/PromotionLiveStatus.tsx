import React from 'react';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import {PromotionResponse} from '../../../core/models/promotion';
import {promotionOrParent} from '../core/helpers/promotion-or-parent';

export const PromotionLiveStatus = (props: {promotion: PromotionResponse}) => {
	const actualOrParentPromotion = useIsomorphicState(
		(state): PromotionResponse => {
			return promotionOrParent(state, props.promotion);
		}
	);
	return (
		<span>
			{actualOrParentPromotion.scheduled
				? (actualOrParentPromotion.scheduled_start as number) > Date.now()
					? 'Geplant'
					: (actualOrParentPromotion.scheduled_end as number) < Date.now()
						? 'Beendet'
						: 'Live'
				: actualOrParentPromotion.live
					? 'Live'
					: 'Entwurf'}
			{props.promotion.child_of ? ' (Parent)' : null}
		</span>
	);
};
