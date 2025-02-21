import React from 'react';
import {ImageURISource, View} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components/native';

const MensaInfoContainer = styled(View)`
	flex-direction: row;
	align-items: center;
`;

const MensaInfoIcon = styled(Image)<{
	color?: string;
}>`
	width: 16px;
	height: 16px;
	margin-right: 6px;
	tint-color: ${(props) => props.color || props.theme.SUBTITLE};
`;

export const MensaInfo = (props: {
	color?: string;
	source: ImageURISource;
	children: any;
	style?: any;
}) => {
	const {color, source, children, ...otherProps} = props;
	return (
		<MensaInfoContainer {...otherProps}>
			<MensaInfoIcon color={color} source={source} />
			{children}
		</MensaInfoContainer>
	);
};

export default MensaInfo;
