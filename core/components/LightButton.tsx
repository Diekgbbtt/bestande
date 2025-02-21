import TouchableScale, {TouchableScaleProps} from '@jonny/touchable-scale';
import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useAppearance} from '../functions/use-appearance';

export const LightButtonLabel = styled(Text)`
	font-weight: bold;
	font-size: 13px;
	opacity: 0.8;
	color: ${(props) => props.theme.TITLE};
`;

export const LightButton: React.FC<TouchableScaleProps> = ({
	style,
	...props
}) => {
	const appearance = useAppearance();
	const buttonStyle = useMemo(
		() =>
			StyleSheet.compose(
				{
					flex: 1,
					padding: 10,
					borderRadius: 4,
					alignItems: 'center' as const,
					backgroundColor: appearance.TAG_BACKGROUND,
				},
				style
			),
		[appearance.TAG_BACKGROUND, style]
	);
	return <TouchableScale style={buttonStyle} {...props} />;
};
