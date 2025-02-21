import React, {useCallback} from 'react';
import {TouchableHighlight, View} from 'react-native';
import {cannotNavigate} from '../../../core/functions/cannot-navigate';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {Credit} from '../../../core/models/credit';
import {globalNavigate} from '../api/set-master-navigator';
import {CreditCell} from './CreditCell';

export const CreditViewItem = (props: {credit: Credit}) => {
	const {credit} = props;
	const content = (
		<View>
			<CreditCell credit={credit} />
		</View>
	);
	const onPress = useCallback(() => {
		if (cannotNavigate(credit)) {
			return;
		}

		globalNavigate('CreditDetailView', {
			credit,
			moduleId: getModuleId(credit) as string,
			semester: CreditHelpers.getSemester(credit) as string,
			institution: CreditHelpers.getInstitution(credit),
			chatFirst: false,
		});
	}, [credit]);

	if (cannotNavigate(credit)) {
		return content;
	}

	return (
		<TouchableHighlight underlayColor="rgba(0, 0, 0, 0.1)" onPress={onPress}>
			{content}
		</TouchableHighlight>
	);
};
