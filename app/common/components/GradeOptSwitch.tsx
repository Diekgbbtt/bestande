import React from 'react';
import {Switch, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Base, Content, Label} from '../../../core/components/Base';
import {Colors} from '../../../core/functions/Colors';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {persistOptedInSetting} from '../../../core/logic/grade-opt/persistance';
import {setOptedIn} from '../../../core/logic/grade-opt/reducer';
import rawStrings from '../../../core/raw-strings';

export const GradeOptSwitch = () => {
	const language = useLanguage();
	const optedIn = useAppState((s) => s.gradeOpt.optedIn);

	const dispatch = useDispatch();

	return (
		<Base padded>
			<Content>
				<Label>{rawStrings.OPT_INTO_GRADES[language]}</Label>
			</Content>
			<View style={globalStyles.flex1} />
			<Switch
				// @ts-expect-error
				trackColor={{true: Colors.Green, false: null}}
				style={{alignSelf: 'center'}}
				disabled={!optedIn}
				value={optedIn}
				onValueChange={(b) => {
					dispatch(setOptedIn(b));
					persistOptedInSetting(b);
				}}
			/>
		</Base>
	);
};
