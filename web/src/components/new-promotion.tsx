import {Heading, Space} from '@jonny/rebass';
import isEqual from 'lodash/isEqual';
import React, {useCallback, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link, Prompt, Redirect} from 'react-router-dom';
import {addPromotion} from '../../../core/actions/promotions';
import {
	ButtonContainer,
	HeaderContainer,
	TextContainer,
} from '../../../core/components/header-container';
import {useWebState} from '../../../core/functions/use-app-state';
import {PromotionResponse} from '../../../core/models/promotion';
import {PROMOTION, PromotionType} from '../../../core/models/promotion-type';
import {NONE} from '../../../core/models/time-display-type';
import validatePromotion from '../helpers/validate-promotion';
import Button from './button';
import Padded from './layout/padded';
import PromotionForm from './promotion-form';

export const emptyPromotion = (): PromotionResponse => ({
	location: null,
	promoter: '',
	promoter_link: '',
	type: PROMOTION as PromotionType,
	name: '',
	live: false,
	image: null,
	start_date: Date.now(),
	end_date: Date.now(),
	time_display: NONE,
	description: '',
	open_in_browser: false,
	top_position: false,
	exclusive: false,
	creator: null,
	scheduled: false,
	scheduled_start: Date.now(),
	scheduled_end: Date.now(),
});

export const NewPromotion: React.FC<{}> = (props) => {
	const creating = useWebState((state) => state.promotions.creating);
	const dispatch = useDispatch();
	const [created, setCreated] = useState(false);
	const [promotion, setPromotion] = useState<PromotionResponse>(
		emptyPromotion()
	);
	const create = useCallback(
		(promo: PromotionResponse, cb: () => void) => {
			return dispatch(addPromotion(promo, cb));
		},
		[dispatch]
	);

	const isSaved = useMemo(() => {
		return isEqual(promotion, emptyPromotion());
	}, [promotion]);
	const validate = useCallback(() => {
		return validatePromotion(promotion);
	}, [promotion]);
	const saveButtonLabel = useMemo(() => {
		if (creating) {
			return 'Speichern...';
		}

		return 'Speichern';
	}, [creating]);
	if (created) {
		return <Redirect to="/admin/promotions" />;
	}

	return (
		<Padded {...props}>
			<HeaderContainer>
				<TextContainer>
					<Heading>Neue Werbung</Heading>
				</TextContainer>
				<ButtonContainer>
					<Link to="/admin/promotions">
						<Button>Zurück</Button>
					</Link>
					<Space x={1} />
					<div>
						<Button
							disabled={validate().length > 0 || creating}
							onClick={() =>
								create(promotion, () => {
									setCreated(true);
								})
							}
						>
							{saveButtonLabel}
						</Button>
					</div>
				</ButtonContainer>
			</HeaderContainer>
			<PromotionForm
				promotion={promotion}
				onChange={(newPromo) => {
					setPromotion(newPromo);
				}}
			/>
			<Prompt
				when={!isSaved}
				message={() =>
					'Die Werbung wird verworfen. Möchtest du wirklich die Seite verlassen?'
				}
			/>
		</Padded>
	);
};
