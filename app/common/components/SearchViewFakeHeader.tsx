import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppearance} from '../../../core/functions/use-appearance';

export const SearchViewFakeHeader: React.FC = () => {
	const theme = useAppearance();
	const safeArea = useSafeAreaInsets();

	const style = useMemo(() => {
		return {
			backgroundColor: theme.HEADER_BACKGROUND,
			height: safeArea.top,
		};
	}, [safeArea.top, theme.HEADER_BACKGROUND]);

	return <View style={style} />;
};
