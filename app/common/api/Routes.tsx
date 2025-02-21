import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {MensaAllergensFilter} from '../../../core/components/MensaAllergensFilter';
import {CategoriesFilter} from '../../../core/components/MensaCategoriesFilter';
import {MensaDietFilter} from '../../../core/components/MensaDietFilter';
import {MensaPriceScreen} from '../../../core/components/MensaPriceScreen';
import {Row} from '../../../core/components/Primitives';
import {RN5Routes, RN5Stacks} from '../../../core/data/rn5-routes';
import {hasGodmodeAccess} from '../../../core/functions/has-godmode-access';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {ActivateMorePushNotifications} from '../components/ActivateMorePushNotifications';
import {ChatRules} from '../components/ChatRules';
import {CreateCustomCredit} from '../components/CreateCustomCredit';
import {CreditConfiguration} from '../components/CreditConfiguration';
import {CreditSidebar} from '../components/CreditSidebar';
import {HeaderTextButton} from '../components/HeaderTextButton';
import {MessageLikeList} from '../components/MessageLikeList';
import MakeNavigation from '../components/Navigation';
import PickSeriesView from '../components/PickSeriesView';
import {ReportGradeStack} from '../components/ReportGrade/ReportGradeNavigator';
import {UploadFile} from '../components/UploadFile/UploadFile';
import {UsernamePicker} from '../components/UsernamePicker';
import {headerStyles} from './header-styles';
import {linkingOptions} from './linking';
import {makeTabOptions} from './make-tab-options';
import {masterNavigator} from './set-master-navigator';
import {useKeyboard} from './use-keyboard-height';
import {useTablet} from './use-tablet';

const Navigator = createBottomTabNavigator<RN5Stacks>();

const CreditSplitView = () => {
	const tablet = useTablet();

	return (
		<Row style={globalStyles.flex1}>
			{tablet && <CreditSidebar />}
			<MakeNavigation
				initialRouteName={'CreditView'}
				include={['CreditView', 'CreditDetailView']}
			/>
		</Row>
	);
};

const BottomTabNavigatorWithoutModals = () => {
	const appearanceMap = useAppearance();
	const tablet = useTablet();
	const isGodmode = useAppState((s) => hasGodmodeAccess(s));
	const keyboardHeight = useKeyboard();
	return (
		<Navigator.Navigator
			lazy
			tabBarOptions={{
				style: {
					...(keyboardHeight === 0 || Platform.OS !== 'android'
						? {}
						: {height: 0}),
					backgroundColor: appearanceMap.TABBAR_COLOR,
					borderTopColor: appearanceMap.TABBAR_BORDER,
				},
			}}
		>
			<Navigator.Screen
				name="Credits"
				options={makeTabOptions(
					require('../assets/twotone_bookmarks_black_48dp.png'),
					{adjustments: {marginTop: Platform.OS === 'android' ? 2 : 0}},
					appearanceMap
				)}
				component={CreditSplitView}
			/>
			<Navigator.Screen
				name="TimeTable"
				options={makeTabOptions(
					require('../assets/twotone_calendar_today_black_48dp.png'),
					{adjustments: {marginTop: Platform.OS === 'android' ? 1 : 0}},
					appearanceMap
				)}
			>
				{() => (
					<MakeNavigation
						initialRouteName="TimeTableView"
						include={['CreditDetailView']}
					/>
				)}
			</Navigator.Screen>
			<Navigator.Screen
				options={makeTabOptions(
					require('../assets/twotone_fastfood_black_48dp.png'),
					{adjustments: {marginTop: Platform.OS === 'android' ? 0 : -2}},
					appearanceMap
				)}
				name="Food"
			>
				{() => <MakeNavigation initialRouteName="FoodView" include={[]} />}
			</Navigator.Screen>
			<Navigator.Screen
				name="Search"
				options={makeTabOptions(
					require('../assets/twotone_search_black_48dp.png'),
					{adjustments: {marginTop: Platform.OS === 'android' ? 4 : 2}},
					appearanceMap
				)}
			>
				{() => (
					<MakeNavigation
						initialRouteName="SearchView"
						include={['SearchView', 'CreditDetailView']}
					/>
				)}
			</Navigator.Screen>
			{tablet ? null : (
				<Navigator.Screen
					name="Settings"
					options={makeTabOptions(
						require('../assets/twotone_settings_black_48dp.png'),
						{},
						appearanceMap
					)}
				>
					{() => (
						<MakeNavigation initialRouteName="SettingsView" include={[]} />
					)}
				</Navigator.Screen>
			)}
			{isGodmode ? (
				<Navigator.Screen
					name="GodChat"
					options={makeTabOptions(
						require('../assets/twotone_chat_bubble_black_48dp.png'),
						{adjustments: {marginTop: Platform.OS === 'android' ? 0 : -2}},
						appearanceMap
					)}
				>
					{() => (
						<MakeNavigation initialRouteName="GodChatContainer" include={[]} />
					)}
				</Navigator.Screen>
			) : null}
		</Navigator.Navigator>
	);
};

