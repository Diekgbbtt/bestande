import React from 'react';
import {View} from 'react-native';
import {Label, Option, OptionContainer} from '../../../core/components/Options';
import {Colors} from '../../../core/functions/Colors';
import {useLanguage} from '../../../core/functions/use-language';
import {CreditStatus} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';

export const ModuleStatusToggle = (props: {
	status: CreditStatus;
	setStatus: (status: CreditStatus) => void;
}) => {
	const language = useLanguage();
	return (
		<View>
			<OptionContainer>
				<Option
					activeColor={
						props.status === 'CONTINUE' ? Colors.Purple : Colors.Blue
					}
					active={
						props.status === 'BOOKED' ||
						props.status === 'ADDED' ||
						props.status === 'CONTINUE'
					}
					onPress={() => {
						props.setStatus('ADDED');
					}}
				>
					<Label
						active={
							props.status === 'BOOKED' ||
							props.status === 'ADDED' ||
							props.status === 'CONTINUE'
						}
					>
						{
							rawStrings[
								props.status === 'BOOKED' ||
								props.status === 'ADDED' ||
								props.status === 'CONTINUE'
									? props.status
									: 'ADDED'
							][language]
						}
					</Label>
				</Option>
				<Option
					activeColor={Colors.Green}
					active={props.status === 'PASSED'}
					onPress={() => {
						props.setStatus('PASSED');
					}}
				>
					<Label active={props.status === 'PASSED'}>
						{rawStrings.PASSED[language]}
					</Label>
				</Option>
				<Option
					activeColor={Colors.Red}
					active={props.status === 'FAILED'}
					onPress={() => {
						props.setStatus('FAILED');
					}}
				>
					<Label active={props.status === 'FAILED'}>
						{rawStrings.FAILED[language]}
					</Label>
				</Option>
			</OptionContainer>
		</View>
	);
};
