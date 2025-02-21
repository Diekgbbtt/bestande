import findIndex from 'lodash/findIndex';
import max from 'lodash/max';
import uniqBy from 'lodash/uniqBy';
import {transparentize} from 'polished';
import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {makeRequest} from '../actions/grade-statistics';
import {Colors} from '../functions/Colors';
import {CountsTowardsAverage} from '../functions/CountsTowardsAverage';
import {formatString} from '../functions/format-string';
import {thousands} from '../functions/format-thousands';
import {openLink} from '../functions/open-link';
import {renderSemester} from '../functions/render-semester';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import {Credit, Institution} from '../models/credit';
import rawStrings from '../raw-strings';
import {SemesterGradeStat, SingleGradeState} from '../types/grade-statistics';
import {Bar} from './Bar';
import {SourceNumberText, StatisticSource} from './StatisticSource';
import {UnifiedProgress} from './UnifiedProgress';

const Wrapper = styled(View)`
	padding-top: 8px;
	padding-bottom: 16px;
	padding-left: 12px;
	padding-right: 12px;
`;

const Labels = styled(View)`
	margin-bottom: 5px;
	flex-direction: row;
	margin-top: 10px;
`;

const Headline = styled(Text)`
	font-size: 20px;
	color: ${Colors.Green};
`;

const Context = styled(Text)`
	margin-top: 1px;
`;

const FixedWidthSection = styled(View)`
	height: 90px;
`;

const DistributionContainer = styled(View)`
	flex-direction: row;
	height: 8px;
	flex: 1;
	border-radius: 5px;
`;

const DistributionSegment = styled(View)<{
	value: number;
}>`
	height: 8px;
	flex: 1;
	border-right-width: 1px;
	border-radius: 2px;
	overflow: hidden;
`;

const StatContainer = styled(View)`
	flex: 1;
`;

const BigNumber = styled(Text)`
	font-size: 20px;
`;

const totalStudents = (gradeStatistics: SingleGradeState) => {
	const passed = gradeStatistics.stats?.total?.passed as number;
	const failed = gradeStatistics.stats?.total?.failed as number;
	return passed + failed;
};

const renderPercentage = (gradeStatistics: SingleGradeState): number => {
	const total = totalStudents(gradeStatistics);
	const passed = gradeStatistics.stats?.total?.passed as number;
	return Math.round((passed / total) * 100);
};

const CreditStatisticContent = (props: {gradeStatistics: SingleGradeState}) => {
	const appearance = useAppearance();
	const language = useLanguage();
	if (props.gradeStatistics.loading) {
		return (
			<FixedWidthSection>
				<UnifiedProgress />
			</FixedWidthSection>
		);
	}

	if (props.gradeStatistics.error) {
		return (
			<FixedWidthSection>
				<Context style={{color: appearance.SUBTITLE}}>
					{rawStrings.ERROR[language]}: {props.gradeStatistics.error.message}
				</Context>
			</FixedWidthSection>
		);
	}

	if (!props.gradeStatistics.stats) {
		return null; // e.g. ETH
	}

	if (props.gradeStatistics.stats.total.count === 0) {
		return (
			<FixedWidthSection>
				<Headline style={{color: appearance.SUBTITLE}}>
					{rawStrings.NO_STATS[language]}
				</Headline>
				<Context style={{color: appearance.SUBTITLE}}>
					{rawStrings.NO_STATS_COME_LATER[language]}
				</Context>
			</FixedWidthSection>
		);
	}

	const {total} = props.gradeStatistics.stats;
	return (
		<View>
			<Headline>
				{formatString(
					rawStrings.PERCENT_PASS_THIS[language],
					String(renderPercentage(props.gradeStatistics))
				)}
			</Headline>
			<Context style={{color: appearance.SUBTITLE}}>
				{formatString(
					rawStrings.OUT_OF_X_STUDENTS[language],
					thousands(String(totalStudents(props.gradeStatistics)), "'")
				)}
			</Context>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 10,
					marginBottom: 4,
					justifyContent: 'space-between',
				}}
			>
				<StatContainer>
					<Text style={{color: appearance.SUBTITLE}}>
						{rawStrings.AVERAGE[language]}
					</Text>
					<BigNumber style={{color: appearance.TITLE}}>
						{total.average ? total.average.toFixed(2) : '-'}
					</BigNumber>
				</StatContainer>
				<StatContainer style={{alignItems: 'center'}}>
					<Text style={{color: appearance.SUBTITLE}}>
						{rawStrings.MEDIAN[language]}
					</Text>
					<BigNumber style={{color: appearance.TITLE}}>
						{total.median ? total.median.toFixed(2) : '-'}
					</BigNumber>
				</StatContainer>
				<StatContainer style={{alignItems: 'flex-end'}}>
					<Text style={{color: appearance.SUBTITLE}}>
						{rawStrings.STD_DEVIATION[language]}
					</Text>
					<BigNumber style={{color: appearance.TITLE}}>
						{total.stddev ? total.stddev.toFixed(2) : '-'}
					</BigNumber>
				</StatContainer>
			</View>
		</View>
	);
};

