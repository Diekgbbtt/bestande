import pickBy from 'lodash/pickBy';
import md5 from 'md5';
import {WithId} from 'mongodb';
import {PlatformOSType} from 'react-native';
import {
	MessagesApiResponse,
	ReportMessageRequest,
	ReportMessageResponse,
	SingleMessageApiResponse,
	UsernameAvailabilityReport,
} from '../actions/chat-server';
import {GetProfileRequest, SetUsernamePayload} from '../actions/users';
import {Changelog} from '../data/changelog';
import {
	Credit,
	CustomModule,
	GetCoursesResponse,
	Institution,
} from '../models/credit';
import {DOMAIN, VERSION_NUMBER} from '../models/domain';
import {VIEW} from '../models/impression-level';
import {Impression} from '../models/impression-type';
import {ApiResponse} from '../reducers/api';
import {
	NonceResponse,
	SetCoursesResponse,
	UpdateCoursesRequest,
} from '../types/course-sync';
import {
	ExamReturnPutRequest,
	ExpandedPublicFileSharingDocument,
	FileSharingUploadRequest,
} from '../types/file-sharing-document';
import {NotificationSettings} from '../types/notifications-state';
import {RatingRequest, RatingSortOption, Voting} from '../types/ratings';
import {
	CourseDocumentsResponse,
	CourseSeriesResponse,
	ExamReturnStatistic,
	FileSortOption,
	GetEventResponse,
} from '../types/types';
import {User} from '../types/user-state';
import {cannotNavigate} from './cannot-navigate';
import {CreditHelpers} from './CreditHelpers';
import {getModuleId} from './get-module-id';
import {mapToUniSlug} from './uni-slug';