const TopStack = createStackNavigator<RN5Routes>();

export const BottomTabNavigator = () => {
	const language = useLanguage();
	const tablet = useTablet();
	const appearance = useAppearance();

	return (
		<Row style={globalStyles.flex1}>
			<NavigationContainer ref={masterNavigator} linking={linkingOptions}>
				<TopStack.Navigator
					screenOptions={{
						...TransitionPresets.ModalPresentationIOS,
						cardOverlayEnabled: true,
						gestureEnabled: true,
						headerStatusBarHeight: 12,
						...headerStyles(appearance, false),
						cardStyle: {
							backgroundColor: appearance.BACKGROUND,
						},
					}}
					mode="modal"
				>
					<TopStack.Screen
						component={BottomTabNavigatorWithoutModals}
						name="BottomTabNavigator"
						options={{
							headerShown: false,
							header: undefined,
						}}
					/>
					<TopStack.Screen
						name="CreateCustomCredit"
						component={CreateCustomCredit}
						options={{
							title: rawStrings.CREATE_CUSTOM_MODULE[language],
						}}
					/>
					<TopStack.Screen
						name="ChatRules"
						component={ChatRules}
						options={{
							title: rawStrings.CHAT_RULES[language],
						}}
					/>
					<TopStack.Screen
						name="AllergenFilter"
						component={MensaAllergensFilter}
						options={{
							title: rawStrings.ALLERGENS[language],
						}}
					/>
					<TopStack.Screen
						name="DietFilter"
						component={MensaDietFilter}
						options={{
							title: rawStrings.ALLERGENS[language],
						}}
					/>
					<TopStack.Screen
						name="PriceFilter"
						component={MensaPriceScreen}
						options={{
							title: rawStrings.PRICE_FILTER[language],
						}}
					/>
					<TopStack.Screen
						name="MensaCategoryFilter"
						component={CategoriesFilter}
						options={{
							title: rawStrings.CATEGORY_FILTER[language],
						}}
					/>
					<TopStack.Screen
						name="UsernamePicker"
						component={UsernamePicker}
						options={{
							title: rawStrings.CHOOSE_YOUR_USERNAME[language],
						}}
					/>
					<TopStack.Screen
						name="ActivateMorePushNotifications"
						component={ActivateMorePushNotifications}
						options={({route}) => ({
							title: route.params.postEnable
								? rawStrings.NOTIFICATIONS_ACTIVATED[language]
								: rawStrings.ACTIVATE_PUSH_TITLE[language],
						})}
					/>
					<TopStack.Screen
						component={CreditConfiguration}
						options={(prop) => ({
							title: prop.route.params.credit.short_name,

							headerRight: () => (
								<TouchableOpacity
									onPress={() => {
										prop.navigation.goBack();
									}}
								>
									<HeaderTextButton>
										{rawStrings.DONE[language]}
									</HeaderTextButton>
								</TouchableOpacity>
							),
							cardStyle: tablet
								? {
										maxWidth: 500,
										alignSelf: 'center',
										height: 800,
										position: 'absolute',
										top: '50%',
										marginTop: -400,
								  }
								: {},
						})}
						name="CreditConfiguration"
					/>
					<TopStack.Screen
						component={PickSeriesView}
						name="PickSeriesView"
						options={({navigation}) => ({
							title: rawStrings.SELECT_SERIES[language],
							headerRight: () => (
								<TouchableOpacity
									onPress={() => {
										navigation.goBack();
									}}
								>
									<HeaderTextButton>
										{rawStrings.DONE[language]}
									</HeaderTextButton>
								</TouchableOpacity>
							),
						})}
					/>
					<TopStack.Screen
						component={MessageLikeList}
						name="MessageLikeList"
						options={{
							title: rawStrings.LIKES_FOR_THIS_MESSAGE[language],
						}}
					/>
					<TopStack.Screen
						component={UploadFile}
						name="UploadFile"
						options={{
							title: rawStrings.UPLOAD_FILE[language],
						}}
					/>
					<TopStack.Screen
						component={ReportGradeStack}
						name="ReportGrade"
						options={{
							title: rawStrings.REPORT_GRADE[language],
							headerShown: false,
						}}
					/>
				</TopStack.Navigator>
			</NavigationContainer>
		</Row>
	);
};
