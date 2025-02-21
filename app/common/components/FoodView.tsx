import React from 'react';
import {View} from 'react-native';
import {useAppearance} from '../../../core/functions/use-appearance';
import {MensaView} from './MensaView';

export const FoodView = () => {
	const appearance = useAppearance();
	return (
		<View style={{flex: 1, backgroundColor: appearance.BACKGROUND}}>
			<MensaView />
		</View>
	);
};
