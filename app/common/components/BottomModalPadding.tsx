import React from 'react';
import {View} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';

export const BottomModalPadding = React.memo(() => {
	const safeArea = useSafeArea();
	return <View style={{height: safeArea.bottom}} />;
});
