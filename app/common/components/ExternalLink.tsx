import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native-normalized';
import {Base, Content} from '../../../core/components/Base';
import {openLink} from '../../../core/functions/open-link';
import {useAppearance} from '../../../core/functions/use-appearance';

export const ExternalLink = (props: {
	background?: string;
	color?: string;
	url: string;
	text: string;
	onPress?: () => void;
}) => {
	const appearance = useAppearance();
	const backgroundColor = props.background || appearance.BASE_COLOR;
	const color = props.color || appearance.BUTTON_LABEL_COLOR;
	return (
		<TouchableOpacity
			onPress={() => (props.onPress ? props.onPress() : openLink(props.url))}
		>
			<Base
				padded
				style={{
					backgroundColor,
				}}
			>
				<Content>
					<Text style={{fontWeight: 'bold', color}}>{props.text}</Text>
				</Content>
			</Base>
		</TouchableOpacity>
	);
};
