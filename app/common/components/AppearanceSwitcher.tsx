import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Label, Option, OptionContainer} from '../../../core/components/Options';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {setPreferredAppearance} from '../../../core/reducers/appearance';

export const AppearanceSwitcher = () => {
	const mode = useAppState((state) => state.appearance.preference);
	const language = useLanguage();
	const dispatch = useDispatch();
	return (
		<View>
			<OptionContainer>
				<Option
					active={mode === 'auto'}
					onPress={() => {
						dispatch(setPreferredAppearance('auto'));
					}}
				>
					<Label active={mode === 'auto'}>
						{rawStrings.APPEARANCE_AUTO[language]}
					</Label>
				</Option>
				<Option
					active={mode === 'explicit-light'}
					onPress={() => {
						dispatch(setPreferredAppearance('explicit-light'));
					}}
				>
					<Label active={mode === 'explicit-light'}>
						{rawStrings.APPEARANCE_LIGHT[language]}
					</Label>
				</Option>
				<Option
					active={mode === 'explicit-dark'}
					onPress={() => {
						dispatch(setPreferredAppearance('explicit-dark'));
					}}
				>
					<Label active={mode === 'explicit-dark'}>
						{rawStrings.APPEARANCE_DARK[language]}
					</Label>
				</Option>
			</OptionContainer>
		</View>
	);
};
