import React from 'react';
import {useIsomorphicState} from '../../../core/functions/use-app-state';

export const PromotionAlternativeOf = (props: {
	alternative_of: string | null;
}) => {
	const promotion = useIsomorphicState((state) => {
		if (!props.alternative_of) {
			return null;
		}

		return state.promotions.promotions[props.alternative_of];
	});
	if (!promotion) {
		return null;
	}

	return (
		<div style={{fontSize: '0.8em'}}>Alternative of {promotion.data?.name}</div>
	);
};
