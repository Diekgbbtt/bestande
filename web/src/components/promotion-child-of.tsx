import React from 'react';
import {useIsomorphicState} from '../../../core/functions/use-app-state';

export const PromotionChildOf = (props: {child_of: string | null}) => {
	const promotion = useIsomorphicState((state) => {
		if (!props.child_of) {
			return null;
		}

		return state.promotions.promotions[props.child_of];
	});
	if (!promotion) {
		return null;
	}

	return <div style={{fontSize: '0.8em'}}>Child of {promotion.data?.name}</div>;
};
