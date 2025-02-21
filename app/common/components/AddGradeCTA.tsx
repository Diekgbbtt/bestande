import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {Colors} from '../../../core/functions/Colors';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {hideContent} from '../../../core/reducers/hiddenContent';
import {globalNavigate} from '../api/set-master-navigator';

const Container = styled(View)<{
	leftInset: number;
	rightInset: number;
}>`
	padding-left: ${(props) => props.leftInset + 12}px;
	padding-right: ${(props) => props.rightInset + 4}px;
	flex-direction: row;
	align-items: center;
	background-color: ${(props) => props.theme.BLUE_TINT};
`;

const Spacer = styled(View)`
	flex: 1;
`;

const Label = styled(Text)`
	padding-top: 16px;
	padding-bottom: 16px;
	font-weight: bold;
	color: white;
`;

const Button = styled(TouchableOpacity)<{
	secondary?: boolean;
}>`
	padding: 6px;
	border-radius: 2px;
	border-color: rgba(255, 255, 255, 0.4);
	border-width: 1px;
	background-color: ${(props) => (props.secondary ? 'transparent' : 'white')};
`;

const ButtonLabel = styled(Text)<{
	secondary?: boolean;
}>`
	font-weight: bold;
	color: ${(props) => (props.secondary ? 'white' : Colors.Blue)};
`;

const ButtonSpacer = styled(View)`
	width: 4px;
`;

export const AddGradeCTA = (props: {credit: Credit}) => {
	const safeArea = useSafeAreaInsets();
	const language = useLanguage();
	const institution = CreditHelpers.getInstitution(props.credit);
	const moduleId = getModuleId(props.credit);
	const id = `reminder-add-grade-${institution}-${moduleId}`;
	const dispatch = useDispatch();

	const hide = React.useCallback(() => {
		dispatch(hideContent(id));
	}, [dispatch, id]);
	return (
		<Container leftInset={safeArea.left} rightInset={safeArea.right}>
			<Label>{rawStrings.GRADES_OUT[language]}</Label>
			<Spacer />
			<Button
				onPress={() => {
					globalNavigate('CreditConfiguration', {
						credit: props.credit,
						showAddedIndicator: false,
					});
				}}
			>
				<ButtonLabel>{rawStrings.ENTER_GRADE_SHORT[language]}</ButtonLabel>
			</Button>
			<ButtonSpacer />
			<Button
				onPress={() => {
					hide();
				}}
				secondary
			>
				<ButtonLabel secondary>{rawStrings.LATER[language]}</ButtonLabel>
			</Button>
		</Container>
	);
};
