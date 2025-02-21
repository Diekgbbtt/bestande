import React from 'react';
import {ApiResponse} from '../../../core/reducers/api';
import {TabBadge, TabBadgeIcon, TabBadgeLabel} from './TabBadge';

export const StatsBadge = (props: {mod: ApiResponse}) => {
	if (!props.mod.gradeStatistics) {
		return null;
	}

	const {passed, failed} = props.mod.gradeStatistics;
	if (!failed && !passed) {
		return null;
	}

	return (
		<TabBadge>
			<TabBadgeIcon source={require('../assets/check.png')} />
			<TabBadgeLabel>
				{Math.round(
					((passed as number) /
						(((passed as number) + (failed as number)) as number)) *
						100
				)}
				%
			</TabBadgeLabel>
		</TabBadge>
	);
};
