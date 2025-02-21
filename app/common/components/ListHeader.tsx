import React, {ReactElement} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {globalStyles} from '../../../core/functions/styles';
import {useAppearance} from '../../../core/functions/use-appearance';

const Container = styled(View)`
	padding-top: 5px;
	padding-bottom: 5px;
	flex-direction: row;
	justify-content: center;
`;

const Label = styled(Text)`
	font-weight: bold;
`;

const RightLabel = styled(Text)`
	color: gray;
	align-self: flex-end;
	font-size: 12px;
	margin-top: -2px;
	position: relative;
`;

export const ListHeader = (props: {
	children: ReactElement | string;
	right?: string | ReactElement;
}) => {
	const {left, right} = useSafeAreaInsets();
	const appearance = useAppearance();
	return (
		<Container
			style={{
				backgroundColor: appearance.SECTION_HEADER_BACKGROUND,
				paddingLeft: left + 12,
				paddingRight: right + 12,
			}}
		>
			<Label style={{color: appearance.TITLE}}>{props.children}</Label>
			<View style={globalStyles.flex1} />
			{props.right ? (
				<RightLabel style={{color: appearance.SUBTITLE}}>
					{props.right}
				</RightLabel>
			) : null}
		</Container>
	);
};
