import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Label, Option, OptionContainer} from '../../../core/components/Options';
import {hapticFeedback} from '../../../core/functions/HapticFeedback';
import {useLanguage} from '../../../core/functions/use-language';
import {setSelectedLanguage} from '../../../core/reducers/language';

export const LanguageSwitcher = () => {
	const language = useLanguage();
	const dispatch = useDispatch();
	return (
		<View>
			<OptionContainer>
				<Option
					active={language === 'de'}
					onPress={async () => {
						hapticFeedback('impact');
						dispatch(setSelectedLanguage('de'));
						await AsyncStorage.setItem('preferredLanguage', 'de');
					}}
				>
					<Label active={language === 'de'}>Deutsch</Label>
				</Option>
				<Option
					active={language === 'en'}
					onPress={async () => {
						hapticFeedback('impact');
						dispatch(setSelectedLanguage('en'));
						await AsyncStorage.setItem('preferredLanguage', 'en');
					}}
				>
					<Label active={language === 'en'}>English</Label>
				</Option>
			</OptionContainer>
		</View>
	);
};
