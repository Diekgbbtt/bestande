import differenceInHours from 'date-fns/differenceInHours';
import format from 'date-fns/format';
import max from 'lodash/max';
import sum from 'lodash/sum';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {daysAndHoursLabel} from '../../app/common/api/days-and-hours-label';
import {apiRequest} from '../functions/api-request';
import {formatString} from '../functions/format-string';
import {renderSemester} from '../functions/render-semester';
import {globalStyles} from '../functions/styles';
import {mapToUniSlug} from '../functions/uni-slug';
import {useAppState} from '../functions/use-app-state';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import {Institution} from '../models/credit';
import rawStrings from '../raw-strings';
import {
	emptySingleExamReturnState,
	errorReceivingExamReturnStatistic,
	loadExamReturnStatistic,
	receiveExamReturnStatistic,
} from '../reducers/exam-returns';
import {ExpandedExamReturnStatistic} from '../types/types';
import {Bar} from './Bar';
import {SourceNumberText, StatisticSource} from './StatisticSource';
import {UnifiedProgress} from './UnifiedProgress';

const Container = styled(View)`
	padding: 12px;
`;

const Labels = styled(View)`
	margin-bottom: 5px;
	flex-direction: row;
	margin-top: 10px;
`;

const Headline = styled(Text)`
	font-size: 20px;
`;

const Row = styled(View)`
	flex-direction: row;
	margin-top: 1px;
	padding-right: 10px;
`;

export const ExamReturnStatistic = (props: {
	institution: Institution;
	uni_identifier: string;
	placeholderPeriod: string | number | null;
}) => {
	const appearance = useAppearance();
	const dispatch = useDispatch();
	const examReturnState = useAppState(
		(state) =>
			state.examReturns[props.institution]?.[props.uni_identifier] ??
			emptySingleExamReturnState
	);
	const language = useLanguage();
	const makeReq = React.useCallback(async () => {
		dispatch(loadExamReturnStatistic(props.uni_identifier, props.institution));
		try {
			const response = await apiRequest<{
				semesters: ExpandedExamReturnStatistic[];
			}>(
				`/institution/${mapToUniSlug(props.institution)}/module/${
					props.uni_identifier
				}/examreturns`
			);
			dispatch(
				receiveExamReturnStatistic(
					props.uni_identifier,
					props.institution,
					response.semesters
				)
			);
		} catch (e) {
			dispatch(
				errorReceivingExamReturnStatistic(
					props.uni_identifier,
					props.institution,
					e
				)
			);
		}
	}, [dispatch, props.institution, props.uni_identifier]);
	useEffect(() => {
		if (!examReturnState.data && !examReturnState.loading) {
			makeReq();
		}
	}, [examReturnState.data, examReturnState.loading, makeReq]);

	if (examReturnState.error) {
		return (
			<View style={{justifyContent: 'center'}}>
				<Text>
					{rawStrings.ERROR[language]}: {examReturnState.error.message}
				</Text>
			</View>
		);
	}

	if (examReturnState.loading) {
		return (
			<View style={{justifyContent: 'center'}}>
				<UnifiedProgress />
			</View>
		);
	}

	if (!examReturnState.data) {
		return null;
	}

	const maxDifference = max(
		examReturnState.data.map((d) =>
			differenceInHours(d.return_date, d.exam_date)
		)
	) as number;

	const average = Math.floor(
		(sum(
			examReturnState.data.map((d) =>
				differenceInHours(d.return_date, d.exam_date)
			)
		) as number) /
			Math.max(1, examReturnState.data.length) /
			24
	);

	let sourceIndex = 0;
	const sources = examReturnState.data.map((d) => {
		if (d.comment) {
			return {index: ++sourceIndex, title: d.comment};
		}

		if (!d.reporter) {
			return null;
		}

		return {
			index: ++sourceIndex,
			title: formatString(
				rawStrings.REPORTED_IN_BESTANDE_CHAT[language],
				format(d.exam_date, 'dd.MM'),
				format(d.return_date, 'dd.MM'),
				format(d.return_date, 'HH:mm'),
				d.reporter.username
			),
		};
	});

	return (
		<Container>
			<View>
				{average > 0 ? (
					<Headline
						style={{
							color: appearance.BLUE_TINT,
						}}
					>
						{average}{' '}
						{average === 1
							? rawStrings.DAY[language]
							: rawStrings.DAYS[language]}
					</Headline>
				) : null}
				{average === 0 ? (
					<Headline style={{color: appearance.SUBTITLE}}>-</Headline>
				) : null}
				<Text style={{color: appearance.SUBTITLE, marginTop: 1}}>
					{rawStrings.AVERAGE_EXAM_RETURN[language]}
				</Text>
				{examReturnState.data.length === 0 ? (
					<View>
						<Labels>
							{props.placeholderPeriod ? (
								<Text style={{color: appearance.TITLE}}>
									{renderSemester(props.placeholderPeriod, language)}
								</Text>
							) : null}
							<View style={globalStyles.flex1} />
							<Text style={{color: appearance.SUBTITLE}}>Unbekannt</Text>
						</Labels>
						<Bar ratio={0} color={appearance.BLUE_TINT} />
					</View>
				) : null}
				{examReturnState.data.map((semester, i) => {
					const difference = differenceInHours(
						semester.return_date,
						semester.exam_date
					);
					const source = sources[i];
					return (
						<View key={semester.period}>
							<Labels>
								<Text style={{color: appearance.TITLE}}>
									{renderSemester(semester.period, language)}
								</Text>
								{source ? (
									<SourceNumberText>{source.index})</SourceNumberText>
								) : null}
								<View style={globalStyles.flex1} />

								<Text style={{color: appearance.BLUE_TINT}}>
									{daysAndHoursLabel(
										semester.exam_date,
										semester.return_date,
										language
									)}
								</Text>
							</Labels>
							<Bar
								ratio={difference / maxDifference}
								color={appearance.BLUE_TINT}
							/>
						</View>
					);
				})}
			</View>
			<View style={{height: 8}} />
			{sources.map((s) => {
				if (!s) {
					return null;
				}

				return (
					<Row key={s?.index}>
						<StatisticSource style={{width: 15}}>{s.index})</StatisticSource>
						<StatisticSource>{s?.title}</StatisticSource>
					</Row>
				);
			})}
			<Text
				style={{
					fontSize: 13,
					color: appearance.SUBTITLE,
					marginTop: 10,
					marginBottom: 10,
				}}
			>
				{rawStrings.EXAM_RETURN_STAT_EXPLAINER[language]}
			</Text>
		</Container>
	);
};
