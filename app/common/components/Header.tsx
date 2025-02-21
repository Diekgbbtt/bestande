import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useAppearance} from '../../../core/functions/use-appearance';

export const Header = (props: {text: string; smallMargin?: boolean}) => {
	const appearance = useAppearance();
	return (
		<View>
			<Text
				style={{
					marginLeft: 12,
					marginRight: 12,
					marginTop: 12,
					marginBottom: props.smallMargin ? 0 : 12,
					fontSize: 13,
					color: appearance.SUBTITLE,
				}}
			>
				{props.text}
			</Text>
		</View>
	);
};
