import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {fetchModuleDetails} from '../../../core/actions/api';
import {removeLoginCredit} from '../../../core/actions/login';
import {AnimatedNativeScrollView} from '../../../core/components/AnimatedScrollView';
import {Chevron, VSpace} from '../../../core/components/Base';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import {Dismisser} from '../../../core/components/Dismisser';
import {HudManager} from '../../../core/components/HudManager';
import {ModalCancelButton} from '../../../core/components/ModalCancelButton';
import {Label} from '../../../core/components/Options';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {Config} from '../../../core/data/Config';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {canCountTowardsAverage} from '../../../core/functions/can-count-towards-average';
import {cannotNavigate} from '../../../core/functions/cannot-navigate';
import {Colors} from '../../../core/functions/Colors';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {
	canCountTowardsCredits,
	doesCountTowardsCredit,
} from '../../../core/functions/does-count-towards-credit';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getPureCredit} from '../../../core/functions/get-credit';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getStatusFromGrade} from '../../../core/functions/get-status-from-grade';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {globalStyles} from '../../../core/functions/styles';
import {truthy} from '../../../core/functions/truthy';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {usePull} from '../../../core/functions/use-pull';
import {Credit, CreditStatus, Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {
	Override,
	resetOverride,
	setOverride,
} from '../../../core/reducers/creditOverrides';
import {removeCustomCredit} from '../../../core/reducers/customCredits';
import {removeModule} from '../../../core/reducers/moduleCollection';
import {getApiResponse} from '../api/get-api-response';
import {isDeviceRegistered} from '../api/is-device-registered';
import {overrideIsTheSame} from '../api/override-is-the-same';
import {CountsTowardsAverageCellContainer} from './CountsTowardsAverageCell';
import {CountsTowardsCreditsCellContainer} from './CountsTowardsCreditsCell';
import {CreditCell} from './CreditCell';
import {CreditNotificationSettings} from './CreditNotificationSettings';
import {GradeSlider} from './GradeSlider';
import {GrayButton} from './GrayButton';
import {InlineSemesterPicker} from './InlineSemesterPicker';
import {ModuleStatusToggle} from './ModuleStatusToggle';

const Container = !Config.IS_WEB_APP
	? styled(AnimatedNativeScrollView).attrs({
			contentContainerStyle: {
				padding: 16,
				paddingBottom: 0,
			},
	  })`
			background-color: ${(props) => props.theme.BACKGROUND};
	  `
	: styled(View)`
			flex: 1;
			padding: 16px;
			padding-bottom: 0;
			background-color: ${(props) => props.theme.BACKGROUND};
	  `;

const Stripe = styled(View)`
	height: 36px;
	background-color: ${Colors.Blue};
	margin-left: -16px;
	margin-right: -16px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`;

const StripeLabel = styled(Text)`
	color: white;
	font-size: 10px;
	font-weight: bold;
`;

const Spacer = styled(View)`
	height: 6px;
	width: 6px;
`;

type Props = {
	countsTowardsCredits: boolean;
	setOverride: (credit: Credit, override: Override) => void;
};

// eslint-disable-next-line complexity
export const CreditConfiguration: React.FC<Props> = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	const route = useRoute<RouteProp<RN5Routes, 'CreditConfiguration'>>();
	const {showAddedIndicator, credit} = route.params;
	const appearance = useAppearance();
	const [selectedGrade, setSelectedGrade] = useState<null | number | string>(
		null
	);
	const [selectedStatus, setSelectedStatus] = useState<null | CreditStatus>(
		null
	);
	const countsTowardsCredits = useAppState((state) =>
		doesCountTowardsCredit(state.countsTowardsCredits, credit)
	);
	const override = useAppState(
		(state) => state.creditOverrides[getUniqueIdentifier(credit)]
	);
	const language = useLanguage();
	const [selectedPeriodState, setSelectedPeriod] = useState<number | null>(
		null
	);

	const apiResponse = useAppState((state) =>
		getApiResponse(
			state,
			CreditHelpers.getInstitution(credit),
			getModuleId(credit) as string
		)
	);

	const deviceRegistered = useAppState((state) => isDeviceRegistered(state));
	const _canCountTowardsAverage = canCountTowardsAverage(credit);
	const _canCountTowardsCredits = canCountTowardsCredits(credit);
	const shownGrade = selectedGrade || credit.grade;
	/*
		For modules without a link, the credit status is part of the
		module. This is why we disable changing the status because it would result in a different identifier.
	*/
	const canEditStatus = !cannotNavigate(credit) || credit.custom;
	const status = selectedStatus || credit.status;
	const selectedPeriod = selectedPeriodState || CreditHelpers.getPeriod(credit);
	const availableSemesters = apiResponse.details
		? apiResponse.details.semesters.map((s) => s.period).filter(truthy)
		: [CreditHelpers.getPeriod(credit) as number];
	const hasPushPermission = useAppState((state) =>
		Boolean(state.notifications.permissions?.alert)
	);

	const pure = useAppState((state) =>
		getPureCredit(
			state.institution.institution,
			state.multiSummary,
			state.moduleCollection,
			state.api[
				getChatRoomIdentifier(
					getModuleId(credit) as string,
					credit.institution as Institution
				)
			],
			getModuleId(credit) as string,
			CreditHelpers.getSemester(credit) as string,
			credit.institution
		)
	);
	const userProfile = useAppState((state) => state.users.userProfile);
	const canControlSettings =
		userProfile && deviceRegistered && hasPushPermission;

	useEffect(() => {
		if (!apiResponse.details) {
			dispatch(
				fetchModuleDetails(
					CreditHelpers.getInstitution(credit),
					getModuleId(credit) as string
				)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Container {...dismisser.scrollViewProps}>
			<SafeSideSpace>
				<Dismisser progress={dismisser.progress} />

				{!canEditStatus ? (
					<Text
						style={{
							color: 'gray',
							textAlign: 'center',
							marginBottom: 20,
							marginTop: 10,
						}}
					>
						{rawStrings.NO_INFOS_AVAILABLE[language]}
					</Text>
				) : null}
				<View style={{marginLeft: -12, marginRight: -12}}>
					<CreditCell credit={credit} />
				</View>
				{canEditStatus && (
					<React.Fragment>
						<VSpace />
						{showAddedIndicator ? (
							<>
								<VSpace />
								<Stripe>
									<Image
										style={{
											tintColor: 'white',
											height: 14,
											width: 14,
										}}
										source={require('../assets/arrow-down.png')}
									/>
									<Spacer />
									<StripeLabel>
										{rawStrings.ADDED_ADJUSTMENTS[language]}
									</StripeLabel>
								</Stripe>
								<VSpace />
							</>
						) : null}
						<VSpace />
						<BlockTextTitle>{rawStrings.SEMESTER[language]}</BlockTextTitle>
						<Spacer />
						<View>
							<InlineSemesterPicker
								availableSemesters={availableSemesters}
								selectedPeriod={selectedPeriod}
								setPeriod={(newPeriod) => {
									dispatch(
										setOverride(
											credit,
											{
												...override,
												period: newPeriod as number,
											},
											'local'
										)
									);
									setSelectedPeriod(newPeriod);
								}}
							/>
						</View>
						<Spacer />
						<BlockTextTitle>{rawStrings.STATUS[language]}</BlockTextTitle>
						<Spacer />
						<View>
							<ModuleStatusToggle
								setStatus={(_selectedStatus) => {
									if (_selectedStatus === 'PASSED') {
										setSelectedStatus('PASSED');
										setSelectedGrade(5);
										dispatch(
											setOverride(
												credit,
												{
													...override,
													status: 'PASSED',
													grade: 5,
													credits_received: credit.credits_worth,
												},
												'local'
											)
										);
									} else if (_selectedStatus === 'FAILED') {
										dispatch(
											setOverride(
												credit,
												{
													...override,
													status: 'FAILED',
													grade: 3.5,
													credits_received: credit.credits_worth,
												},
												'local'
											)
										);
										setSelectedStatus('FAILED');
										setSelectedGrade(3.5);
									} else {
										const statusToSet =
											pure.status === 'BOOKED' ||
											pure.status === 'ADDED' ||
											pure.status === 'CONTINUE'
												? pure.status
												: 'ADDED';
										setSelectedStatus(statusToSet);
										dispatch(
											setOverride(
												credit,
												{
													...override,
													status: statusToSet,
													grade: null,
													credits_received: null,
												},
												'local'
											)
										);
									}
								}}
								status={status}
							/>
						</View>
						<View style={{height: 8}} />
						{status === 'PASSED' || status === 'FAILED' ? (
							<React.Fragment>
								<BlockTextTitle>{rawStrings.GRADE[language]}</BlockTextTitle>
								<VSpace />
								<GradeSlider
									grade={shownGrade}
									onGradeChanged={(value) => {
										setSelectedGrade(value);
										setSelectedStatus(getStatusFromGrade(value));
									}}
									onFinishedGradeChanging={(value) => {
										dispatch(
											setOverride(
												credit,
												{
													...override,
													grade: value,
													status: getStatusFromGrade(value),
												},
												'local'
											)
										);
									}}
								/>
							</React.Fragment>
						) : null}
					</React.Fragment>
				)}
				{_canCountTowardsCredits ? (
					<React.Fragment>
						<VSpace />
						<BlockTextTitle>{rawStrings.CALCULATION[language]}</BlockTextTitle>
						<VSpace />
					</React.Fragment>
				) : null}
				{_canCountTowardsCredits ? (
					<CountsTowardsCreditsCellContainer credit={credit} />
				) : null}
				{_canCountTowardsAverage && _canCountTowardsCredits ? <VSpace /> : null}
				{_canCountTowardsAverage && countsTowardsCredits ? (
					<CountsTowardsAverageCellContainer credit={credit} />
				) : null}
				<VSpace />
				{!credit?.custom ? (
					<>
						<BlockTextTitle>{rawStrings.SETTINGS[language]}</BlockTextTitle>
						<VSpace />
						<GrayButton
							onPress={() => {
								navigation.goBack();
								setTimeout(() => {
									navigation.navigate('PickSeriesView', {
										credit,
										semester: CreditHelpers.getSemester(credit) as string,
									});
								}, 200);
							}}
						>
							<>
								<View>
									<Label>{rawStrings.CONFIGURE_TIMETABLE[language]}</Label>
								</View>
								<View style={globalStyles.flex1} />
								<Chevron
									source={require('../../../core/assets/collapsed.png')}
									style={{
										tintColor: appearance.ICON_TINT,
									}}
								/>
							</>
						</GrayButton>
					</>
				) : null}
				{canControlSettings ? (
					<>
						<VSpace />
						<CreditNotificationSettings inCreditConfiguration credit={credit} />
					</>
				) : null}
				<VSpace />
				<View style={{flexDirection: 'row'}}>
					{pure.status === 'ADDED' ? (
						<ModalCancelButton
							style={globalStyles.flex1}
							label={
								overrideIsTheSame(pure, override)
									? rawStrings.REMOVE[language]
									: rawStrings.RESET[language]
							}
							destructive
							onPress={() => {
								if (overrideIsTheSame(pure, override)) {
									navigation.goBack();
									setTimeout(() => {
										if (credit.custom) {
											dispatch(removeCustomCredit(credit._id as string));

											return;
										}

										dispatch(removeModule(credit));
										HudManager.setHudContent({
											icon: require('../assets/trash-square.png'),
											label: rawStrings.REMOVED[language],
										});
									}, 400);
								} else {
									setSelectedGrade(null);
									setSelectedStatus(null);
									setSelectedPeriod(null);
									dispatch(resetOverride(credit));
								}
							}}
						/>
					) : (
						<ModalCancelButton
							style={globalStyles.flex1}
							label={
								overrideIsTheSame(pure, override)
									? rawStrings.REMOVE[language]
									: rawStrings.RESET[language]
							}
							destructive
							onPress={() => {
								if (overrideIsTheSame(pure, override)) {
									navigation.goBack();

									setTimeout(() => {
										if (credit.custom) {
											dispatch(removeCustomCredit(credit._id as string));
											return;
										}

										dispatch(
											removeLoginCredit(
												credit,
												CreditHelpers.getInstitution(credit)
											)
										);
									}, 400);
								} else {
									setSelectedGrade(null);
									setSelectedStatus(null);
									setSelectedPeriod(null);
									dispatch(resetOverride(credit));
								}
							}}
						/>
					)}

					<ModalCancelButton
						style={globalStyles.flex1}
						onPress={() => {
							navigation.goBack();
						}}
						label={rawStrings.OK[language]}
					/>
				</View>
			</SafeSideSpace>
		</Container>
	);
};
