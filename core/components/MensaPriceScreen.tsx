import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {MensaPricesFilter} from './MensaPricesFilter';

export const MensaPriceScreen = () => {
	const navigation = useNavigation();

	const onDismiss = useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return <MensaPricesFilter onDismiss={onDismiss} />;
};