const getSources = (gradeStatistics: SingleGradeState) => {
	const {stats} = gradeStatistics;
	if (!stats) {
		return [];
	}

	const sources = stats.detailed
		.map((stat) => [stat.source, stat.source_link, stat.comment])
		.filter((s) => s.filter((x) => Boolean(x)).length > 0);
	return uniqBy(sources, (s) => s.join(''));
};

const getNumberForSource = (
	gradeStatistics: SingleGradeState,
	source: string
): number => {
	return findIndex(getSources(gradeStatistics), (s) => s[0] === source) + 1;
};

const SourceNumber = (props: {
	gradeStatistics: SingleGradeState;
	stat: SemesterGradeStat;
}) => {
	const appearance = useAppearance();

	if (!props.stat.source) {
		return null;
	}

	return (
		<Text style={{color: appearance.SUBTITLE}}>
			{getNumberForSource(props.gradeStatistics, props.stat.source) + ')'}
		</Text>
	);
};

const RenderBar = (props: {
	stat: SemesterGradeStat;
	gradeStatistics: SingleGradeState;
}) => {
	const passedRatio =
		props.stat.passed / (props.stat.failed + props.stat.passed);
	const appearance = useAppearance();
	const language = useLanguage();
	return (
		<View key={props.stat.semester}>
			<Labels>
				<Text style={{color: appearance.TITLE}}>
					{renderSemester(props.stat.semester, language)}
				</Text>
				<SourceNumberText>
					<SourceNumber
						stat={props.stat}
						gradeStatistics={props.gradeStatistics}
					/>
				</SourceNumberText>
				<Text
					style={{
						textAlign: 'right',
						flex: 1,
						color: appearance.SUBTITLE,
					}}
				>
					n = {props.stat.passed + props.stat.failed}
					{'  '}⌀ = {props.stat.average}
				</Text>
			</Labels>
			<Bar ratio={passedRatio} color={Colors.Green} />
		</View>
	);
};

const BetterThanFact = (props: {
	credit?: Credit;
	gradeStatistics: SingleGradeState;
}) => {
	const appearance = useAppearance();
	const language = useLanguage();
	if (!props.credit?.grade) {
		return null;
	}

	const numberGrade = CountsTowardsAverage.parseGrade(props?.credit.grade);
	const distribution = props.gradeStatistics.stats?.distribution as number[];
	const distributionSector = numberGrade ? (numberGrade - 1) * 4 : null;
	let betterThan = 0;
	if (distributionSector) {
		for (let i = 0; i < distributionSector; i++) {
			betterThan += distribution[i];
		}

		if (distributionSector !== 20) {
			betterThan += distribution[distributionSector] / 2;
		}
	}

	const betterThanAbsolute = betterThan / distribution.reduce((a, b) => a + b);
	if (betterThanAbsolute < 0.5) {
		return null;
	}

	if (isNaN(betterThanAbsolute * 100)) {
		return null;
	}

	return (
		<View style={{marginTop: 15}}>
			<Text style={{color: appearance.SUBTITLE}}>
				{formatString(
					rawStrings.BETTER_THAN_PERCENT[language],
					String(Math.round(betterThanAbsolute * 100))
				)}
			</Text>
		</View>
	);
};

const nullCheck = (gradeStatistics: SingleGradeState) => {
	if (gradeStatistics.loading) {
		return null;
	}

	if (gradeStatistics.error) {
		return null;
	}

	if (!gradeStatistics.stats?.total) {
		return null;
	}

	return undefined;
};

