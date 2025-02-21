import {Heading} from '@jonny/rebass';
import React, {useCallback, useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {ThunkDispatch} from 'redux-thunk';
import {getPromotions} from '../../../core/actions/promotions';
import {
	ButtonContainer,
	HeaderContainer,
	TextContainer,
} from '../../../core/components/header-container';
import {useWebState} from '../../../core/functions/use-app-state';
import {parsePromotions} from '../../../core/reducers/promotions';
import {WebState} from '../../../core/types/web-state';
import Button from './button';
import Padded from './layout/padded';
import {PromotionPreview} from './promotion-preview';

const AdminPromotionsUnconnected: React.FC<{}> = ({...otherProps}) => {
	const promotions = useWebState((state) => parsePromotions(state.promotions));

	const dispatch = useDispatch();

	const load = useCallback(() => {
		dispatch(getPromotions({admin: true, profile: {}}));
	}, [dispatch]);

	useEffect(() => {
		load();
	}, [load]);

	return (
		<Padded {...otherProps}>
			<HeaderContainer>
				<TextContainer>
					<Heading>Werbung</Heading>
				</TextContainer>
				<ButtonContainer>
					<Link to="/admin/promotions/new">
						<Button>Neu</Button>
					</Link>
				</ButtonContainer>
			</HeaderContainer>
			<div>
				{promotions.map((p) => {
					return <PromotionPreview key={p._id} promotion={p} />;
				})}
			</div>
		</Padded>
	);
};

export const AdminPromotions = connect(
	(state: WebState) => ({
		promotions: parsePromotions(state.promotions),
	}),
	(dispatch: ThunkDispatch<any, any, any>) => ({
		fetch: () => {
			dispatch(getPromotions({admin: true, profile: {}}));
		},
	})
)(AdminPromotionsUnconnected);
