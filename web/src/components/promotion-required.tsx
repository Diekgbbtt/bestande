import React, {ReactElement, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {fetchPromotion} from '../../../core/actions/promotions';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import {getPromotion} from '../../../core/reducers/promotions';
import {ErrorCode} from './errorcode';
import {Spinner} from './spinner';

export const PromotionRequired: React.FC<{
	id: string;
	className: string;
	children: ReactElement;
}> = (props) => {
	const dispatch = useDispatch();
	const promotion = useIsomorphicState((state) =>
		getPromotion(state.promotions, props.id)
	);

	const loadPromotions = useCallback(() => dispatch(fetchPromotion(props.id)), [
		dispatch,
		props.id,
	]);
	useEffect(() => {
		if (!promotion.data) {
			loadPromotions();
		}
	}, [loadPromotions, promotion.data, props.id]);
	const {children, ...otherProps} = props;
	if (promotion.loading) {
		return (
			<div className={props.className}>
				<Spinner />
			</div>
		);
	}

	if (promotion.error) {
		return (
			<div className={props.className} style={{display: 'flex'}}>
				<ErrorCode error={promotion.error} />
			</div>
		);
	}

	return React.cloneElement(children, {
		...otherProps,
		promotion: promotion.data,
		saving: promotion.saving,
	});
};
