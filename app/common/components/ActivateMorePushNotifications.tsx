import React, {useEffect, useState} from 'react';
import {TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {AnimatedNativeScrollView} from '../../../core/components/AnimatedScrollView';
import {CheckItem, Label, VSpace} from '../../../core/components/Base';
import {ModalCancelButton} from '../../../core/components/ModalCancelButton';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import rawStrings from '../../../core/raw-strings';
import {subscribeToChannelsAction} from '../../../core/reducers/notifications';
import {getPotentialNewNotificationChannels} from '../api/get-potential-new-notification-channels';
import {FatModalTitle} from './FatModalTitle';
import {HeaderTextButton} from './HeaderTextButton';

const Container = styled(AnimatedNativeScrollView).attrs({
	contentContainerStyle: {
		padding: 16,
	},
})`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const ButtonRow = styled(View)`
	flex-direction: row;
`;

const Flex1 = styled(View)`
	flex: 1;
`;

const Paragraph = styled(Text)`
	color: ${(props) => props.theme.TITLE};
	text-align: center;
	margin-top: 16px;
	margin-bottom: 16px;
	line-height: 20px;
`;

const fillRatio = 0.5;

const SplashIcon = styled(Image)<{
	width: number;
}>`
	width: ${(props) => props.width * fillRatio}px;
	height: ${(props) => (634 / 976) * props.width * fillRatio}px;
	align-self: center;
	margin-top: 15px;
	margin-bottom: 15px;
`;

export const ActivateMorePushNotifications = () => {
	const navigation = useNavigationInNative();
	const dispatch = useDispatch();
	const language = useLanguage();
	const credits = useAppState((state) =>
		getPotentialNewNotificationChannels(state)
	);
	const {width} = useWindowDimensions();
	const userHash = useAppState((state) => getUserHash(state, null));

	const allEnabled = credits
		.map((a) => getUniqueIdentifier(a))
		.reduce(
			(a, b) => ({
				...a,
				[b]: true,
			}),
			{}
		);

	const [map, setMap] = useState(allEnabled);

	const disableAll = React.useCallback(() => {
		setMap({
			...map,
			...credits
				.map((a) => getUniqueIdentifier(a))
				.reduce(
					(a, b) => ({
						...a,
						[b]: false,
					}),
					{}
				),
		});
	}, [credits, map]);

	const enableAll = React.useCallback(() => {
		setMap({
			...map,
			...allEnabled,
		});
	}, [allEnabled, map]);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={() => {
						dispatch(
							subscribeToChannelsAction(userHash, [
								...credits
									.filter((c) => map[getUniqueIdentifier(c)])
									.map((c) =>
										getChatRoomIdentifier(
											getModuleId(c) as string,
											CreditHelpers.getInstitution(c)
										)
									),
							])
						);
						navigation.goBack();
					}}
				>
					<HeaderTextButton>{rawStrings.DONE[language]}</HeaderTextButton>
				</TouchableOpacity>
			),
		});
	}, [credits, dispatch, language, navigation, userHash, map]);

	return (
		<Container>
			<View>
				<SplashIcon
					width={width}
					source={require('../assets/enable_notification.png')}
				/>
				<FatModalTitle>{rawStrings.DONT_MISS_ANYTHING[language]}</FatModalTitle>
				<Paragraph>
					{rawStrings.ACTIVATE_MORE_PUSH_NOTIFICATIONS[language]}
				</Paragraph>
				<ButtonRow>
					<ModalCancelButton
						onPress={disableAll}
						label={rawStrings.DISABLE_ALL[language]}
					/>
					<Flex1 />
					<ModalCancelButton
						onPress={enableAll}
						label={rawStrings.ENABLE_ALL[language]}
					/>
				</ButtonRow>
				{credits.map((a) => {
					const identifier = getUniqueIdentifier(a);
					const active = Boolean(map[identifier]);
					return (
						<View key={identifier}>
							<CheckItem
								active={active}
								onPress={() => {
									setMap({
										...map,
										[identifier]: !active,
									});
								}}
							>
								<Label active={active}>{a.short_name}</Label>
							</CheckItem>
							<VSpace />
						</View>
					);
				})}
			</View>
		</Container>
	);
};
