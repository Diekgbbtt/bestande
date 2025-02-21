import React from 'react';
import {
	ScrollView,
	TextProps,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Colors} from '../functions/Colors';
import {uiKit} from '../functions/ui-kit';
import {useAppearance} from '../functions/use-appearance';

export const Container = styled(View)`
	background-color: white;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding-top: 10px;
	padding-bottom: 10px;
	border-bottom-color: rgba(0, 0, 0, 0.1);
	border-bottom-width: 1px;
`;

export const LabelArea = styled(ScrollView).attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false,
})`
	flex: 1;
`;

const TagContainer = styled(View)<{
	active?: boolean;
	negative?: boolean;
}>`
	background-color: ${(props) =>
		props.active
			? props.negative
				? Colors.Red
				: Colors.Green
			: props.theme.TAG_BACKGROUND};
	padding: 6px 10px;
	border-radius: 10px;
	flex-direction: row;
`;

const RawTagLabel = styled(Text)<{
	active?: boolean;
}>``;

const TagLabel: React.FC<TextProps & {active: boolean}> = (props) => {
	const {style, children, ...otherProps} = props;
	const appearance = useAppearance();
	return (
		<RawTagLabel
			{...otherProps}
			style={[
				uiKit.bodyEmphasizedObject,
				{
					color: props.active ? 'white' : appearance.BUTTON_LABEL_COLOR,
					fontSize: 14,
				},
				style,
			]}
		>
			{children}
		</RawTagLabel>
	);
};

const RawFilterValue = styled(Text)``;

export const FilterValue: React.FC<TextProps & {active?: boolean}> = (
	props
) => {
	const {style, children, ...otherProps} = props;
	const appearance = useAppearance();
	return (
		<RawFilterValue
			{...otherProps}
			style={[
				uiKit.bodyObject,
				{
					color: props.active ? 'white' : appearance.BUTTON_LABEL_COLOR,
					fontSize: 14,
					fontWeight: 'normal',
				},
				style,
			]}
		>
			{children}
		</RawFilterValue>
	);
};

type TagProps = TouchableOpacityProps & {
	active?: boolean;
	children?: React.ReactNode;
	noTouchable?: boolean;
	negative?: boolean;
};

export const Tag = ({
	active = false,
	children,
	noTouchable,
	negative = false,
	...otherProps
}: TagProps) => {
	const inner = (
		<TagContainer active={active} negative={negative}>
			<TagLabel active={active}>{children}</TagLabel>
		</TagContainer>
	);
	if (noTouchable) {
		return inner;
	}

	return <TouchableOpacity {...otherProps}>{inner}</TouchableOpacity>;
};
