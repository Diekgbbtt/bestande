import max from 'lodash/max';
import React from 'react';
import {View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {globalStyles} from '../../../core/functions/styles';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const RatingContainer = styled(View)`
	flex-direction: row;
	align-items: center;
	padding: 12px;
	padding-bottom: 0;
`;

const BarContainer = styled(View)`
	flex-direction: row;
	align-items: center;
`;

const BarBackground = styled(View)`
	height: 5px;
	border-radius: 4px;
	flex: 1;
`;

const StarContainer = styled(View)`
	flex-direction: row;
	margin-right: 8px;
`;

const ScoreType = styled(Text)`
	margin-right: 8px;
	align-self: center;
`;

const Star = styled(Image)<{
	invisible?: boolean;
}>`
	width: 12px;
	height: 12px;
	opacity: ${(props) => (props.invisible ? 1 : 0)};
`;

const BarFill = styled(View)<{
	fill: number;
}>`
	height: 5px;
	border-radius: 4px;
	width: ${(props) => props.fill * 100}%;
`;

const StarsNextToBar = (props: {stars: number}) => (
	<StarContainer>
		{new Array(5).fill(1).map((k, i) => {
			return (
				<Star
					// eslint-disable-next-line react/no-array-index-key
					key={i}
					invisible={props.stars < i + 2}
					source={require('../assets/star-full.png')}
				/>
			);
		})}
	</StarContainer>
);

const StarView = (props: {overview: {[key: number]: number}}) => {
	const highestNoOfScore = max(
		Object.keys(props.overview).map((ov) => props.overview[Number(ov)])
	) as number;
	const appearance = useAppearance();
	return (
		<View style={globalStyles.flex1}>
			{new Array(5).fill(1).map((k, i) => {
				const fill = props.overview[5 - i] / highestNoOfScore;
				/* eslint-disable react/no-array-index-key */
				return (
					<BarContainer key={i}>
						<StarsNextToBar stars={i + 1} />
						<BarBackground style={{backgroundColor: appearance.BAR_BACKGROUND}}>
							<BarFill
								fill={fill}
								style={{backgroundColor: appearance.BAR_FILL}}
							/>
						</BarBackground>
					</BarContainer>
				);
				/* eslint-enable react/no-array-index-key */
			})}
		</View>
	);
};

const Centered = styled(View)`
	justify-content: center;
	align-items: center;
`;

const Score = (props: {score: number; total: number}) => {
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<Centered>
			<ScoreType
				style={[uiKit.largeTitleEmphasizedObject, {color: appearance.TITLE}]}
			>
				{props.score ? props.score.toFixed(1) : '-'}
			</ScoreType>
			<Text style={[uiKit.caption2EmphasizedObject, {color: appearance.TITLE}]}>
				{props.total}{' '}
				{props.total === 1
					? rawStrings.RATING[language]
					: rawStrings.RATINGS[language]}
			</Text>
			<Text style={[uiKit.caption2EmphasizedObject, {color: appearance.TITLE}]}>
				({rawStrings.LAST_9_MONTHS[language]})
			</Text>
		</Centered>
	);
};

const RatingOverview = React.memo(
	(props: {
		average: number;
		total: number;
		overview: {[key: number]: number};
	}) => {
		const appearance = useAppearance();

		return (
			<RatingContainer style={{backgroundColor: appearance.BACKGROUND}}>
				<Score score={props.average} total={props.total} />
				<StarView overview={props.overview} />
			</RatingContainer>
		);
	}
);

export default RatingOverview;
