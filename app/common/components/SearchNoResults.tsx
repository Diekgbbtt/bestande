import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {email as composeEmail} from 'react-native-communications';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {VSpace} from '../../../core/components/Base';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {formatString} from '../../../core/functions/format-string';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {StaticAddToModulesButton} from './StaticAddToModulesButton';

const Container = styled(View)`
	padding-left: 12px;
	padding-right: 12px;
	padding-top: 40px;
`;

const Title = styled(Text)`
	font-weight: bold;
	color: ${(props) => props.theme.TITLE};
	text-align: center;
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	text-align: center;
	line-height: 18px;
`;

const Link = styled(Text)`
	color: ${(props) => props.theme.BLUE_TINT};
`;

const Highlight = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

export const SearchNoResults = (props: {query: string}) => {
	const navigation = useNavigation();
	const language = useLanguage();

	return (
		<Container>
			<SafeSideSpace>
				<Title>{rawStrings.MODULE_NOT_FOUND_SEARCH[language]}</Title>
				<Label>
					<Highlight>{props.query}</Highlight>{' '}
					{rawStrings.MODULE_NOT_FOUND_DESCRIPTION[language]}{' '}
					<Link
						onPress={() => {
							composeEmail(['info@bestande.ch'], null, null, null, null);
						}}
					>
						info@bestande.ch
					</Link>
					.
				</Label>
				<VSpace />
				<VSpace />
				<VSpace />
				<VSpace />
				<VSpace />
				<Title>{rawStrings.ADD_MANUALLY[language]}</Title>
				<Label>
					{formatString(
						rawStrings.NOT_FOUND_ADD_MANUALLY_LABEL[language],
						props.query
					)}
				</Label>
				<VSpace />
				<VSpace />

				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<StaticAddToModulesButton
						onPress={() => {
							navigation.navigate('CreateCustomCredit', {
								name: props.query,
							});
						}}
					/>
				</View>
			</SafeSideSpace>
		</Container>
	);
};
