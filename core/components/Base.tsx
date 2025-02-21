import React, {ReactNode} from 'react';
import {
	TextProps,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled, {css} from 'styled-components/native';
import {Colors} from '../functions/Colors';
import {globalStyles} from '../functions/styles';
import {uiKit} from '../functions/ui-kit';
import {useAppearance} from '../functions/use-appearance';
import WebTouchable from './WebTouchable';

type BaseCssProp = {
	padded?: true;
};

const baseCss = css<BaseCssProp>`
	background-color: ${(props) => props.theme.BASE_COLOR};
	border-radius: 30px;
	flex-direction: row;
	${(props) =>
		props.padded
			? `
		padding-left: 20px;
		padding-right: 10px;
	`
			: null};
`;

type ContentStyle = {
	small?: boolean;
};

const contentCss = css<ContentStyle>`
	padding-top: ${(props) => (props.small ? 10 : 14)}px;
	padding-bottom: ${(props) => (props.small ? 10 : 14)}px;
	flex-direction: row;
	align-items: center;
`;

export const shadow = {
	shadowColor: 'rgba(0, 0, 0, 0.1)',
	shadowOffset: {width: 0, height: 0},
	shadowRadius: 5,
	shadowOpacity: 1,
};

export const Base = styled(View)<BaseCssProp>`
	${baseCss};
`;

export const BaseTouchable = styled(TouchableOpacity)<BaseCssProp>`
	${baseCss};
`;

export const Content = styled(View)<ContentStyle>`
	${contentCss};
`;

export const Chevron = styled(Image).attrs({
	source: require('../assets/collapsed.png'),
})`
	tint-color: ${(props) => props.theme.ICON_TINT};
	height: 16px;
	width: 16px;
`;

export const ContentTouchable = styled(WebTouchable)<ContentStyle>`
	${contentCss};
`;

export const ImageIcon = styled(Image)<{
	small?: boolean;
}>`
	width: ${(props) => (props.small ? 20 : 24)}px;
	height: ${(props) => (props.small ? 20 : 24)}px;
`;

export const VSpace = styled(View)`
	height: 5px;
`;

export const HSpace = styled(View)`
	width: 5px;
`;

export const Label = styled(Text)<{
	active?: boolean;
	disabled?: boolean;
}>`
	font-weight: bold;
	color: ${(props) =>
		props.disabled
			? props.theme.SUBTITLE
			: props.active
			? 'white'
			: props.theme.BUTTON_LABEL_COLOR};
`;

type CheckProps = {
	negative?: boolean;
};

const Check = styled(Image)<CheckProps>`
	height: 24px;
	width: 24px;
	align-self: center;
	margin-right: 10px;
	tint-color: white;
`;

export const Count = styled(Text)<{
	active?: boolean;
}>`
	color: ${(props) =>
		props.active ? 'white' : props.theme.BUTTON_LABEL_COLOR};
	opacity: 0.7;
	margin-left: 5px;
`;

export const IconRow = styled(View)`
	flex-direction: row;
	align-items: center;
`;

export const DuotoneIcon = styled(Image)`
	height: 24px;
	width: 24px;
`;

const RawIconRowLabel = styled(Text)`
	margin-left: 16px;
`;

export const IconRowLabel: React.FC<TextProps> = (props) => {
	const {style, children, ...otherProps} = props;
	return (
		<RawIconRowLabel {...otherProps} style={[uiKit.footnoteObject, style]}>
			{children}
		</RawIconRowLabel>
	);
};

export const CheckItem = ({
	active,
	children,
	negative = false,
	small = false,
	noCheck = false,
	...props
}: {
	active?: boolean;
	children?: ReactNode;
	negative?: boolean;
	small?: boolean;
	noCheck?: boolean;
} & TouchableOpacityProps) => {
	const appearance = useAppearance();
	return (
		<WebTouchable {...props}>
			<Base
				padded
				{...(active
					? {
							shadowOpacity: 1,
							shadowColor: 'rgba(0, 0, 0, 0.2)',
							shadowOffset: {width: 0, height: 0},
							shadowRadius: 5,
					  }
					: {})}
				style={
					active
						? {
								backgroundColor: negative ? Colors.Red : appearance.BLUE_TINT,
						  }
						: {}
				}
			>
				{children ? (
					<Content small={small} style={globalStyles.flex1}>
						{children}
					</Content>
				) : null}
				{noCheck ? null : active && !noCheck ? (
					<Check
						negative={negative}
						source={
							negative
								? require('../assets/clear.png')
								: require('../assets/check.png')
						}
					/>
				) : null}
			</Base>
		</WebTouchable>
	);
};

export const SideSpacing = styled(View)`
	padding-left: 12px;
	padding-right: 12px;
`;
