import React, {useCallback, useMemo} from 'react';
import {Switch, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {changeModuleCountsTowardsCredits} from '../../../core/actions/countsTowardsCredits';
import {Base, Content, Label} from '../../../core/components/Base';
import {Colors} from '../../../core/functions/Colors';
import {
	canCountTowardsCredits,
	doesCountTowardsCredit,
} from '../../../core/functions/does-count-towards-credit';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';

export const CountsTowardsCreditsCellContainer: React.FC<{
	credit: Credit;
}> = ({credit}) => {
	const dispatch = useDispatch();
	const counts = useAppState((state) =>
		doesCountTowardsCredit(state.countsTowardsCredits, credit)
	);
	const onChange = useCallback(
		(newCounts: boolean) => {
			dispatch(changeModuleCountsTowardsCredits(credit, newCounts));
		},
		[credit, dispatch]
	);
	const onValueChange = useCallback(
		(value: boolean) => {
			onChange(value);
		},
		[onChange]
	);
	const canCount = useMemo(() => canCountTowardsCredits(credit), [credit]);
	const language = useLanguage();
	return (
		<Base padded>
			<Content>
				<Label>{rawStrings.COUNTS_TOWARDS_CREDITS[language]}</Label>
			</Content>
			<View style={globalStyles.flex1} />
			<Switch
				// @ts-expect-error
				trackColor={{true: Colors.Green, false: null}}
				style={{alignSelf: 'center'}}
				value={counts}
				disabled={!canCount}
				onValueChange={onValueChange}
			/>
		</Base>
	);
};
