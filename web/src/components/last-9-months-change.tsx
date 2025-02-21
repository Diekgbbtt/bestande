import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {Path, Svg} from 'react-native-svg';
import styled from 'styled-components/native';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const Container = styled(View)`
	margin-top: 20px;
	font-size: 14px;
	padding-left: 14px;
	padding-right: 14px;
`;

const ChartLineUp = () => {
	const appearance = useAppearance();

	return (
		<Svg
			color={appearance.SUBTITLE}
			style={{
				height: 14,
				width: 14,
				transform: [
					{
						translateY: 2,
					},
				],
				position: 'relative',
				marginRight: 6,
			}}
			viewBox="0 0 512 512"
		>
			<Path
				fill="currentColor"
				d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"
			/>
		</Svg>
	);
};

const ChartLineDown = () => {
	const appearance = useAppearance();

	return (
		<Svg
			color={appearance.SUBTITLE}
			style={{
				height: 14,
				width: 14,
				transform: [
					{
						translateY: 2,
					},
				],
				position: 'relative',
				marginRight: 6,
			}}
			viewBox="0 0 512 512"
		>
			<Path
				fill="currentColor"
				d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm-16-80V185.94c0-21.38-25.85-32.09-40.97-16.97l-32.4 32.4-96-96c-12.5-12.5-32.76-12.5-45.25 0L192 178.75l-46.06-46.06c-6.25-6.25-16.38-6.25-22.63 0l-22.62 22.62c-6.25 6.25-6.25 16.38 0 22.63l68.69 68.69c12.5 12.5 32.76 12.5 45.25 0L288 173.25l73.38 73.38-32.4 32.4c-15.12 15.12-4.41 40.97 16.97 40.97H464c8.84 0 16-7.17 16-16z"
			/>
		</Svg>
	);
};

export const Last9MonthsChange: React.FC<{
	previousAverage: number | null;
	average: number | null;
}> = ({previousAverage, average}) => {
	const appearance = useAppearance();
	const language = useLanguage();
	if (!previousAverage || !average || Number.isNaN(average)) {
		return null;
	}

	const nowRounded = Math.round(average * 10) / 10;
	const prevRounded = Math.round(previousAverage * 10) / 10;
	const better = nowRounded > prevRounded;
	return (
		<Container>
			{previousAverage && average ? (
				<View>
					<Text style={{color: appearance.SUBTITLE}}>
						{better ? <ChartLineUp /> : <ChartLineDown />}{' '}
						{rawStrings.CHANGE_9_MONTHS[language]} {prevRounded.toFixed(1)} →{' '}
						{nowRounded.toFixed(1)}
					</Text>
				</View>
			) : null}
		</Container>
	);
};
