import React, {useEffect, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {DietFilterButton} from '../../../core/components/DietFilterButton';
import {mobile} from '../../../core/components/layout/responsive';
import {MealComponent} from '../../../core/components/Meal';
import {MensaAllergenFilterButton} from '../../../core/components/MensaAllergenFilterButton';
import {MensaCategoryFilterButton} from '../../../core/components/MensaCategoryFilterButton';
import {MensaNowOpenFilterButton} from '../../../core/components/MensaNowOpenFilterButton';
import {PriceModalButton} from '../../../core/components/PriceModalButton';
import {mensaMensaList} from '../../../core/data/mensa-mensa-list';
import {Mensa, MensaDay, MensaId} from '../../../core/data/uzh-mensa';
import {getVisibleMenuPlans} from '../../../core/functions/get-visible-menu-plans';
import {getMensaPlan, openFirst} from '../../../core/functions/mensa-helpers';
import OpeningHours from '../../../core/functions/opening-hours';
import {selectMensa} from '../../../core/functions/selectors';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import {Institution} from '../../../core/models/credit';
import {changeDay, changeMensa, loadMensa} from '../../../core/reducers/food';
import {MensaHeader} from './mensa-header';
import {Spinner} from './spinner';

const allMensa = mensaMensaList();

const Container = styled.div`
	padding: 12px;
	padding-top: 30px;
	${mobile`
			padding-left: 0;
			padding-right: 0;
			padding-top: 0;
		`};
`;

const FilterRow = styled.div`
	padding-bottom: 8px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	${mobile`
		padding-left: 10px;
		padding-top: 10px;
	`}
`;

type OwnProps = {
	id: MensaId;
	day: MensaDay;
};

export const MensaMenu = (props: OwnProps) => {
	const data = useIsomorphicState((state) =>
		getMensaPlan(state.food, props.id, props.day)
	);
	const foodState = useIsomorphicState((state) => state.food);
	const pricing = useIsomorphicState((state) => state.food.pricing);
	const {labels, filterState} = useIsomorphicState((state) =>
		selectMensa(state)
	);
	const nowOpenFilter = useIsomorphicState((state) => state.food.nowOpenFilter);
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);
	const dispatch = useDispatch();
	const mensa = useMemo<Mensa>(() => {
		return allMensa.find((a) => a.id === props.id) as Mensa;
	}, [props.id]);
	const fetchMensa = React.useCallback(
		(m: Mensa, day: MensaDay) => {
			dispatch(
				loadMensa(m.id, day, m.institution as Institution, 'de', 'fsdkljfösa')
			);
		},
		[dispatch]
	);
	useEffect(() => {
		fetchMensa(mensa, props.day);
	}, [fetchMensa, mensa, props.day]);

	useEffect(() => {
		dispatch(changeMensa(props.id));
	}, [dispatch, props.id]);

	useEffect(() => {
		dispatch(changeDay(props.day));
	}, [dispatch, props.day, props.id]);

	const filtered = data.data?.filter((p) => {
		if (!nowOpenFilter) {
			return true;
		}

		if (!p.openingHours) {
			return false;
		}

		return new OpeningHours(p.openingHours, language).open;
	});

	return (
		<Container>
			<FilterRow>
				<MensaCategoryFilterButton labels={labels} filterState={filterState} />
				<PriceModalButton />
				<MensaNowOpenFilterButton />
				<DietFilterButton />
				<MensaAllergenFilterButton />
			</FilterRow>
			{mensa ? (
				filtered ? (
					openFirst(filtered).map((m) => {
						return (
							<div key={m.name}>
								<MensaHeader mensa={m} />
								{getVisibleMenuPlans(foodState, m.plan).map((plan) => {
									return (
										<MealComponent
											key={plan.title + plan.description.join()}
											mensa={m.slug}
											mensaId={mensa.id}
											pricing={pricing}
											meal={plan}
										/>
									);
								})}
							</div>
						);
					})
				) : (
					<Spinner />
				)
			) : (
				<div>Mensa nicht gefunden</div>
			)}
		</Container>
	);
};
