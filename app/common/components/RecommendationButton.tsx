import React, {useCallback} from 'react';
import {Image} from 'react-native-normalized';
import {connect} from 'react-redux';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {previousPeriod} from '../../../core/functions/validate-period';
import {recommendationPeriod} from '../../../core/models/current-period';
import {AppState} from '../../../core/types/app-state';
import {globalNavigate} from '../api/set-master-navigator';
import {HeaderButton} from './HeaderButton';

const RecommendationButtonView = ({visible}: {visible?: boolean}) => {
	const onPress = useCallback(() => {
		globalNavigate('RecommendationView');
	}, []);
	if (!visible) {
		return null;
	}

	return (
		<HeaderButton onPress={onPress}>
			<Image
				source={require('../assets/lightbulb.png')}
				style={{
					tintColor: 'white',
					height: 22,
					width: 22,
				}}
			/>
		</HeaderButton>
	);
};

export const RecommendationButton = connect((state: AppState) => {
	const credits = getVisibleCredits(state);
	const previousCreditAvailable = credits.find((c) => {
		return CreditHelpers.getPeriod(c) === previousPeriod(recommendationPeriod);
	});
	return {visible: Boolean(previousCreditAvailable)};
})(RecommendationButtonView);
