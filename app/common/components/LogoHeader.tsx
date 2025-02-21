import React from 'react';
import {Platform} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components/native';

const Icon = styled(Image)<{
	isLeft?: boolean;
}>`
	width: 20px;
	height: 27px;
	tint-color: white;
	margin-left: ${(props) => (props.isLeft ? 18 : 0)}px;
`;

const LogoHeader = (props: {onlyAndroid?: boolean; isLeft?: boolean}) => {
	if (props.onlyAndroid && Platform.OS !== 'android') {
		return null;
	}

	return <Icon source={require('../assets/icon-red.png')} {...props} />;
};

export default LogoHeader;
