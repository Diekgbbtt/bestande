import React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import styled from 'styled-components';
import {GREEN} from '../../../core/models/colors';

const Container = styled(View)`
	background-color: ${GREEN};
	padding: 4px;
	border-radius: 50px;
`;

const StyledSvg = styled(Svg)`
	height: 9px;
	width: 9px;
`;

export const VerifiedIcon = () => {
	return (
		<Container>
			<StyledSvg viewBox="0 0 512 512">
				<Path
					fill="white"
					d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
				/>
			</StyledSvg>
		</Container>
	);
};
