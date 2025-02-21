import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DietFilterButton} from '../../../core/components/DietFilterButton';
import {Container, LabelArea} from '../../../core/components/FilterBase';
import {MensaAllergenFilterButton} from '../../../core/components/MensaAllergenFilterButton';
import {MensaCategoryFilterButton} from '../../../core/components/MensaCategoryFilterButton';
import {MensaNowOpenFilterButton} from '../../../core/components/MensaNowOpenFilterButton';
import {PriceModalButton} from '../../../core/components/PriceModalButton';
import {Spacer} from '../../../core/components/UI/Spacer';
import {selectMensa} from '../../../core/functions/selectors';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';

export const MensaFilters = () => {
	const {labels, filterState} = useIsomorphicState((state) =>
		selectMensa(state)
	);
	const safeArea = useSafeAreaInsets();
	const appearance = useAppearance();
	if (labels.length === 0) {
		return null;
	}

	return (
		<Container style={{backgroundColor: appearance.BACKGROUND}}>
			<LabelArea>
				<View style={{width: 12 + safeArea.left}} />
				<MensaCategoryFilterButton labels={labels} filterState={filterState} />
				<Spacer />
				<PriceModalButton />
				<Spacer />
				<MensaNowOpenFilterButton />
				<Spacer />
				<DietFilterButton />
				<Spacer />
				<MensaAllergenFilterButton />
				<View style={{width: 8 + safeArea.right}} />
			</LabelArea>
		</Container>
	);
};
