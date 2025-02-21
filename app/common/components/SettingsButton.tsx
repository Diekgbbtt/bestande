import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useTablet} from '../api/use-tablet';
import {HeaderButton} from './HeaderButton';

const Icon = styled(Image)`
	width: 24px;
	height: 24px;
	tint-color: white;
`;

export const SettingsButton = () => {
	const tablet = useTablet();
	const navigation = useNavigation();
	const onPress = useCallback(() => {
		navigation?.navigate('SettingsView', {});
	}, [navigation]);

	if (!tablet) {
		return null;
	}

	return (
		<HeaderButton onPress={onPress}>
			<Icon source={require('../assets/settings.png')} />
		</HeaderButton>
	);
};
