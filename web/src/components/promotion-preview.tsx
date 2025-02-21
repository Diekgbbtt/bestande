import {Heading} from '@jonny/rebass';
import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {ThunkDispatch} from 'redux-thunk';
import styled from 'styled-components';
import {removePromotion} from '../../../core/actions/promotions';
import {thousands} from '../../../core/functions/format-thousands';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import {PromotionResponse} from '../../../core/models/promotion';
import {WebState} from '../../../core/types/web-state';
import {promotionOrParent} from '../core/helpers/promotion-or-parent';
import {HeaderImage} from './header-image';
import {EscapePadded} from './layout/padded';
import {PromotionChildOf} from './promotion-child-of';
import {PromotionAlternativeOf} from './PromotionAlternativeOf';
import {PromotionLiveStatus} from './PromotionLiveStatus';

const Container = styled(EscapePadded)`
	padding: 12px;
	display: flex;
	cursor: pointer;
	color: black;
	&:hover {
		background: rgba(0, 0, 0, 0.1);
	}
`;

const Panel = styled.div`
	display: flex;
	align-items: center;
`;

const PromoterName = styled.div`
	color: gray;
`;

const Left = styled.div`
	margin-right: 10px;
	width: 60px;
`;

const Middle = styled(Panel)`
	flex: 3;
	justify-content: middle;
	align-items: flex-start;
	flex-direction: column;
`;

const Live = styled(Panel)`
	flex: 1;
	color: ${(props) => props.color};
	div {
		background: ${(props) => props.color};
	}
`;

const Stats = styled(Panel)`
	flex: 1;
	flex-direction: column;
	align-items: flex-start;
	font-size: 0.75em;
`;

const Dot = styled.div`
	width: 10px;
	height: 10px;
	border-radius: 5px;
	margin-right: 6px;
`;

const Time = styled(Panel)`
	flex: 1;
	i {
		margin-right: 10px;
		margin-top: -2px;
	}
`;

const Remove = styled(Panel)``;

const Analytics = styled(Panel)``;

const PromotionPreviewView = ({
	promotion,
	deleting,
	remove,
}: {
	deleting: boolean;
	remove: () => void;
	promotion: PromotionResponse;
}) => {
	const actualOrParentPromotion = useIsomorphicState((state) =>
		promotionOrParent(state, promotion)
	);
	return (
		<Link to={`/admin/promotions/${promotion._id}`}>
			<Container horizontal>
				<Left>
					<HeaderImage type="avatar" image={promotion.image} />
				</Left>
				<Middle>
					<Heading level={4}>{promotion.name}</Heading>
					<PromoterName>{promotion.promoter}</PromoterName>
					<PromoterName>
						<PromotionChildOf child_of={promotion.child_of || null} />
						<PromotionAlternativeOf
							alternative_of={promotion.alternative_of || null}
						/>
					</PromoterName>
				</Middle>
				<Stats>
					<div>
						{thousands(
							Number(promotion.statistics ? promotion.statistics.view : 0),
							"'"
						)}{' '}
						Impressionen
					</div>
					<div>
						{thousands(
							Number(promotion.statistics ? promotion.statistics.click : 0),
							"'"
						)}{' '}
						Views
					</div>
					<div>
						{thousands(
							Number(promotion.statistics ? promotion.statistics.cta : 0),
							"'"
						)}{' '}
						CTA-Klicks
					</div>
				</Stats>
				<Live
					color={
						actualOrParentPromotion.scheduled
							? 'orange'
							: actualOrParentPromotion.live
							? 'red'
							: 'gray'
					}
				>
					<Dot />
					<PromotionLiveStatus promotion={promotion} />
				</Live>
				<Time>
					<i className="material-icons">date_range</i>
					{moment(actualOrParentPromotion.start_date).format('DD.MM.YYYY')}
				</Time>
				<Analytics>
					<Link to={`/werbung/analytics/${promotion._id}`}>
						<i
							style={{color: deleting ? 'gray' : 'black'}}
							className="material-icons"
						>
							timeline
						</i>
					</Link>
				</Analytics>
				<div style={{width: 10}} />
				<Remove>
					<a
						onClick={(e) => {
							e.preventDefault();
							remove();
						}}
					>
						<i
							style={{color: deleting ? 'gray' : 'black'}}
							className="material-icons"
						>
							delete
						</i>
					</a>
				</Remove>
			</Container>
		</Link>
	);
};

type OwnProps = {
	promotion: PromotionResponse;
};

export const PromotionPreview = connect(
	(state: WebState, ownProps: OwnProps) => ({
		deleting:
			state.promotions.promotions[ownProps.promotion._id as string].deleting,
	}),
	(dispatch: ThunkDispatch<any, any, any>, ownProps: OwnProps) => ({
		remove: () => {
			// eslint-disable-next-line no-alert
			if (!window.confirm('Möchtest du diese Werbung wirklich entfernen?')) {
				return;
			}

			dispatch(removePromotion(ownProps.promotion));
		},
	})
)(PromotionPreviewView);
