import got from 'got';
import {UzhApiEventsResponse, UzhApiResponse} from '../../../core/types/types';
import {
	detailPayload,
	eventPayload,
	listPayload,
	roomPayload,
} from './make-uzh-batch-payload-request';

const extractJSON = (body: string) => {
	return JSON.parse(body);
};

const makeRequestWithPayload = async <T = UzhApiResponse<any>>(
	body: string,
	lang: 'de' | 'en'
): Promise<T> => {
	const response = await got(
		'https://studentservices.uzh.ch/sap/opu/odata/uzh/vvz_data_srv/' + body,
		{
			headers: {
				Accept: 'application/json',
				'Accept-Language': lang,
				'X-Requested-With': 'X',
				Cookie: `sap-usercontext=sap-language=${
					lang === 'de' ? 'de' : 'en-US'
				};QueueITAccepted-SDFrts345E-V3_queuemb20220817=EventId%3Dqueuemb20220817%26QueueId%3D00000000-0000-0000-0000-000000000000%26RedirectType%3Dafterevent%26IssueTime%3D1661162149%26Hash%3Dab7a54ff4657b9d15a2a62e696d32b8d699d51017c844ceb4ec89d508bc50907`,
			},
			retry: 3,
		}
	);
	const json = extractJSON(response.body);
	if (json.error) {
		throw new Error(json.error.message.value);
	}

	return json.d;
};

export const fetchModule = async (
	moduleID: string | number,
	year: string | number,
	session: string,
	lang: 'de' | 'en'
) => {
	return makeRequestWithPayload(detailPayload(moduleID, year, session), lang);
};

export const fetchList = async (results = 20, offset = 0, query = {}) => {
	return makeRequestWithPayload(listPayload(results, offset, query), 'en');
};

export const fetchEvents = async (
	eventSeriesID: string,
	year: number,
	session: string
) => {
	return makeRequestWithPayload<UzhApiEventsResponse>(
		eventPayload(eventSeriesID, year, session),
		'en'
	);
};

export const fetchRoom = async (roomId, year, session) => {
	return makeRequestWithPayload(roomPayload(roomId, year, session), 'en');
};
