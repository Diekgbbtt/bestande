import {useActionSheet} from '@expo/react-native-action-sheet';
import React from 'react';
import {Image} from 'react-native-normalized';
import styled from 'styled-components/native';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {globalNavigate} from '../api/set-master-navigator';
import {HeaderButton} from './HeaderButton';

const Icon = styled(Image)`
	width: 24px;
	height: 24px;
	tint-color: white;
`;

export const AddModuleButton: React.FC = () => {
	const language = useLanguage();
	const credits = useAppState((state) => getVisibleCredits(state));
	const actionSheet = useActionSheet();
	if (!credits.length) {
		return null;
	}

	const icon = require('../assets/add.png');

	const searchForCourseLabel = rawStrings.SEARCH_COURSE[language];
	const addManually = rawStrings.ADD_MANUALLY[language];
	const cancelLabel = rawStrings.CANCEL[language];
	const options = [searchForCourseLabel, addManually, cancelLabel];
	return (
		<HeaderButton
			onPress={() => {
				actionSheet.showActionSheetWithOptions(
					{options, cancelButtonIndex: options.indexOf(cancelLabel)},
					(buttonIndex) => {
						if (options[buttonIndex] === searchForCourseLabel) {
							globalNavigate('Search', {});
						}

						if (options[buttonIndex] === addManually) {
							globalNavigate('CreateCustomCredit', {
								name: '',
							});
						}
					}
				);
			}}
		>
			<Icon source={icon} />
		</HeaderButton>
	);
};