const Distribution = (props: {
	gradeStatistics: SingleGradeState;
	credit?: Credit;
}) => {
	const appearance = useAppearance();
	const language = useLanguage();
	if (nullCheck(props.gradeStatistics) === null) {
		return null;
	}

	let distribution = props.gradeStatistics.stats?.distribution as number[];
	const maximum = max(distribution) as number;
	if (maximum > 0) {
		distribution = distribution.map((d) => d / maximum);
	}

	return (
		<View>
			<Labels>
				<Text style={{color: appearance.TITLE}}>
					{rawStrings.GRADE_DISTRIBUTION[language]}
				</Text>
			</Labels>
			<DistributionContainer>
				{distribution.map((d, i) => {
					return (
						<DistributionSegment
							// eslint-disable-next-line react/no-array-index-key
							key={i}
							style={{
								borderRightColor: appearance.BACKGROUND,
								backgroundColor: transparentize(1 - d, Colors.Green),
							}}
							value={d}
						/>
					);
				})}
			</DistributionContainer>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginTop: 10,
					paddingLeft: 1,
				}}
			>
				{[1, 2, 3, 4, 5, 6].map((i) => {
					return (
						<View key={i} style={{height: 10}}>
							<View
								style={{
									height: 8,
									width: 1,
									marginLeft: -1,
									backgroundColor: appearance.BORDER_COLOR,
									position: 'absolute',
								}}
							/>
						</View>
					);
				})}
			</View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingLeft: 1,
				}}
			>
				{[1, 2, 3, 4, 5, 6].map((i) => {
					return (
						<View key={i} style={{height: 10}}>
							<Text
								style={{
									position: 'absolute',
									marginLeft: -3,
									color: appearance.SUBTITLE,
									fontSize: 10,
								}}
							>
								{i}
							</Text>
						</View>
					);
				})}
			</View>
			{props.credit ? (
				<BetterThanFact
					credit={props.credit}
					gradeStatistics={props.gradeStatistics}
				/>
			) : null}
		</View>
	);
};

const Sources = (props: {gradeStatistics: SingleGradeState}) => {
	if (nullCheck(props.gradeStatistics) === null) {
		return null;
	}

	return (
		<View>
			{getSources(props.gradeStatistics).map(
				([source, source_link, comment], key) => {
					return (
						<React.Fragment key={source as string}>
							<View
								style={[
									{
										flexDirection: 'row',
										marginTop: 1,
									},

									key === 0 && {marginTop: 8},
								]}
							>
								<StatisticSource
									style={{
										width: 15,
										position: 'relative',
									}}
								>
									{key + 1})
								</StatisticSource>
								{source_link ? (
									<TouchableHighlight
										underlayColor="rgba(0, 0, 0, 0.1)"
										onPress={() => openLink(source_link)}
									>
										<StatisticSource style={{color: Colors.Blue}}>
											{source}
										</StatisticSource>
									</TouchableHighlight>
								) : (
									<StatisticSource>{source}</StatisticSource>
								)}
							</View>
							{comment ? (
								<StatisticSource style={{marginLeft: 15}}>
									{comment}
								</StatisticSource>
							) : null}
						</React.Fragment>
					);
				}
			)}
		</View>
	);
};

export const CreditStatistic = (props: {
	credit?: Credit;
	moduleId: string;
	institution: Institution;
	gradeStatistics: SingleGradeState;
}) => {
	const appearance = useAppearance();
	const language = useLanguage();
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (!props.gradeStatistics.stats) {
			dispatch(makeRequest(props.institution, props.moduleId));
		}
	}, [
		dispatch,
		props.credit,
		props.gradeStatistics.stats,
		props.institution,
		props.moduleId,
	]);

	if (props.gradeStatistics.error) {
		return null;
	}

	return (
		<View>
			<Wrapper style={{backgroundColor: appearance.BACKGROUND}}>
				<CreditStatisticContent gradeStatistics={props.gradeStatistics} />
				<View>
					{nullCheck(props.gradeStatistics) === null
						? null
						: props.gradeStatistics.stats?.detailed.map((stat) => {
								return (
									<RenderBar
										key={stat.semester}
										gradeStatistics={props.gradeStatistics}
										stat={stat}
									/>
								);
						  })}
					<Distribution
						gradeStatistics={props.gradeStatistics}
						credit={props.credit}
					/>
					<Sources gradeStatistics={props.gradeStatistics} />
				</View>
			</Wrapper>
			{props.gradeStatistics.loading ? null : (
				<TouchableHighlight
					underlayColor="rgba(0, 0, 0, 0.1)"
					onPress={() => openLink('https://bestande.ch/notenstatistiken')}
				>
					<Text
						style={{
							marginLeft: 12,
							fontSize: 13,
							color: appearance.SUBTITLE,
							marginTop: 10,
							marginBottom: 10,
						}}
					>
						<Text style={{color: appearance.BLUE_TINT}}>
							{rawStrings.MORE_INFOS[language]}
						</Text>{' '}
						{rawStrings.MORE_INFOS_GRADE_STAT[language]}
					</Text>
				</TouchableHighlight>
			)}
		</View>
	);
};
