import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {getCorrelationHue} from '../functions/get-passed-hue';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import {AppLanguage} from '../models/app-language';
import rawStrings from '../raw-strings';
import ProgressCircle from './ProgressCircle';

const Container = styled(View)`
	flex-direction: row;
	align-items: center;
	padding: 8px;
`;

const getLabel = (correlation: number, language: AppLanguage) => {
	if (correlation > 70) {
		return rawStrings.VERY_HIGH_CORRELATION[language];
	}

	if (correlation > 50) {
		return rawStrings.HIGH_CORRELATION[language];
	}

	if (correlation > 20) {
		return rawStrings.MEDIUM_CORRELATION[language];
	}

	return rawStrings.LOW_CORRELATION[language];
};

export const Correlation = ({
	count,
	totalCount,
	pie = false,
}: {
	count: number;
	totalCount: number;
	pie?: boolean;
}) => {
	const countRoundedDown = Math.min(totalCount, 300);
	const correlation = Math.min((count / countRoundedDown) * 100, 100);
	const color = getCorrelationHue(correlation / 100, 45);
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<Container>
			<ProgressCircle
				percent={correlation}
				radius={10}
				borderWidth={10}
				color={color}
				bgColor={appearance.BAR_BACKGROUND}
				shadowColor={appearance.BAR_BACKGROUND}
			/>
			{pie ? null : (
				<React.Fragment>
					<View style={{width: 10}} />
					<Text style={{color, fontWeight: 'bold', fontSize: 12}}>
						{getLabel(correlation, language)}
					</Text>
				</React.Fragment>
			)}
		</Container>
	);
};
