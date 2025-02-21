import React, {useCallback} from 'react';
import {Switch, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {changeModuleCountsTowardsAverage} from '../../../core/actions/countsTowardsAverage';
import {Base, Content, Label} from '../../../core/components/Base';
import {canCountTowardsAverage} from '../../../core/functions/can-count-towards-average';
import {Colors} from '../../../core/functions/Colors';
import {doesCountTowardsAverage} from '../../../core/functions/does-count-towards-average';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';

export const CountsTowardsAverageCellContainer: React.FC<{
	credit: Credit;
}> = ({credit}) => {
	const language = useLanguage();
	const counts = useAppState((state) =>
		doesCountTowardsAverage(
			state.countsTowardsCredits,
			state.countsTowardsAverage,
			credit
		)
	);
	const dispatch = useDispatch();

	const change = useCallback(
		(newCounts: boolean) => {
			dispatch(changeModuleCountsTowardsAverage(credit, newCounts));
		},
		[dispatch, credit]
	);
	return (
		<Base padded>
			<Content>
				<Label>{rawStrings.COUNTS_TOWARDS_AVERAGE[language]}</Label>
			</Content>
			<View style={globalStyles.flex1} />
			<Switch
				// @ts-expect-error
				trackColor={{true: Colors.Green, false: null}}
				style={{alignSelf: 'center'}}
				value={counts}
				disabled={!canCountTowardsAverage(credit)}
				onValueChange={(bool) => change(bool)}
			/>
		</Base>
	);
};
