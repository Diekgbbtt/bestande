import AsyncStorage from '@react-native-community/async-storage';
import {darken} from 'polished';
import React, {useCallback, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, Alert, Image, Text} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {Colors} from '../../../core/functions/Colors';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {hideContent} from '../../../core/reducers/hiddenContent';
import {
	receiveSystemPermissions,
	subscribeToChannelsAction,
	userSignalsNotificationPreference,
} from '../../../core/reducers/notifications';
import {getPotentialNewNotificationChannels} from '../api/get-potential-new-notification-channels';
import {requestNotificationPermissions} from '../api/request-notification-permissions';

const Shadow = styled(LinearGradient).attrs({
	colors: [darken(0.1, Colors.Blue), Colors.Blue],
	start: {x: 0, y: 0},
	end: {x: 1, y: 0},
})`
	background-color: ${Colors.Blue};
	flex-direction: row;
	padding-right: 12px;
	align-items: center;
	position: absolute;
`;

const Container = styled(TouchableOpacity)`
	flex-direction: row;
	flex: 1;
`;

const Cell = styled(View)`
	padding: 12px;
	flex-direction: row;
	padding-right: 20px;
	align-items: center;
`;

const Title = styled(Text)`
	color: #ddd;
	font-weight: bold;
	font-size: 15px;
	margin-bottom: 2px;
`;

const Subtitle = styled(Text)`
	color: #ddd;
	font-size: 15px;
`;

const Icon = styled(Image)`
	height: 28px;
	width: 28px;
	tint-color: white;
	margin-right: 12px;
`;

const ClearButton = styled(TouchableOpacity)`
	tint-color: white;
`;

const ClearIcon = styled(Image)`
	height: 20px;
	width: 20px;
	tint-color: white;
`;

type Props = {
	uni_identifier: string;
	university: Institution;
};

export const EnablePushNotifications = (props: Props) => {
	const language = useLanguage();
	const insets = useSafeAreaInsets();
	const id = getChatRoomIdentifier(props.uni_identifier, props.university);

	const navigation = useNavigationInNative();
	const dispatch = useDispatch();
	const userHasHidden = useAppState((state) =>
		state.hiddenContent.includes(id)
	);
	const subscribedChannels = useAppState((state) =>
		state.notifications.notificationSettings
			? state.notifications.notificationSettings.pushSubscriptions
			: []
	);
	const userHasSubscribed = subscribedChannels.includes(id);
	const userHash = useAppState((state) => getUserHash(state, null));
	const userProfile = useAppState((state) => state.users.userProfile);

	const userDeniedPermissionDialog = useAppState(
		(state) => state.notifications.userDeniedPermissionDialog
	);

	const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

	const isCurrentlySubscribing =
		useAppState(
			(state) => state.notifications.isSwitchingSubscriptionStateForRoom[id]
		) || isLoadingPermissions;

	const credits = useAppState((s) => getPotentialNewNotificationChannels(s));

	const activeButNotSubscribedCreditsAndNotThis = credits.filter((a) => {
		const _id = getChatRoomIdentifier(
			getModuleId(a) as string,
			CreditHelpers.getInstitution(a)
		);
		return !subscribedChannels.includes(_id) && _id !== id;
	});

	const onSubscribe = useCallback(
		() =>
			isCurrentlySubscribing
				? undefined
				: async () => {
						setIsLoadingPermissions(true);
						const response = await requestNotificationPermissions();
						setIsLoadingPermissions(false);
						dispatch(userSignalsNotificationPreference('explicitly-yes'));
						await AsyncStorage.setItem('prefersNotifications', 'true');
						dispatch(
							receiveSystemPermissions(
								response,
								response ? !response.alert : false
							)
						);
						if (response?.alert) {
							if (activeButNotSubscribedCreditsAndNotThis.length > 0) {
								// Has more than 1 active course, let's subscribe to the first one
								dispatch(subscribeToChannelsAction(userHash, [id]));
								navigation.navigate('ActivateMorePushNotifications', {
									postEnable: true,
								});
							} else {
								// Has no active courses but wants to subscribe to 1 channel
								dispatch(subscribeToChannelsAction(userHash, [id]));
							}
						} else {
							Alert.alert(
								rawStrings.ERROR[language],
								rawStrings
									.CANNOT_ENABLE_NOTIFICATIONS_BECAUSE_OF_DENIED_PERMISSIONS[
									language
								]
							);
						}
				  },
		[
			activeButNotSubscribedCreditsAndNotThis.length,
			dispatch,
			id,
			isCurrentlySubscribing,
			language,
			navigation,
			userHash,
		]
	);

	const onHide = useCallback(() => {
		dispatch(hideContent(id));
	}, [dispatch, id]);

	if (
		userHasHidden ||
		!userProfile ||
		userHasSubscribed ||
		userDeniedPermissionDialog
	) {
		return null;
	}

	return (
		<Shadow
			shadowColor="#000000"
			shadowRadius={5}
			shadowOffset={{width: 0, height: 0}}
			shadowOpacity={0.2}
			elevation={3}
		>
			<Container onPress={onSubscribe} style={{paddingLeft: insets.left}}>
				<Cell>
					<Icon source={require('../assets/bell_school_duotone.png')} />
					{isCurrentlySubscribing ? (
						<View style={globalStyles.flex1}>
							<Title>{rawStrings.ENABLE_PUSH_NOTIFICATIONS[language]}</Title>
							<Subtitle>{rawStrings.ACTIVATING[language]}</Subtitle>
						</View>
					) : (
						<View style={globalStyles.flex1}>
							<Title>{rawStrings.ENABLE_PUSH_NOTIFICATIONS[language]}</Title>
							<Subtitle>{rawStrings.ALWAYS_STAY_UP_TO_DATE[language]}</Subtitle>
						</View>
					)}
				</Cell>
			</Container>
			<View style={{paddingRight: insets.right}}>
				{isCurrentlySubscribing ? (
					<ActivityIndicator color="white" />
				) : (
					<ClearButton onPress={onHide}>
						<ClearIcon source={require('../assets/clear.png')} />
					</ClearButton>
				)}
			</View>
		</Shadow>
	);
};
