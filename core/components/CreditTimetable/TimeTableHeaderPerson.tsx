import React, {useCallback} from 'react';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {mapToUniSlug} from '../../functions/uni-slug';
import {useNavigationInNative} from '../../functions/useNavigationInNative';
import {getNameWithoutTitle, personGetUrl} from '../../models/person';
import {RawPerson} from '../../types/schedule';
import {Row} from '../Primitives';
import {UniversalLink} from '../UniversalLink';

const PersonContainer = styled(Row)`
	align-items: center;
	padding-top: 3px;
	padding-bottom: 3px;
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 13px;
`;

const PersonIcon = styled(Image)`
	height: 14px;
	width: 14px;
	margin-right: 4px;
	tint-color: ${(props) => props.theme.SUBTITLE};
`;

export const TimetableHeaderPerson = ({person}: {person: RawPerson}) => {
	const navigation = useNavigationInNative();

	const onPress = useCallback(() => {
		navigation.navigate('PersonView', {
			unislug: mapToUniSlug(person.university),
			uni_identifier: person.uni_identifier,
		});
	}, [navigation, person]);

	return (
		<UniversalLink webLink={personGetUrl(person)} nativeOnPress={onPress}>
			<PersonContainer>
				<PersonIcon source={require('../../assets/person.png')} />
				<Label>{getNameWithoutTitle(person)}</Label>
			</PersonContainer>
		</UniversalLink>
	);
};
