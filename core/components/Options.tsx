import React from 'react';
import {Platform, View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Config} from '../data/Config';
import {Colors} from '../functions/Colors';
import {Base, ContentTouchable, Label as BaseLabel} from './Base';

export const OptionContainer = styled(Base)`
	border-radius: 40px;
`;

const OptionTouchable = styled(ContentTouchable)<{
	active?: boolean;
	activeColor?: string;
}>`
	background-color: ${(props) =>
		props.active ? props.activeColor || Colors.Blue : 'transparent'};
	padding-top: 14px;
	padding-bottom: 14px;
	border-radius: 40px;
	${Config.IS_WEBSITE
		? css`
				height: 100%;
		  `
		: css``}
`;

export const Option = (props: {
	active?: boolean;
	activeColor?: string;
	children: any;
	onPress: () => void;
	style?: any;
}) => {
	const {style, ...otherProps} = props;
	return (
		<View
			style={[style, {flex: 1}]}
			{...(otherProps.active
				? {
						...Platform.select({
							ios: {
								shadowOpacity: 1,
								shadowColor: 'rgba(0, 0, 0, 0.2)',
								shadowOffset: {width: 0, height: 0},
								shadowRadius: 5,
							},
							android: {
								elevation: 2,
							},
						}),
				  }
				: {})}
		>
			<OptionTouchable
				active={otherProps.active}
				activeColor={otherProps.activeColor}
				onPress={otherProps.onPress}
			>
				{otherProps.children}
			</OptionTouchable>
		</View>
	);
};

export const Label = styled(BaseLabel)`
	text-align: center;
	flex: 1;
`;
