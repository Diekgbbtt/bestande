import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {TextInput} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {v4 as uuid} from 'uuid';
import {CheckItem, Label, VSpace} from '../../../core/components/Base';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {Colors} from '../../../core/functions/Colors';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {nextPeriod, previousPeriod} from '../../../core/functions/validate-period';
import {CreditStatus} from '../../../core/models/credit';
import {currentPeriod} from '../../../core/models/current-period';
import rawStrings from '../../../core/raw-strings';
import {addCustomCredit, CustomCredit} from '../../../core/reducers/customCredits';
import {CountsTowardsAverageCellContainer} from './CountsTowardsAverageCell';
import {CountsTowardsCreditsCellContainer} from './CountsTowardsCreditsCell';
import {GradeSlider} from './GradeSlider';
import {InlineSemesterPicker} from './InlineSemesterPicker';
import {ModuleStatusToggle} from './ModuleStatusToggle';
import {SliderWithValue} from './SliderWithValue';

const Container = styled(ScrollView).attrs({
	contentContainerStyle: {padding: 16},
})`
	flex: 1;
`;

const Input = styled(TextInput)<{
	focused: boolean;
}>`
	padding: 14px;
	padding-top: 14px;
	padding-bottom: 14px;
	border-color: ${(props) =>
		props.focused ? props.theme.BLUE_TINT : props.theme.BORDER_COLOR};
	border-width: 1px;
	font-size: 16px;
	border-radius: 4px;
	color: ${(props) => props.theme.TITLE};
`;

export const CreateCustomCredit = () => {
	const language = useLanguage();
	const dispatch = useDispatch();
	const navigation = useNavigationInNative<'CreateCustomCredit'>();
	const appearance = useAppearance();
	const route = useRoute<RouteProp<RN5Routes, 'CreateCustomCredit'>>();
	const initialName = route.params.name || '';

	const previous = previousPeriod(currentPeriod);
	const previous2 = previousPeriod(previous);
	const previous3 = previousPeriod(previous2);
	const previous4 = previousPeriod(previous3);
	const previous5 = previousPeriod(previous4);
	const previous6 = previousPeriod(previous5);
	const previous7 = previousPeriod(previous6);
	const availablePeriods = [
		nextPeriod(currentPeriod),
		currentPeriod,
		previous,
		previous2,
		previous3,
		previous4,
		previous5,
		previous6,
		previous7,
	];
	const [_id] = useState<string>(uuid());
	const [name, setName] = useState<string>(initialName || '');
	const [nameFocused, setNameFocused] = useState<boolean>(false);
	const [status, setStatus] = useState<CreditStatus>('ADDED');
	const [credits, setCredits] = useState<number>(3);
	const [grade, setGrade] = useState<number | string | null>(null);
	const [period, setPeriod] = useState<number>(20201);

	const derivedCredits: CustomCredit = {
		period,
		grade: typeof grade === 'number' ? String(grade) : grade,
		credits_worth: credits,
		status,
		name,
		short_name: name,

		credits_received: status === 'PASSED' ? credits : 0,
		_id,
		custom: true,
	};

	const active = Boolean(name);

	return (
		<Container
			keyboardShouldPersistTaps="never"
			style={{
				backgroundColor: appearance.BACKGROUND,
			}}
		>
			<VSpace />
			<VSpace />
			<BlockTextTitle>{rawStrings.NAME[language]}</BlockTextTitle>
			<VSpace />
			<Input
				value={name}
				focused={nameFocused}
				onFocus={() => setNameFocused(true)}
				onBlur={() => setNameFocused(false)}
				placeholder={rawStrings.CUSTOM_CREDIT_PLACEHOLDER[language]}
				placeholderTextColor={appearance.MESSAGE_DELETED}
				onChangeText={(newName) => {
					setName(newName);
				}}
			/>
			<VSpace />
			<VSpace />
			<BlockTextTitle>{rawStrings.SEMESTER[language]}</BlockTextTitle>
			<VSpace />
			<View>
				<InlineSemesterPicker
					availableSemesters={availablePeriods}
					selectedPeriod={period}
					setPeriod={(newPeriod) => setPeriod(newPeriod)}
				/>
			</View>
			<VSpace />
			<VSpace />
			<BlockTextTitle>{rawStrings.CREDITS[language]}</BlockTextTitle>
			<VSpace />
			<SliderWithValue
				minimum={0}
				maximum={45}
				value={credits}
				onValueChange={(_credits) => setCredits(_credits)}
				onSlidingComplete={(_credits) => setCredits(_credits)}
				precision={1}
				step={0.5}
				minimumTrackTintColor={Colors.Blue}
			/>
			<VSpace />
			<VSpace />
			<BlockTextTitle>{rawStrings.STATUS[language]}</BlockTextTitle>
			<VSpace />
			<ModuleStatusToggle
				status={status}
				setStatus={(newStatus) => {
					if (newStatus === 'PASSED') {
						setGrade(5);
					}

					if (newStatus === 'FAILED') {
						setGrade(3.5);
					}

					setStatus(newStatus);
				}}
			/>
			<VSpace />
			<VSpace />
			{status !== 'ADDED' ? (
				<>
					<BlockTextTitle>{rawStrings.GRADE[language]}</BlockTextTitle>
					<VSpace />
					<GradeSlider
						grade={grade}
						onGradeChanged={(_grade) => setGrade(_grade)}
						onFinishedGradeChanging={(_grade) => {
							setGrade(_grade);
							if (
								(typeof _grade === 'number' && _grade >= 4) ||
								_grade === 'BEST'
							) {
								setStatus('PASSED');
							} else {
								setStatus('FAILED');
							}
						}}
					/>
					<VSpace />
				</>
			) : null}
			{status === 'PASSED' ? (
				<>
					<BlockTextTitle>
						{rawStrings.CALCULATION[language]}
					</BlockTextTitle>
					<VSpace />
					<CountsTowardsCreditsCellContainer credit={derivedCredits} />
					<VSpace />
					<CountsTowardsAverageCellContainer credit={derivedCredits} />
					<VSpace />
					<VSpace />
				</>
			) : null}
			<VSpace />
			<VSpace />
			<CheckItem
				noCheck
				disabled={!active}
				active={active}
				onPress={() => {
					dispatch(addCustomCredit(derivedCredits));
					navigation.goBack();
					navigation.navigate('CreditView');
				}}
			>
				<Label disabled={!active} active={active}>
					{rawStrings.ADD_MODULE[language]}
				</Label>
			</CheckItem>
		</Container>
	);
};
