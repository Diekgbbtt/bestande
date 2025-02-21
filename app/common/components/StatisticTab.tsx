import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {CreditStatistic} from '../../../core/components/CreditStatistic';
import {ExamReturnStatistic} from '../../../core/components/ExamReturnStatistic';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {Credit} from '../../../core/models/credit';
import {SingleGradeState} from '../../../core/types/grade-statistics';

const Container = styled(ScrollView)`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

export const StatisticTab: React.FC<{
	credit: Credit;
	moduleId: string;
	gradeStatistics: SingleGradeState;
	newestSemester: string | null;
}> = ({credit, gradeStatistics, moduleId, newestSemester}) => {
	return (
		<Container>
			<SafeSideSpace>
				<CreditStatistic
					credit={credit}
					moduleId={moduleId}
					institution={CreditHelpers.getInstitution(credit)}
					gradeStatistics={gradeStatistics}
				/>

				<ExamReturnStatistic
					institution={CreditHelpers.getInstitution(credit)}
					uni_identifier={moduleId}
					placeholderPeriod={newestSemester}
				/>
			</SafeSideSpace>
		</Container>
	);
};
