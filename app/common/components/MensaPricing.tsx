import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Label, Option, OptionContainer} from '../../../core/components/Options';
import {hapticFeedback} from '../../../core/functions/HapticFeedback';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {changePricing} from '../../../core/reducers/food';

export const MensaPricing = () => {
	const language = useLanguage();
	const pricing = useAppState((state) => state.food.pricing);
	const dispatch = useDispatch();
	return (
		<View>
			<OptionContainer>
				<Option
					active={pricing === 'student'}
					onPress={() => {
						hapticFeedback('impact');
						dispatch(changePricing('student'));
					}}
				>
					<Label active={pricing === 'student'}>
						{rawStrings.MENSA_PRICE_STUDENT[language]}
					</Label>
				</Option>
				<Option
					active={pricing === 'worker'}
					onPress={() => {
						hapticFeedback('impact');
						dispatch(changePricing('worker'));
					}}
				>
					<Label active={pricing === 'worker'}>
						{rawStrings.MENSA_PRICE_WORKER[language]}
					</Label>
				</Option>
				<Option
					onPress={() => {
						hapticFeedback('impact');
						dispatch(changePricing('external'));
					}}
					active={pricing === 'external'}
				>
					<Label active={pricing === 'external'}>
						{rawStrings.MENSA_PRICE_EXTERNAL[language]}
					</Label>
				</Option>
			</OptionContainer>
		</View>
	);
};
