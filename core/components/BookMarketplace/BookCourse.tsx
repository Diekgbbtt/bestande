import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {formatString} from '../../functions/format-string';
import {getCredit} from '../../functions/get-credit';
import {useAppState} from '../../functions/use-app-state';
import {useLanguage} from '../../functions/use-language';
import {Institution} from '../../models/credit';
import rawStrings from '../../raw-strings';

const Label = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	margin-bottom: 4px;
	font-size: 13px;
`;

export const BookCourse: React.FC<{
	uni_identifier: string;
	institution: Institution;
}> = ({institution, uni_identifier}) => {
	const credit = useAppState((s) =>
		getCredit(s, uni_identifier, null, institution)
	);
	const language = useLanguage();

	return (
		<View>
			<Label>
				{formatString(rawStrings.BOOKS_FOR[language], credit.short_name)}
			</Label>
		</View>
	);
};
