import React from 'react';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {UsernameAvailabilityReport} from '../../../core/actions/chat-server';
import {Colors} from '../../../core/functions/Colors';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const Label = styled(Text)`
	color: black;
`;

type Props = {
	report: UsernameAvailabilityReport;
};

export const UsernameAvailabilityView = (props: Props) => {
	const language = useLanguage();
	if (props.report.available) {
		return (
			<Label style={{color: Colors.Green}}>
				{rawStrings.USERNAME_AVAILABLE[language]} 🎉
			</Label>
		);
	}

	return (
		<Label style={{color: Colors.Red}}>
			{rawStrings.USERNAME_UNAVAILABLE[language]}
		</Label>
	);
};
