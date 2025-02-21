import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components/native';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {useAppState} from '../../../core/functions/use-app-state';
import {globalNavigate} from '../api/set-master-navigator';

const Button = styled(TouchableOpacity)`
	padding-top: 7px;
	padding-bottom: 7px;
`;

const Icon = styled(Image)`
	tint-color: white;
	height: 22px;
	width: 22px;
	margin-top: 5px;
`;

export const TimeTableOptionsButton = () => {
	const visibleCredits = useAppState((state) => getVisibleCredits(state));
	if (!visibleCredits.length) {
		return null;
	}

	return (
		<Button
			onPress={() => {
				globalNavigate('TimetableOptions');
			}}
		>
			<View>
				<Icon source={require('../assets/settings.png')} />
			</View>
		</Button>
	);
};
