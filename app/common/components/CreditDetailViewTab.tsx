import React from 'react';
import {ImageURISource, TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useAppearance} from '../../../core/functions/use-appearance';

const OuterTab = styled(View)<{
	active?: boolean;
}>`
	flex: 1;
	border-bottom-width: 3px;
	border-bottom-color: ${(props) =>
		props.active ? props.theme.BLUE_TINT : props.theme.BORDER_COLOR};
`;

const TabStyle = styled(View)`
	align-items: center;
	height: 40px;
	justify-content: center;
	flex-direction: row;
`;

const TabLabel = styled(Text)<{
	active?: boolean;
}>`
	color: ${(props) =>
		props.active ? props.theme.BLUE_TINT : props.theme.SUBTITLE};
	font-size: 12px;
	font-weight: bold;
`;

export const CreditDetailViewTab = (props: {
	text: string;
	active?: boolean;
	name: string;
	rightMarkup?: any;
	icon?: ImageURISource;
	setTab: (tab: string) => void;
}) => {
	const {text, active, name, rightMarkup, icon, ...otherProps} = props;
	const appearance = useAppearance();
	return (
		<OuterTab active={active}>
			<TouchableOpacity activeOpacity={0.8} onPress={() => props.setTab(name)}>
				<TabStyle {...otherProps}>
					{icon ? (
						<Image
							style={{
								height: 22,
								width: 22,
								tintColor: active ? appearance.BLUE_TINT : appearance.SUBTITLE,
							}}
							source={icon}
						/>
					) : (
						<TabLabel active={active}>
							{text.toUpperCase().substr(0, 3)}
						</TabLabel>
					)}
				</TabStyle>
			</TouchableOpacity>
		</OuterTab>
	);
};
