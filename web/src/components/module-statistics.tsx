import React from 'react';
import styled from 'styled-components';
import {CreditStatistic} from '../../../core/components/CreditStatistic';
import {ExamReturnStatistic} from '../../../core/components/ExamReturnStatistic';
import {mobile} from '../../../core/components/layout/responsive';
import {useWebState} from '../../../core/functions/use-app-state';
import {ApiResponse} from '../../../core/reducers/api';
import {SingleGradeState} from '../../../core/types/grade-statistics';
import {makeKey} from '../reducers/grade-statistics';
import {sortSemesters} from './did-course-change-instructors-since-review';
import {Spinner} from './spinner';

const Stats = styled.div`
	display: flex;
	flex-direction: row;
	padding-bottom: 40px;
	${mobile`
		display: block;
	`};
`;

const StatHalf = styled.div`
	flex: 1;
`;

export const ModuleStatistics: React.FC<{
	module: ApiResponse;
}> = ({module}) => {
	const stats = useWebState((state) => state.gradeStatistics[makeKey(module)]);
	if (!stats) {
		return null;
	}

	const statsState = stats;
	const {error, loading} = statsState;
	if (loading) {
		return (
			<div>
				<Spinner />
			</div>
		);
	}

	if (error) {
		return <div>Fehler: {error.message}</div>;
	}

	if (!statsState.stats) {
		return null;
	}

	return (
		<Stats style={{paddingTop: 20}}>
			<StatHalf>
				{statsState ? (
					<CreditStatistic
						gradeStatistics={stats as SingleGradeState}
						moduleId={module.uni_identifier}
						institution={module.university}
					/>
				) : null}
			</StatHalf>
			<StatHalf>
				<ExamReturnStatistic
					institution={module.university}
					uni_identifier={module.uni_identifier}
					placeholderPeriod={sortSemesters(module.semesters)[0].period}
				/>
			</StatHalf>
		</Stats>
	);
};
