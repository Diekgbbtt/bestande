import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {ModalCancelButton} from '../../../core/components/ModalCancelButton';
import {formatString} from '../../../core/functions/format-string';
import {renderSemester} from '../../../core/functions/render-semester';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {currentPeriod} from '../../../core/models/current-period';
import rawStrings from '../../../core/raw-strings';
import {hideContent} from '../../../core/reducers/hiddenContent';
import {globalNavigate} from '../api/set-master-navigator';

const Container = styled(View)`
	padding-top: 30px;
	padding-bottom: 10px;
	padding-left: 20px;
	padding-right: 20px;
	background-color: rgba(0, 0, 0, 0.03);
	justify-content: center;
	align-items: center;
`;

const Row = styled(View)`
	flex-direction: row;
`;

const Title = styled(Text)`
	font-weight: bold;
	text-align: center;
	font-size: 16px;
	color: ${(props) => props.theme.TITLE};
`;

const BadgeText = styled(Text)`
	color: ${(props) => props.theme.BLUE_TINT};
	font-weight: bold;
	border-width: 1px;
	border-radius: 3px;
	padding-left: 6px;
	padding-right: 6px;
	padding-top: 3px;
	padding-bottom: 3px;
	border-color: ${(props) => props.theme.BLUE_TINT};
`;

const Spacer = styled(View)`
	height: 10px;
`;

const Description = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	text-align: center;
`;

const ButtonRow = styled(View)`
	flex-direction: row;
`;

const VSpacer = styled(View)`
	width: 14px;
`;

export const AddCreditsReminder = () => {
	const appearance = useAppearance();
	const language = useLanguage();
	const dispatch = useDispatch();
	return (
		<Container>
			<Row>
				<BadgeText>{renderSemester(currentPeriod, 'de')}</BadgeText>
			</Row>
			<Spacer />
			<Title>
				{formatString(
					rawStrings.ADD_COURSES_FOR_X_SEMESTER[language],
					renderSemester(currentPeriod, language) as string
				)}
			</Title>
			<Spacer />
			<Description>{rawStrings.ADD_COURSES_WHY[language]}</Description>
			<ButtonRow>
				<ModalCancelButton
					color={appearance.BLUE_TINT}
					onPress={() => {
						globalNavigate('Search', {});
					}}
					label={rawStrings.ADD[language]}
				/>
				<VSpacer />
				<ModalCancelButton
					onPress={() => {
						dispatch(hideContent(`add-credits-${currentPeriod}`));
					}}
					color={appearance.SUBTITLE}
					label={rawStrings.NO_THANK_YOU[language]}
				/>
			</ButtonRow>
		</Container>
	);
};
