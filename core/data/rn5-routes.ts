import {Credit, Institution} from '../models/credit';
import {CourseCode} from '../models/module';
import {PromotionResponse} from '../models/promotion';
import {ExpandedPublicFileSharingDocument} from '../types/file-sharing-document';

export type RN5Stacks = {
	Credits: {};
	TimeTable: {};
	Food: {};
	Search: {};
	Settings: {};
	GodChat: {};
	BottomTabNavigator: {};
	CreateCustomCreditStack: {};
};

export type RN5Routes = RN5Stacks & {
	CreditDetailView: {
		credit: Credit | null;
		moduleId: string;
		chatFirst: boolean;
		semester: string | null;
		institution: Institution;
	};
	ChatRules: undefined;
	CreditView: undefined;
	RoomDetailView: {
		uni_identifier: string;
		unislug: string;
	};
	EventDetailView: {
		eventserieid: string;
		uni_identifier: string;
		unislug: string;
		number: number;
		semester: string;
	};
	TimeTableView: undefined;
	PickSeriesView: {
		credit: Credit;
		semester: string;
	};
	SearchView: undefined;
	PromotedEvent: {
		event: PromotionResponse;
	};
	PersonView: {
		unislug: string;
		uni_identifier: string;
	};
	SettingsView: undefined;
	DevMenu: undefined;
	RecommendationBooks: undefined;
	RecommendationView: undefined;
	TimetableOptions: undefined;
	FoodView: undefined;
	TimetableOptionDetail: {
		semester: string;
		uni_identifier: string;
		unislug: string;
	};
	CreditConfiguration: {
		credit: Credit;
		showAddedIndicator: boolean;
	};
	NotificationSettings: undefined;
	GodChatContainer: undefined;
	OtherCoursesInSeries: {
		courseCode: CourseCode;
		institution: Institution;
	};
	Changelog: undefined;
	CreateCustomCredit: {
		name: string;
	};
	AllergenFilter: undefined;
	DietFilter: undefined;
	PriceFilter: undefined;
	MensaCategoryFilter: undefined;
	UsernamePicker: undefined;
	ActivateMorePushNotifications: {
		postEnable: boolean;
	};
	MessageLikeList: {
		messageId: string;
	};
	UploadFile: {
		uni_identifier: string;
		university: Institution;
		// TODO: This is a non-serializable callback
		// Will break on web
		onFileAdd: (file: ExpandedPublicFileSharingDocument) => void;
	};
	ReportGrade: {
		uni_identifier: string;
		university: Institution;
	};
};
