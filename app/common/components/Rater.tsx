import isEqual from 'lodash/isEqual';
import {transparentize} from 'polished';
import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import CheckBox from 'react-native-check-box';
import Modal from 'react-native-modal';
import {Image, Text} from 'react-native-normalized';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {addRating, updateRating, updateStars} from '../../../core/actions/ratings';
import {HudManager} from '../../../core/components/HudManager';
import {ModalCancelButton} from '../../../core/components/ModalCancelButton';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import Stars from '../../../core/components/Stars';
import {Colors} from '../../../core/functions/Colors';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {formatString} from '../../../core/functions/format-string';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {globalStyles} from '../../../core/functions/styles';
import {
	AppearanceMap,
	getAppearanceMap,
	useAppearance,
} from '../../../core/functions/use-appearance';
import {AppLanguage} from '../../../core/models/app-language';
import {Credit, Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {AppState} from '../../../core/types/app-state';
import {RatingCore, RatingRequest} from '../../../core/types/ratings';
import {confirmDialog} from '../api/ConfirmDialog';
import {getUserName} from '../api/get-user-name';
import {BoldHeader} from './BoldHeader';
import {ColorChangingView} from './ColorChanger';
import ReviewHeader from './ReviewHeader';
import {Button, ButtonLabel, Highlight} from './SocialMediaInterstitial';

const StarContainer = styled(View)`
	width: 180px;
	align-self: center;
	margin-top: 6px;
	margin-bottom: 6px;
`;

const Content = styled(View)`
	padding: 6px 12px;
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

const StyledModal = styled(Modal)`
	margin: 0;
	justify-content: flex-end;
`;

const ModalContent = styled(View)`
	padding-top: 12px;
`;

const ModuleName = styled(Text)`
	align-self: center;
	color: ${Colors.Orange};
	font-weight: bold;
	font-size: 12px;
`;

const Hr = styled(View)`
	border-top-width: ${StyleSheet.hairlineWidth}px;
	border-top-color: rgba(0, 0, 0, 0.1);
`;

const sendingStatusStyle = `
	justify-content: center;
	align-items: center;
	flex-direction: row;
	height: 36px;
	margin-top: 10px;
`;

const InitialSendingStatus = styled(View)`
	${sendingStatusStyle};
`;

const AnimatedInitialSendingStatus = styled(ColorChangingView)`
	${sendingStatusStyle};
`;

const TextSendingLabel = styled(Text)`
	color: ${(props) => props.theme.BLUE_TINT};
	font-size: 10px;
	font-weight: bold;
`;

const AnimatedTextSendingLabelContainer = styled(ColorChangingView)`
	color: ${(props) => props.theme.BLUE_TINT};
	font-size: 10px;
	font-weight: bold;
`;

const AnimatedTextSendingLabel = (props) => {
	const appearance = useAppearance();
	return (
		<AnimatedTextSendingLabelContainer
			{...props}
			text
			to="white"
			from={appearance.BLUE_TINT}
		/>
	);
};

const CheckIconContainer = styled(ColorChangingView)`
	tint-color: white;
	height: 14px;
	width: 14px;
	margin-right: 6px;
`;

const CheckIcon = (props) => {
	const appearance = useAppearance();
	return (
		<CheckIconContainer
			{...props}
			image
			to="white"
			from={appearance.BLUE_TINT}
			source={require('../assets/check-circle.png')}
		/>
	);
};

const FailIcon = styled(CheckIcon)`
	tint-color: ${Colors.Red};
`;

const Circle = styled(View)`
	background-color: ${Colors.Orange};
	width: 40px;
	height: 40px;
	border-radius: 20px;
	margin-right: 10px;
	justify-content: center;
	align-items: center;
`;

const labelStyle = {
	fontSize: 12,
	marginTop: 6,
	marginBottom: 6,
	marginLeft: 14,
};

type State = {
	stars: number;
	review: string | null;
	showName: boolean;
	_id: string | null;
	modalVisible: boolean;
};

class RaterComp extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.fillReview(props, true);
	}

	refreshTimeout?: number | NodeJS.Timeout;
	fillReview(props: Props, directState?: boolean) {
		const rating = this.props.rating(props._id as string);
		const newState = {
			stars: rating ? rating.score : 0,
			review: rating ? rating.review : '',
			showName: rating ? Boolean(rating.name) : true,
			_id: props._id ? props._id : null,
		};
		if (directState) {
			this.state = {...newState, modalVisible: false}; // eslint-disable-line react/no-direct-mutation-state
		} else {
			this.setState(newState);
		}
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.visible && !prevProps.visible) {
			this.fillReview(prevProps);
		}

		if (!isEqual(this.props.credit, this.props.credit) && this.props._id) {
			this.fillReview(this.props);
		}
	}

	getReview({
		first = false,
	}: {
		first?: boolean;
	} = {}): RatingRequest {
		return {
			review: this.state.review || null,
			score: this.state.stars,
			university: CreditHelpers.getInstitution(this.props.credit),
			uni_identifier: getModuleId(this.props.credit) as string,
			name:
				this.state.showName && !first && this.props.username
					? this.props.username
					: null,
			grade: null,
			direction: null,
			token: getUserHash(
				this.props.state,
				CreditHelpers.getInstitution(this.props.credit)
			),
		};
	}

	updateStars(score: number, oldScore: number) {
		this.props.updateStars({
			_id: this.state._id as string,
			rating: this.getReview(),
			score,
			oldScore,
			token: getUserHash(
				this.props.state,
				CreditHelpers.getInstitution(this.props.credit)
			) as string,
		});
	}

	update() {
		return this.props.updateRating(
			this.state._id as string,
			this.getReview(),
			() => {
				this.hide();
				HudManager.setHudContent({
					label: rawStrings.SENT[this.props.language] + '!',
				});
			}
		);
	}

	hide() {
		if (this.props.onCancel) {
			this.props.onCancel();
		}

		this.setState({modalVisible: false, stars: 0});
		this.refreshTimeout = setTimeout(() => {
			if (this.props.onRefresh) {
				this.props.onRefresh();
			}
		}, 8000);
	}

	send() {
		this.props.addRating(
			this.getReview({first: true}),
			CreditHelpers.getInstitution(this.props.credit),
			(_id: string) => {
				this.setState({
					_id,
				});
			}
		);
	}

	renderInitialSendingStatus() {
		if (this.props.errorAddingRating) {
			return (
				<InitialSendingStatus>
					<FailIcon source={require('../assets/fail.png')} />
					<TextSendingLabel style={{color: Colors.Red}}>
						{rawStrings.ERROR[this.props.language]}:{' '}
						{this.props.errorAddingRating}
					</TextSendingLabel>
				</InitialSendingStatus>
			);
		}

		if (this.state._id) {
			return (
				<AnimatedInitialSendingStatus
					to={this.props.appearance.BLUE_TINT}
					from={this.props.appearance.BACKGROUND}
					duration={500}
				>
					<CheckIcon
						style={{marginTop: 2}}
						source={require('../assets/arrow-down.png')}
					/>
					<AnimatedTextSendingLabel style={{color: 'white'}}>
						{this.props.editMode
							? rawStrings.OPTIONALLY_WRITE_A_COMMENT[
									this.props.language
							  ]
							: rawStrings.SENT_RATING_INITIAL[this.props.language]}
					</AnimatedTextSendingLabel>
				</AnimatedInitialSendingStatus>
			);
		}

		return (
			<InitialSendingStatus>
				<TextSendingLabel style={{color: this.props.appearance.SUBTITLE}}>
					{rawStrings.SENDING[this.props.language]}
				</TextSendingLabel>
			</InitialSendingStatus>
		);
	}

	renderModalContent() {
		// If rating has been made but then deleted again, don't show rater because the state is inconsistent.
		if (this.state._id && !this.props.rating(this.state._id)) {
			return null;
		}

		const sending =
			this.state._id &&
			this.props.rating(this.state._id) &&
			this.props.rating(this.state._id).updating;
		const canShowName = this.props.username;
		const hasOptions = canShowName;
		return (
			<ModalContent
				style={{backgroundColor: this.props.appearance.BACKGROUND}}
			>
				<StarContainer>
					<Stars
						disabled={!this.state._id}
						rating={this.state.stars}
						selectedStar={(stars) => {
							this.updateStars(stars, this.state.stars);
							this.setState({
								stars,
							});
						}}
					/>
				</StarContainer>
				<ModuleName>{this.props.credit.short_name}</ModuleName>
				{this.renderInitialSendingStatus()}
				<SafeSideSpace>
					<Hr />
					<BoldHeader>
						{rawStrings.COMMENT[this.props.language]}
					</BoldHeader>
					<ReviewHeader
						review={this.getReview()}
						noTimestamp
						course={null}
					/>
					<Hr />
					<TextInput
						multiline
						placeholderTextColor={this.props.appearance.SUBTITLE}
						placeholder={rawStrings.WRITE_A_COMMENT[this.props.language]}
						underlineColorAndroid="transparent"
						style={{
							minHeight: 80,
							paddingHorizontal: 12,
							paddingVertical: 6,
							maxHeight: 120,
							textAlignVertical: 'top',
							color: this.props.appearance.TITLE,
						}}
						value={this.state.review as string}
						onChangeText={(review) => {
							this.setState({review});
						}}
					/>
					<Hr />
					{hasOptions ? (
						<BoldHeader>
							{rawStrings.OPTIONS[this.props.language]}
						</BoldHeader>
					) : null}
					<View style={{paddingLeft: 12, paddingRight: 12}}>
						{canShowName ? (
							<CheckBox
								isChecked={this.state.showName}
								checkBoxColor={this.props.appearance.BLUE_TINT}
								onClick={() =>
									this.setState((prevState) => ({
										showName: !prevState.showName,
									}))
								}
								rightTextView={
									<Label
										style={{
											...labelStyle,
											color: this.props.appearance.TITLE,
										}}
									>
										{
											rawStrings.SHOW_MY_NAME[
												this.props.language
											]
										}
										{'\n'}
										<Label
											style={{
												color: this.props.appearance
													.SUBTITLE,
											}}
										>
											{this.props.username}
										</Label>
									</Label>
								}
							/>
						) : null}
					</View>
					<View style={globalStyles.flex1} />
					<View style={{flexDirection: 'row'}}>
						<ModalCancelButton
							style={globalStyles.flex1}
							label={
								this.props.editMode
									? rawStrings.CANCEL[this.props.language]
									: rawStrings.NO_THANK_YOU[this.props.language]
							}
							destructive
							onPress={() => this.leave()}
						/>
						<ModalCancelButton
							style={globalStyles.flex1}
							label={
								this.props.editMode
									? rawStrings.UPDATE[this.props.language]
									: rawStrings.SEND[this.props.language]
							}
							loading={Boolean(sending)}
							onPress={() => {
								this.update()
									.then(() => {
										// noop
									})
									.catch((err) => {
										console.log('error modal cancel', err);
									});
							}}
						/>
					</View>
				</SafeSideSpace>
			</ModalContent>
		);
	}

	async leave() {
		if (this.state.review) {
			try {
				const question = this.props.editMode
					? rawStrings.REVIEW_CANCEL_CONFIRM_CHANGES[this.props.language]
					: rawStrings.REVIEW_CANCEL_CONFIRM_REVIEW[this.props.language];
				await confirmDialog(
					rawStrings.LEAVE[this.props.language] + '?',
					question,
					{},
					this.props.language
				);
				this.hide();
			} catch (err) {
				console.log('Cancelled leave', err);
			}
		} else {
			this.hide();
		}
	}

	renderModal() {
		return (
			<StyledModal
				isVisible={Boolean(this.state.modalVisible || this.props.visible)}
				useNativeDriver
				onBackdropPress={() => this.leave()}
				onBackButtonPress={() => this.leave()}
				avoidKeyboard={Platform.OS === 'ios'}
			>
				{this.renderModalContent()}
			</StyledModal>
		);
	}

	render() {
		if (!this.props.credit) {
			//	return null;
		}

		return (
			<View>
				{this.props.editMode || this.props.hasBeenRated ? null : (
					<View
						style={{backgroundColor: this.props.appearance.BACKGROUND}}
					>
						<Content>
							{this.props.inline ? (
								<Label
									style={{
										textAlign: 'center',
										fontSize: 13,
										color: this.props.appearance.TITLE,
									}}
								>
									{
										rawStrings.GIVE_YOUR_RATING[
											this.props.language
										]
									}
								</Label>
							) : (
								<View>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
										}}
									>
										<Circle>
											<Image
												source={require('../assets/star-full.png')}
												style={{
													tintColor: 'white',
													width: 24,
													height: 24,
												}}
											/>
										</Circle>
										<View style={globalStyles.flex1}>
											<Label
												style={{
													color: this.props.appearance
														.TITLE,
													fontSize: 13,
												}}
											>
												{formatString(
													rawStrings.HOW_WOULD_YOU_RATE[
														this.props.language
													],
													this.props.credit.short_name
												)}
												{'\n'}
												<Label
													style={{
														color: this.props.appearance
															.SUBTITLE,
													}}
												>
													{
														rawStrings
															.YOUR_RATING_IS_ANONYMOUS[
															this.props.language
														]
													}
												</Label>
											</Label>
										</View>
									</View>
								</View>
							)}
							<StarContainer>
								<Stars
									rating={this.state.stars}
									selectedStar={(stars) => {
										this.setState({
											stars,
											modalVisible: true,
										});
										setTimeout(() => {
											this.send();
										}, 100);
									}}
									emptyStarColor="rgba(0, 0, 0, 0.2)"
								/>
							</StarContainer>
						</Content>
					</View>
				)}
				{this.props.showThankYou && this.props.hasBeenRated ? (
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Circle
							style={{backgroundColor: Colors.Blue, marginBottom: 8}}
						>
							<Image
								source={require('../assets/check.png')}
								style={{
									tintColor: 'white',
									width: 24,
									height: 24,
								}}
							/>
						</Circle>
						<Label
							style={{
								fontSize: 13,
								color: Colors.Blue,
							}}
						>
							{
								rawStrings.THANK_YOU_FOR_YOUR_RATING[
									this.props.language
								]
							}
						</Label>
						<Highlight
							underlayColor={transparentize(0.3, '#3897f0')}
							onPress={() => {
								if (this.refreshTimeout) {
									clearTimeout(this.refreshTimeout as number);
								}

								if (this.props.onRefresh) {
									this.setState({
										stars: 0,
									});
									this.props.onRefresh();
								}
							}}
						>
							<Button>
								<ButtonLabel>
									{
										rawStrings.RATE_ANOTHER_COURSE[
											this.props.language
										]
									}
								</ButtonLabel>
							</Button>
						</Highlight>
					</View>
				) : null}
				{this.renderModal()}
			</View>
		);
	}
}

type OwnProps = {
	credit: Credit;
};

type Props = OwnProps & {
	_id?: string;
	visible?: boolean;
	state: AppState;
	appearance: AppearanceMap;
	addRating: (
		r: RatingRequest,
		institution: Institution,
		callback: (id: string) => void
	) => void;
	updateStars: (hi: {
		rating: RatingRequest;
		_id: string;
		score: number;
		token: string;
		oldScore: number;
	}) => void;
	updateRating: (
		_id: string,
		rating: RatingRequest,
		callback: () => void
	) => Promise<void>;
	onCancel?: () => void;
	editMode?: boolean;
	onRefresh?: () => void;
	showThankYou?: boolean;
	hasBeenRated?: boolean;
	inline?: boolean;
	rating: (_id: string) => RatingCore;
	errorAddingRating: string | null;
	username: string;
	language: AppLanguage;
};

// TODO: Fix types
export const Rater: any = connect(
	(state: AppState, ownProps: OwnProps) => ({
		hasBeenRated: Boolean(
			state.multiMyRatings[state.institution.institution].ratings.find((r) => {
				return (
					r.uni_identifier === getModuleId(ownProps.credit) &&
					r.university === ownProps.credit.institution
				);
			})
		),
		username: getUserName(state),
		rating: (_id: string): RatingCore => state.ratings[_id],
		state,
		errorAddingRating: state.moduleRatings.errorAddingRating,
		language: state.language.selectedLanguage,
		appearance: getAppearanceMap(state.appearance),
	}),
	{
		addRating,
		updateStars,
		updateRating,
	}
)(RaterComp);
