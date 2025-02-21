import {lighten} from 'polished';
import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

export const StaticAddToModulesButton = (props: {onPress?: () => void}) => {
	const appearance = useAppearance();
	const language = useLanguage();
	return (
		<TouchableHighlight
			onPress={() => props.onPress?.()}
			underlayColor={lighten(0.5, appearance.BLUE_TINT)}
			style={{
				paddingHorizontal: 10,
				borderRadius: 20,
				borderWidth: 2,
				borderColor: lighten(0.4, appearance.BLUE_TINT),
				paddingVertical: 4,
			}}
		>
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				<Image
					source={require('../assets/add.png')}
					style={{
						tintColor: lighten(0.15, appearance.BLUE_TINT),
						height: 20,
						width: 20,
						marginRight: 0,
					}}
				/>
				<Text
					style={{
						fontWeight: 'bold',
						fontSize: 13,
						color: appearance.BLUE_TINT,
					}}
				>
					{rawStrings.ADD_TO_MODULES[language]}
				</Text>
			</View>
		</TouchableHighlight>
	);
};
