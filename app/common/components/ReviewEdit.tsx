import React, {useCallback, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';
import {Colors} from '../../../core/functions/Colors';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {Rater} from './Rater';

const Container = styled(TouchableOpacity)`
	padding-top: 4px;
	padding-bottom: 6px;
	justify-content: center;
`;

const Icon = styled(Image)`
	tint-color: ${Colors.Orange};
	height: ${20.52}px;
	width: 18px;
`;

const Row = styled(View)`
	flex-direction: row;
`;

const Label = styled(Text)`
	color: ${Colors.Orange};
	margin-left: 10px;
`;

export const ReviewEdit: React.FC<{
	_id: string;
	credit: Credit;
}> = ({_id, credit}) => {
	const [showRater, setShowRater] = useState(false);
	const rating = useAppState((state) => state.ratings[_id]);
	const language = useLanguage();

	const hide = useCallback(() => {
		setShowRater(false);
	}, []);

	const show = useCallback(() => {
		setShowRater(true);
	}, []);

	return (
		<Container onPress={show}>
			<Row
				style={{
					justifyContent: 'center',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<Icon source={require('../assets/edit.png')} />
				<Label>{rawStrings.EDIT[language]}</Label>
				<Rater
					_id={rating?._id as string}
					credit={credit}
					editMode
					visible={showRater}
					onCancel={hide}
				/>
			</Row>
		</Container>
	);
};
