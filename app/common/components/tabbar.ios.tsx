import PushNotifications from '@react-native-community/push-notification-ios'; // eslint-disable-line
import {CommonActions} from '@react-navigation/native';
import React from 'react';
import {DeviceEventEmitter, View} from 'react-native';
import QuickActions from 'react-native-quick-actions';
import styled from 'styled-components';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {NotificationEvents} from '../api/NotificationEvents';
import {BottomTabNavigator} from '../api/Routes';
import {globalNavigationDispatch} from '../api/set-master-navigator';
import {showKeyboardConfig} from '../api/showSearchKeyboard';

const initialRouteName = 'Credits';

const Container = styled(View)`
	flex: 1;
	justify-content: center;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const getInitialTab = (action) => {
	if (!action) {
		return initialRouteName;
	}

	if (action.type === 'timetable') {
		return 'TimeTable';
	}

	if (action.type === 'food') {
		return 'Food';
	}

	if (action.type === 'search') {
		return 'Search';
	}

	return initialRouteName;
};

type NotificationPayload =
	| {
			uni_identifier?: string;
			university: Institution;
			type: undefined;
	  }
	| {
			type: 'RecommendedBooks';
	  };

const TabBar = () => {
	const ready = useAppState((state) => state.ready.app);
	const language = useLanguage();

	const handlePushNotification = React.useCallback(
		(
			data:
				| (NotificationPayload & {
						_data?: NotificationPayload;
				  })
				| null
		) => {
			if (!data) {
				return;
			}

			let withTimeout = false;
			// When doing initialNotification
			if (data._data) {
				data = data._data;
				if (!data) {
					return;
				}

				withTimeout = true;
			}

			const finalData = data as NotificationPayload;
			if (finalData.type === 'RecommendedBooks') {
				globalNavigationDispatch(
					CommonActions.navigate({
						name: 'RecommendationBooks',
						params: {},
					})
				);
			} else if (finalData.university && finalData.uni_identifier) {
				if (withTimeout) {
					setTimeout(() => {
						globalNavigationDispatch(
							CommonActions.navigate({
								name: 'CreditDetailView',
								params: {
									moduleId: finalData.uni_identifier,
									institution: finalData.university,
									chatFirst: true,
								},
							})
						);
					}, 300);
					return;
				}

				globalNavigationDispatch(
					CommonActions.navigate({
						name: 'CreditDetailView',
						params: {
							moduleId: finalData.uni_identifier,
							institution: finalData.university,
							chatFirst: true,
						},
					})
				);
			}
		},
		[]
	);

	React.useEffect(() => {
		if (!ready) {
			return;
		}

		PushNotifications.getInitialNotification()
			// @ts-expect-error
			.then(handlePushNotification)
			.catch((err) => {
				console.log('Could not pop initial notification', err);
			});
	}, [handlePushNotification, ready]);

	React.useEffect(() => {
		if (!ready) {
			return;
		}

		QuickActions.popInitialAction()
			.then((action) => {
				const tab = getInitialTab(action);
				if (tab !== initialRouteName) {
					globalNavigationDispatch(
						CommonActions.navigate({
							name: tab,
							params: {},
						})
					);
				}
			})
			.catch((err) => {
				console.log('could not pop initial aciton', err);
			});

		DeviceEventEmitter.addListener('quickActionShortcut', (action) => {
			if (action.type === 'timetable') {
				globalNavigationDispatch(
					CommonActions.navigate({
						name: 'TimeTable',
						params: {},
					})
				);
			}

			if (action.type === 'food') {
				globalNavigationDispatch(
					CommonActions.navigate({
						name: 'Food',
						params: {},
					})
				);
			}

			if (action.type === 'search') {
				showKeyboardConfig.showSearchKeyboard = true;
				globalNavigationDispatch(
					CommonActions.navigate({
						name: 'Search',
						params: {},
					})
				);
			}
		});
		NotificationEvents.on('new-notification', handlePushNotification);
		QuickActions.setShortcutItems([
			{
				type: 'timetable',
				title: rawStrings.TIMETABLE[language],
				icon: 'Date',
				userInfo: {
					url: 'bestande://timetable',
				},
			},
			{
				type: 'food',
				title: rawStrings.MENSA[language],
				icon: 'Food',
				userInfo: {
					url: 'bestande://food',
				},
			},
			{
				type: 'search',
				title: rawStrings.SEARCH[language],
				icon: 'Search',
				userInfo: {
					url: 'bestande://search',
				},
			},
		]);
	}, [handlePushNotification, language, ready]);
	if (!ready) {
		return (
			<Container>
				<UnifiedProgress />
			</Container>
		);
	}

	return <BottomTabNavigator />;
};

// ts-unused-exports:disable-next-line
export default TabBar;
