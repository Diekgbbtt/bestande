import React, {useMemo} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {cannotNavigate} from '../../../core/functions/cannot-navigate';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {doesCountTowardsAverage} from '../../../core/functions/does-count-towards-average';
import {doesCountTowardsCredit} from '../../../core/functions/does-count-towards-credit';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {Credit} from '../../../core/models/credit';
import {formatGrade} from '../api/format-grade';
import {isCreditBooked} from '../api/is-credit-booked';
import {CreditCellChatMessage} from './CreditCellChatMessage';
import {ModuleStatus} from './ModuleStatus';
import {NextEvent} from './NextEvent';

const Container = styled(View)`
	flex-direction: row;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const Content = styled(View)`
	padding-bottom: 10px;
	padding-top: 7px;
	padding-left: 12px;
	padding-right: 12px;
	flex: 1;
`;

const Subtitle = styled(View)`
	flex-direction: row;
	margin-top: 4px;
`;

const SubtitleElement = styled(View)`
	flex: 3;
`;

const SubtitleElementLabel = styled(Text)`
	color: #999;
	font-size: 13px;
`;

const SubtitleElementNarrow = styled(View)`
	flex: 1;
	flex-direction: row;
	margin-top: -4px;
`;

const ForeignUniversityLabel = styled(Text)`
	color: ${(props) => props.theme.COUNTS_INDICATOR_LEGEND};
	font-size: 12px;
	margin-left: 8px;
	font-weight: bold;
`;

const Avg = styled(Text)`
	color: #999;
	margin-top: 3px;
`;

const C = styled(Text)`
	margin-right: 5px;
	margin-top: 3px;
	color: #999;
	font-size: 13px;
`;

export const CreditCell: React.FC<{
	credit: Credit;
}> = ({credit}) => {
	const countsTowardsCredits = useAppState(
		(state) => state.countsTowardsCredits
	);
	const countsTowardsAverage = useAppState(
		(state) => state.countsTowardsAverage
	);
	const isHomeUniversity = useAppState(
		(state) =>
			state.institution.institution === CreditHelpers.getInstitution(credit)
	);
	const countsCredits = doesCountTowardsCredit(countsTowardsCredits, credit);
	const countsAvg = doesCountTowardsAverage(
		countsTowardsCredits,
		countsTowardsAverage,
		credit
	);
	const appearance = useAppearance();

	const titleStyle = useMemo(
		() => [uiKit.subheadEmphasizedObject, {color: appearance.TITLE}],
		[appearance.TITLE]
	);

	return (
		<Container>
			<Content>
				<Text style={titleStyle}>
					{credit.short_name}
					{isHomeUniversity ? null : (
						<ForeignUniversityLabel>
							{' '}
							{credit.institution}
						</ForeignUniversityLabel>
					)}
				</Text>
				{cannotNavigate(credit) ? null : (
					<NextEvent
						detailView={false}
						credit={credit}
						semester={CreditHelpers.getSemester(credit) as string}
					/>
				)}
				{isCreditBooked(credit) ? (
					<CreditCellChatMessage credit={credit} />
				) : null}
				<Subtitle>
					<ModuleStatus status={credit.status} />
					<SubtitleElement>
						<SubtitleElementLabel>
							{credit.credits_worth
								? `${parseFloat(String(credit.credits_worth))} ECTS`
								: null}{' '}
						</SubtitleElementLabel>
					</SubtitleElement>
					<SubtitleElement>
						<SubtitleElementLabel>
							{formatGrade(credit.grade)}
						</SubtitleElementLabel>
					</SubtitleElement>
					<SubtitleElementNarrow>
						{countsCredits && (
							<View key="check">
								<C>{'c'}</C>
							</View>
						)}
						{countsAvg && <Avg key="avg">{'⌀'}</Avg>}
					</SubtitleElementNarrow>
				</Subtitle>
			</Content>
		</Container>
	);
};
