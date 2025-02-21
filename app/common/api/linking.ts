import {LinkingOptions} from '@react-navigation/native';

export const linkingOptions: LinkingOptions = {
	prefixes: [
		'https://bestande.ch',
		'https://www.bestande.ch',
		'http://localhost:8080',
	],
	config: {
		screens: {
			ChatRules: 'rules',
			UsernamePicker: 'username',
			CreateCustomCredit: 'create',
			BottomTabNavigator: {
				screens: {
					Credits: {
						screens: {
							CreditView: 'home',
							CreditDetailView: 'credits/:institution/:moduleId/:semester',
							RecommendationBooks: 'books',
							RecommendationView: 'recommendations',
						},
						initialRouteName: 'CreditView',
					},
					TimeTable: {
						screens: {
							TimeTableView: 'timetable',
							PersonView: ':unislug/person/:uni_identifier',
							RoomDetailView: ':unislug/room/:uni_identifier',
							EventDetailView:
								':unislug/event/:eventserieid/:uni_identifier/:semester',
							TimetableOptions: 'timetable/settings',
							TimetableOptionDetail:
								'timetable/settings/:unislug/:uni_identifier/:semester',
						},
						initialRouteName: 'TimeTableView',
					},
					Food: {
						screens: {
							FoodView: 'food',
						},
					},
					Search: {
						screens: {
							SearchView: 'search',
						},
					},
					Settings: {
						screens: {
							SettingsView: 'settings',
							Changelog: 'changelog',
							NotificationSettings: 'notifications',
						},
						initialRouteName: 'SettingsView',
					},
				},
			},
		},
		initialRouteName: 'BottomTabNavigator',
	},
};
