import {IMessage, User as GiftedUser} from 'react-native-gifted-chat';
import {ChatMessage} from '../actions/chat-server';
import {Allergen} from '../models/allergens';
import {AppLanguage} from '../models/app-language';
import {Institution} from '../models/credit';
import {ModulePreview, RatingSummary, UserCount} from '../models/module';
import {ExpandedPublicFileSharingDocument} from './file-sharing-document';
import {EventSerieWithEventsAndPeople, EventType} from './schedule';
import {User} from './user-state';

export type Job<T> = {
	attrs: {
		data: T;
	};
	type?: string;
	timeout?: number;
};

export type FileSortOption =
	| 'newest'
	| 'oldest'
	| 'biggest'
	| 'most_downloaded'
	| 'smallest';

export type UzhApiResponse<T> = T;

export type UzhApiEventsResponse = UzhApiResponse<{
	Schedule: {
		results: any;
	};
}>;

export type MealFlags = {
	allergens?: Allergen[];
	origins?: string[];
	swiss_meat?: boolean;
	vegetarian?: boolean;
	vegan?: boolean;
	removeFootnote?: boolean;
	gluten_free?: boolean;
};

export type ImageSize = {
	width: number;
	height: number;
	type?: string;
	orientation?: number;
};

export type CourseSeriesResponse = {
	total: number;
	modules: ModulePreview[];
};

export type MessageAttachment = {
	type: 'FILE_ATTACHMENT';
	fileId: string;
	fileName: string;
	key: string;
};

export interface UserWithExtraFields extends GiftedUser {
	verified: boolean;
}

export interface IMessageWithQuotes extends IMessage {
	quotes?: string | null;
	attachments?: MessageAttachment[];
	user: UserWithExtraFields;
}

export type ExamReturnStatistic = {
	exam_date: number;
	return_date: number;
	uni_identifier: string;
	university: Institution;
	reporter: string | null;
	differenceInHours: number;
	period: number;
	comment?: string;
	chatLanguage: AppLanguage;
	reporterNotifiedViaPush: boolean;
};

export type ExpandedExamReturnStatistic = Omit<
	ExamReturnStatistic,
	'reporter'
> & {
	reporter: User | null;
};

export type ModuleIdAndName = {
	uni_identifier: string;
	university: Institution;
	short_name: string;
	ratingSummary: RatingSummary;
	userCount: UserCount;
};

export type LastMessagesResponse = {
	messages: ChatMessage[];
	users: User[];
	courses: ModuleIdAndName[];
};

type MultiLingString = {[key in AppLanguage]: string};

export type CoronaInfo = {
	timetableBanner: {
		link: string;
		text: MultiLingString;
	} | null;
	cancellationDeadlineBanner: {
		link: string;
		text: MultiLingString;
	} | null;
	mainViewBanner: {
		link: string;
		text: MultiLingString;
	} | null;
};

export type CourseDocumentsResponse = {
	documents: ExpandedPublicFileSharingDocument[];
	total: number;
};

type FileUpgradeToken = '_Aktualisiere Bestande, um diese Datei zu sehen._';
export const FILE_UPGRADE_TOKEN: FileUpgradeToken =
	'_Aktualisiere Bestande, um diese Datei zu sehen._';

export type GetEventResponse = {
	event: EventType;
	event_serie: EventSerieWithEventsAndPeople;
};