// 'http://192.168.68.186:3000/api';
const request = fetch;
export const getModule = async (institution: string, moduleId: string) => {
	const url = `${DOMAIN}/institution/${institution}/module/${moduleId}`;

	const response = await request(url, {credentials: 'include'});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const appStatus = async (version: string, platform: PlatformOSType) => {
	const response = await request(
		`${DOMAIN}/status/app?version=${version}&platform=${platform}`,
		{credentials: 'include'}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const getChangelog = async (platform: PlatformOSType) => {
	const response = await request(
		`${DOMAIN}/status/app/changelog?platform=${platform}`,
		{credentials: 'include'}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data as Changelog;
};

export const getCourses = async (hash: string): Promise<GetCoursesResponse> => {
	const response = await request(`${DOMAIN}/account/courses`, {
		method: 'get',
		headers: {
			'Content-type': 'application/json',
			'x-bestande-token': hash,
		},
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const fetchServerNonce = async (hash: string): Promise<NonceResponse> => {
	const response = await request(`${DOMAIN}/account/nonce`, {
		headers: {
			'content-type': 'application/json',
			'x-bestande-token': hash,
			credentials: 'include',
		},
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const removeCourse = async (
	credit: Credit | CustomModule,
	hash: string,
	nonce: number
): Promise<SetCoursesResponse> => {
	const body: UpdateCoursesRequest = {
		payload: {
			type: 'remove-course',
			removal: {
				uni_identifier: getModuleId(credit) as string,
				university: CreditHelpers.getInstitution(credit),
			},
		},
		token: hash,
		nonce,
	};
	const response = await request(`${DOMAIN}/account/courses`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const syncCourses = async (
	credits: Credit[],
	hash: string,
	nonce: number
): Promise<SetCoursesResponse> => {
	const body: UpdateCoursesRequest = {
		payload: {
			type: 'set-courses',
			courses: credits
				.filter((c) => !cannotNavigate(c))
				.map((c) => {
					return {
						grade: c.grade,
						period: CreditHelpers.getPeriod(c) as number,
						uni_identifier: getModuleId(c) as string,
						university: CreditHelpers.getInstitution(c),
					};
				}),
		},
		token: hash,
		nonce,
	};
	const response = await request(`${DOMAIN}/account/courses`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const doTelemetry = async (
	institution: Institution,
	credits: (Credit | ApiResponse)[],
	username: string,
	hash: string
) => {
	const body = {
		data: credits
			.filter((c) => !cannotNavigate(c))
			.map((c) => {
				return {
					uni_identifier: getModuleId(c),
					period: CreditHelpers.getSemester(c),
				};
			}),
		loggedOut: false,
	};
	if (!username && !hash) {
		return;
	}

	if (!username) {
		body.loggedOut = true;
	}

	const response = await request(
		`${DOMAIN}/institution/${mapToUniSlug(institution)}/telemetry?identifier=${
			hash ? hash : md5(username)
		}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			method: 'POST',
			credentials: 'include',
		}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return true;
};

export const getRecommendations = async (
	institution: Institution,
	modules: {uni_identifier: string}[]
) => {
	const response = await request(
		`${DOMAIN}/institution/${mapToUniSlug(institution)}/recommendations`,
		{
			headers: {
				'Content-Type': 'application/json',
			},

			method: 'post',
			body: JSON.stringify({modules}),
			credentials: 'include',
		}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json;
};

export const getRelatedModules = async (
	institution: Institution,
	uni_identifier: string
) => {
	const response = await request(
		`${DOMAIN}/institution/${mapToUniSlug(
			institution
		)}/module/${uni_identifier}/related`,
		{credentials: 'include'}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const submitExamReturn = async (payload: ExamReturnPutRequest) => {
	const body = JSON.stringify(payload);

	const response = await request(`${DOMAIN}/examreturns`, {
		method: 'put',
		body,
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data as {
		statistic: WithId<ExamReturnStatistic>;
	};
};

export const voteRating = async ({
	_id,
	vote,
	token,
}: {
	_id: string;
	vote: Voting;
	token: string;
}) => {
	const body = JSON.stringify({
		vote,
		token,
	});

	const response = await request(`${DOMAIN}/ratings/${_id}/vote`, {
		headers: {
			'Content-Type': 'application/json',
		},
		body,
		method: 'POST',
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return true;
};

export const sendAddRating = async ({
	score,
	review,
	name,
	grade,
	uni_identifier,
	university,
	token,
}: {
	review: string | null;
	name: string | null;
	grade: string | null;
	uni_identifier: string;
	university: Institution;
	token: string;
	score: number;
}) => {
	const rating = pickBy({
		score,
		review,
		name,
		grade,
		uni_identifier,
		university,
		token,
	});

	const body = JSON.stringify(rating);

	const response = await request(`${DOMAIN}/ratings`, {
		headers: {
			'Content-type': 'application/json',
		},
		body,
		method: 'PUT',
		credentials: 'include',
	});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const sendUpdateRating = async (
	_id: string,
	rating: Partial<RatingRequest>
) => {
	const body = JSON.stringify(rating);

	const response = await request(`${DOMAIN}/ratings/${_id}`, {
		headers: {
			'Content-Type': 'application/json',
		},
		body,
		method: 'POST',
		credentials: 'include',
	});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.rating;
};

export const getMyRatings = async (token: string) => {
	const body = JSON.stringify({
		token,
	});

	const response = await request(`${DOMAIN}/ratings/mine`, {
		headers: {
			'Content-Type': 'application/json',
		},
		body,
		method: 'POST',
		credentials: 'include',
	});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const getRatings = async ({
	institution,
	uni_identifier,
	offset,
	sortOption,
	token,
	email,
}: {
	institution: Institution;
	uni_identifier: string;
	offset: number;
	sortOption: RatingSortOption;
	token: string | null;
	email?: string | undefined;
}) => {
	const response = await request(
		`${DOMAIN}/institution/${mapToUniSlug(
			institution
		)}/module/${uni_identifier}/ratings?offset=${offset}&sort=${sortOption}&email=${email}`,
		{
			credentials: 'include',
		}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json;
};

export const sendDeleteRating = async (_id: string, token: string) => {
	const body = JSON.stringify({
		token,
	});

	const response = await request(`${DOMAIN}/ratings/${_id}`, {
		headers: {
			'Content-Type': 'application/json',
		},
		body,
		method: 'DELETE',
		credentials: 'include',
	});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json;
};

export const addImpression = async ({
	institution,
	identifier,
	platform,
	content,
	domain = DOMAIN,
	content_id,
	level = VIEW,
	language,
}: Omit<Impression, 'date'>) => {
	const impression = pickBy({
		identifier,
		content,
		platform,
		content_id,
		level,
		language,
		version: VERSION_NUMBER,
	});
	if (!content) {
		throw new Error('Content Type required.');
	}

	const body = JSON.stringify(impression);
	const response = await request(
		`${domain}/institution/${mapToUniSlug(institution)}/telemetry/impression`,
		{
			headers: {
				'Content-type': 'application/json',
			},
			body,
			method: 'POST',
			credentials: 'include',
		}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return impression;
};

export const loadMessages = async (
	institution: Institution | null,
	moduleId: string,
	count: number,
	before: number
): Promise<{
	success: true;
	data: MessagesApiResponse;
}> => {
	const url = `${DOMAIN}/chat/messages?before=${before}&limit=${count}&university=${String(
		institution
	)}&uni_identifier=${moduleId}`;
	const response = await request(url, {credentials: 'include'});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json as {success: true; data: MessagesApiResponse};
};

export const getSingleMessage = async (
	messageId: string
): Promise<{
	success: true;
	data: SingleMessageApiResponse;
}> => {
	const url = `${DOMAIN}/chat/messages/${messageId}`;
	const response = await request(url, {credentials: 'include'});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json as {success: true; data: SingleMessageApiResponse};
};

export const setChatUsername = async (
	payload: SetUsernamePayload
): Promise<{
	success: true;
	data: User;
}> => {
	const url = `${DOMAIN}/chat/username`;
	const response = await request(url, {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify(payload),
		credentials: 'include',
	});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json as {
		success: true;
		data: User;
	};
};

export const reportMessage = async (
	payload: ReportMessageRequest
): Promise<{
	success: true;
	data: ReportMessageResponse;
}> => {
	const url = `${DOMAIN}/chat/report`;
	const response = await request(url, {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify(payload),
		credentials: 'include',
	});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json as {
		success: true;
		data: ReportMessageResponse;
	};
};

export const getProfile = async (
	payload: GetProfileRequest
): Promise<{
	success: true;
	data: User;
}> => {
	const url = `${DOMAIN}/chat/profile`;
	const response = await request(url, {
		method: 'post',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify(payload),
		credentials: 'include',
	});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json as {
		success: true;
		data: User;
	};
};

export const usernameCheck = async (
	username: string
): Promise<{
	success: true;
	data: UsernameAvailabilityReport;
}> => {
	const url = `${DOMAIN}/chat/username-availability?username=${username}`;
	const response = await request(url, {credentials: 'include'});

	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json as {success: true; data: UsernameAvailabilityReport};
};

export const registerNotificationToken = async (req: {
	token: string;
	notificationToken: string;
	platform: string;
}) => {
	const url = `${DOMAIN}/notifications/register`;
	const response = await request(url, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(req),
		credentials: 'include',
	});
	const data = await response.json();
	return data;
};

export const subscribeToChannels = async (token: string, channels: string[]) => {
	const url = `${DOMAIN}/notifications/subscribe`;
	const response = await request(url, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			token,
			channels,
		}),
		credentials: 'include',
	});
	const data = await response.json();
	return data.data;
};

export const unsubscribeFromChannels = async (token: string, channels: string[]) => {
	const url = `${DOMAIN}/notifications/unsubscribe`;
	const response = await request(url, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			token,
			channels,
		}),
		credentials: 'include',
	});
	const data = await response.json();
	return data.data;
};

export const getNotificationSettings = async (
	token: string
): Promise<NotificationSettings> => {
	const url = `${DOMAIN}/chat/notification-settings`;
	const response = await request(url, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			token,
		}),
		credentials: 'include',
	});
	const data = await response.json();
	return data.data as NotificationSettings;
};

export const updateProfilePicture = async (
	token: string,
	image: string
): Promise<{avatar: string}> => {
	const url = `${DOMAIN}/chat/profile-picture`;
	const response = await request(url, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			token,
			image,
		}),
		credentials: 'include',
	});
	const data = await response.json();
	return data.data as {avatar: string};
};

export const deleteProfilePicture = async (token: string): Promise<{}> => {
	const url = `${DOMAIN}/chat/profile-picture`;
	const response = await request(url, {
		method: 'delete',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			token,
		}),
		credentials: 'include',
	});
	const data = await response.json();
	return data.data;
};

export const getCourseSeries = async (
	university: Institution,
	courseCode: string,
	page = 0
): Promise<CourseSeriesResponse> => {
	const url = `${DOMAIN}/institution/${mapToUniSlug(
		university
	)}/series/${courseCode}?page=${page}`;
	const response = await request(url, {credentials: 'include'});
	const data = await response.json();
	return data.data as CourseSeriesResponse;
};

export const uploadDocument = async (
	document: FileSharingUploadRequest
): Promise<{
	document: ExpandedPublicFileSharingDocument;
}> => {
	const response = await request(`${DOMAIN}/documents`, {
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify(document),
		method: 'PUT',
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const getDocument = async (
	documentId: string
): Promise<ExpandedPublicFileSharingDocument> => {
	const response = await request(`${DOMAIN}/documents/${documentId}`, {
		headers: {
			'Content-type': 'application/json',
		},
		method: 'GET',
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const deleteDocument = async (
	documentId: string,
	token: string
): Promise<{}> => {
	const response = await request(`${DOMAIN}/documents/${documentId}`, {
		headers: {
			'Content-type': 'application/json',
		},
		method: 'DELETE',
		body: JSON.stringify({
			token,
		}),
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json;
};

export const getDocumentsForCourse = async (
	university: Institution,
	uni_identifier: string,
	sortOption: FileSortOption
): Promise<CourseDocumentsResponse> => {
	const response = await request(
		`${DOMAIN}/institution/${mapToUniSlug(
			university
		)}/module/${uni_identifier}/documents?sort=${sortOption}`,
		{
			headers: {
				'Content-type': 'application/json',
			},
			method: 'GET',
			credentials: 'include',
		}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const getEventAndEventSerie = async (params: {
	event_serie_id: string;
	id: string;
	semester: string;
	university: Institution;
}): Promise<GetEventResponse> => {
	const response = await request(
		`${DOMAIN}/institution/${mapToUniSlug(params.university)}/event/${
			params.event_serie_id
		}/${params.id}/${params.semester}`,
		{
			headers: {
				'content-type': 'application/json',
			},
			method: 'GET',
			credentials: 'include',
		}
	);
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};

export const reportReview = async ({
	id,
	token,
	reason,
}: {
	token: string;
	reason: string;
	id: string;
}): Promise<void> => {
	const response = await request(`${DOMAIN}/ratings/${id}/report`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			token,
			reason,
		}),
		credentials: 'include',
	});
	const json = await response.json();
	if (!json.success) {
		throw new Error(json.error);
	}

	return json.data;
};
