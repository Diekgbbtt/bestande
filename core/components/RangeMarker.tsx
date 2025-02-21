import React from 'react';
import {Platform, TouchableWithoutFeedback, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useAppearance} from '../functions/use-appearance';

export const RangeMarker = ({
	value,
	left,
	right,
	color,
}: {
	value: string;
	left?: boolean;
	right?: boolean;
	color?: string;
}) => {
	const appearance = useAppearance();
	return (
		<TouchableWithoutFeedback>
			<View
				style={{
					width: 200,
					height: 120,
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: left ? 'column' : 'column-reverse',
					marginTop:
						Platform.OS === 'ios' ? (left ? -17 : 21) : left ? -20 : 24,
				}}
			>
				<Text
					style={{
						fontSize: 14,
						fontWeight: '700',
						color,
						textAlign: left ? 'left' : 'right',
					}}
				>
					{value}
				</Text>

				<View
					style={[
						{
							height: 16,
							width: 16,
							borderRadius: 8,
							backgroundColor: appearance.BACKGROUND,
							borderWidth: 2,
							borderColor: appearance.BORDER_COLOR,
							marginTop: left ? 3 : 0,
							marginBottom: right ? 3 : 0,
						},
						left ? {marginLeft: -35} : null,
						right ? {marginRight: -35} : null,
					]}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};
