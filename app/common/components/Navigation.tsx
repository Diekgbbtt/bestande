import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {ChangelogView} from '../../../core/components/Changelog';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {creditViewOptions} from '../api/credit-view-options';
import {headerStyles} from '../api/header-styles';
import {useTablet} from '../api/use-tablet';
import {CreditDetailViewContent} from './CreditDetailView';
import {CreditViewContent} from './CreditViewContent';
import {CreditViewTitle} from './CreditViewTitle';
import {DevMenu} from './DevMenu';
import {EventDetailView} from './EventDetailView';
import {FoodView} from './FoodView';
import {GodChat} from './GodChat';
import {HeaderIconRow} from './HeaderIconRow';
import MensaPicker from './MensaPicker';
import ModuleStatusButton from './ModuleStatusButton';
import NotificationSettings from './NotificationSettings';
import OtherCourseSeries from './OtherCoursesInSeries';
import {PersonView} from './PersonView';
import PromotedEvent from './PromotedEvent';
import RecommendationView from './RecommendationView';
import {RecommendBooks} from './RecommendBooks';
import {RightPaneCreditView} from './RightPaneCreditView';
import RoomDetailView from './RoomDetailView';
import {SearchView} from './SearchView';
import SettingsView from './SettingsView';
import TimeTableHeader from './TimeTableHeader';
import TimetableOptionDetail from './TimetableOptionDetail';
import TimetableOptions from './TimeTableOptions';
import {TimeTableOptionsButton} from './TimeTableOptionsButton';
import {TimeTableView} from './TimeTableView';
import TimetableWeekSwitcher from './TimeTableWeekSwitcher';

const Stack = createStackNavigator<RN5Routes>();

const styles = StyleSheet.create({
	overflow: {
		overflow: 'hidden',
		flex: 1,
	},
});

const MakeNavigation = (props: {
	initialRouteName: keyof RN5Routes;
	include: string[];
}) => {
	const appearance = useAppearance();
	const language = useLanguage();
	const tablet = useTablet();
	const dim = useWindowDimensions();
	const landscape = dim.width > dim.height;

	const headerStyle = headerStyles(
		appearance,
		props.initialRouteName === 'SearchView' ||
			props.initialRouteName === 'FoodView'
	);
	return (
		<View style={styles.overflow}>
			<Stack.Navigator
				initialRouteName={props.initialRouteName}
				screenOptions={{
					...headerStyle,
				}}
			>
				{props.include.includes('CreditView') ? (
					<Stack.Screen
						component={RightPaneCreditView}
						name="CreditView"
						options={
							tablet
								? {
										headerTitle: () => null,
								  }
								: creditViewOptions(tablet)
						}
					/>
				) : null}
				{props.include.includes('LeftPaneCreditView') ? (
					<Stack.Screen
						component={CreditViewContent}
						name="CreditView"
						options={creditViewOptions(tablet)}
					/>
				) : null}
				{props.include.includes('CreditDetailView') ? (
					<Stack.Screen
						component={CreditDetailViewContent}
						name="CreditDetailView"
						options={({route}) => ({
							headerTitle: () => (
								<CreditViewTitle
									uni_identifier={route.params?.moduleId}
									institution={route.params?.institution}
								/>
							),
							headerRight: () => (
								<ModuleStatusButton
									semester={route.params?.semester ?? null}
									moduleId={route.params?.moduleId}
									institution={route.params?.institution}
								/>
							),
						})}
					/>
				) : null}
				<Stack.Screen
					component={RoomDetailView}
					name="RoomDetailView"
					options={{
						title: rawStrings.ROOM[language],
					}}
				/>
				<Stack.Screen
					component={EventDetailView}
					name="EventDetailView"
					options={{
						title: rawStrings.EVENT[language],
					}}
				/>
				<Stack.Screen
					component={TimeTableView}
					options={{
						headerTitle: () => <TimeTableHeader />,
						headerLeft: () => (
							<HeaderIconRow>
								<TimetableWeekSwitcher increment={-1} />
							</HeaderIconRow>
						),
						headerRight: () => (
							<HeaderIconRow>
								<TimeTableOptionsButton />
								<TimetableWeekSwitcher increment={1} />
							</HeaderIconRow>
						),
						title: rawStrings.TIMETABLE[language],
						headerBackTitle: undefined,
						headerTruncatedBackTitle: undefined,
					}}
					name="TimeTableView"
				/>
				{props.include.includes('SearchView') ? (
					<Stack.Screen
						component={SearchView}
						name="SearchView"
						options={{
							headerShown: false,
						}}
					/>
				) : null}
				<Stack.Screen
					component={PromotedEvent}
					name="PromotedEvent"
					options={({route}) => ({
						title: route.params.event.name,
					})}
				/>
				<Stack.Screen
					component={PersonView}
					name="PersonView"
					options={{
						title: rawStrings.PERSON[language],
					}}
				/>
				<Stack.Screen
					component={SettingsView}
					name="SettingsView"
					options={{
						title: rawStrings.SETTINGS[language],
					}}
				/>
				<Stack.Screen component={DevMenu} name="DevMenu" />
				<Stack.Screen
					name="RecommendationBooks"
					component={RecommendBooks}
					options={{
						title: rawStrings.RELEVANT_BOOKS[language],
					}}
				/>
				<Stack.Screen
					component={RecommendationView}
					name="RecommendationView"
					options={{
						title: rawStrings.RECOMMENDED_COURSES[language],
					}}
				/>
				<Stack.Screen
					component={TimetableOptions}
					name="TimetableOptions"
					options={{
						title: rawStrings.ADJUST_TIMETABLE[language],
					}}
				/>
				<Stack.Screen
					component={FoodView}
					options={{
						headerTitle: () => <MensaPicker />,
						headerStyle: {
							...headerStyle.headerStyle,
							height: landscape ? 60 : undefined,
						},
					}}
					name="FoodView"
				/>
				<Stack.Screen
					component={TimetableOptionDetail}
					options={{
						title: rawStrings.CONFIGURE_TIMETABLE[language],
					}}
					name="TimetableOptionDetail"
				/>
				<Stack.Screen
					component={NotificationSettings}
					name="NotificationSettings"
					options={{
						title: rawStrings.NOTIFICATION_SETTINGS[language],
					}}
				/>
				<Stack.Screen
					component={GodChat}
					options={{
						title: 'God Mode',
					}}
					name="GodChatContainer"
				/>
				<Stack.Screen
					component={OtherCourseSeries}
					name="OtherCoursesInSeries"
					options={({route}) => ({
						title: route.params.courseCode?.series || '',
					})}
				/>

				<Stack.Screen
					component={ChangelogView}
					options={{
						title: 'Changelog',
					}}
					name="Changelog"
				/>
			</Stack.Navigator>
		</View>
	);
};

export default MakeNavigation;
