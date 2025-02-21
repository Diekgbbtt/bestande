import React, {useCallback} from 'react';
import {Image} from 'react-native-normalized';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {useAppState} from '../../../core/functions/use-app-state';
import {isCreditBooked} from '../api/is-credit-booked';
import {globalNavigate} from '../api/set-master-navigator';
import {HeaderButton} from './HeaderButton';

export const BookRecommendationButton = ({visible}: {visible?: boolean}) => {
	const credits = useAppState((s) =>
		getVisibleCredits(s).filter((c) => isCreditBooked(c))
	);
	const onPress = useCallback(() => {
		globalNavigate('RecommendationBooks');
	}, []);

	if (!visible || credits.length === 0) {
		return null;
	}

	return (
		<HeaderButton onPress={onPress}>
			<Image
				source={require('../assets/books.png')}
				style={{
					tintColor: 'white',
					height: 20,
					width: 20,
					marginTop: 2,
				}}
			/>
		</HeaderButton>
	);
};
